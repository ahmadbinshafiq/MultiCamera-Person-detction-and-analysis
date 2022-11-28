import numpy as np
import cv2
from openvino.runtime import Core

from image_ops import ImageOperations


class Openvino(ImageOperations):
    def __init__(self, model_path, device="CPU"):
        super().__init__()
        ie = Core()
        model = ie.read_model(model=model_path)
        self.compiled_model = ie.compile_model(model=model, device_name=device)
        self.input_layer = self.compiled_model.input(0)
        self.output_layer_loc = self.compiled_model.output(0)

    def model_arch(self, model_name):
        print(f"{model_name} arch.")
        print(f"\n{self.compiled_model}\n")

    def __inference(self, image):
        bbox = self.compiled_model([image])[self.output_layer_loc]
        return bbox

    def __do_inference(self, image):
        reshaped_image, resized_image = ImageOperations.preprocess_image(
            image, self.input_layer.shape
        )
        result = self.__inference(reshaped_image)
        return result

    def detect_faces(self, image):
        result = self.__do_inference(image)
        frame, face_bboxes, face_in_ROI = self.facial_postprocessing(result, image)
        if len(face_bboxes) > 0:
            return face_bboxes, face_in_ROI
        return np.array([]), face_in_ROI

    def generate_embeddings(self, tracked_objs, image, show_face=False):
        for id in tracked_objs["data"].keys():
            bbox = tracked_objs["data"][id]["face_coord"]
            if bbox.size > 0:
                try:
                    face_image = ImageOperations.crop(image, bbox)
                    if show_face and face_image is not None:
                        ...
                        # show the face image
                        # cv2.imshow(f'face_{id}', face_image)
                        # cv2.waitKey(1)
                    result = self.__do_inference(face_image)
                    face_embeddings = ImageOperations.get_facial_embeddings(result)
                    # TODO: remove face_coord from obj_tracks (if not being used)
                    tracked_objs["data"][id]["embedding"] = face_embeddings

                # TODO: specify the exception
                except Exception:
                    return tracked_objs
            else:
                tracked_objs["data"][id]["embedding"] = np.array([])

        return tracked_objs

