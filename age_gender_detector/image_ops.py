import cv2
import numpy as np
from numpy import dot, sqrt


class ImageOperations:

    def __init__(self):
        self.thresh_x, self.thresh_y, self.thresh_w, self.thresh_h = 0.2, 0.2, 0.6, 0.8

    def face_in_roi(self, face_centroid, height, width) -> bool:
        # TODO: Add this in __init__ method
        # print(face_centroid)
        thresh_x, thresh_y, thresh_w, thresh_h = int(self.thresh_x * width), int(self.thresh_y * height), \
                                                 int(self.thresh_w * width), int(self.thresh_h * height)

        if thresh_x < face_centroid[0] < thresh_w \
                and thresh_y < face_centroid[1] < thresh_h:
            return True
        return False

    def plot_roi(self, frame):
        """
        This function is used to plot the ROI on the frame.
        """
        x, y, w, h = int(self.thresh_x * frame.shape[1]), int(self.thresh_y * frame.shape[0]), \
                     int(self.thresh_w * frame.shape[1]), int(self.thresh_h * frame.shape[0])

        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 0), 2)
        return frame

    @staticmethod
    def plot_centroid(frame, centroid):
        """
        This function takes in array of centroid
         and plots them on the frame.
        """
        for cent in centroid:
            cv2.circle(frame, cent, 5, (0, 255, 0), -1)
        return frame

    @staticmethod
    def preprocess_image(image, input_layer_shape, ch_first=True):
        if ch_first:
            _, _, height, width = input_layer_shape
        else:
            _, height, width, _ = input_layer_shape

        resized_image = cv2.resize(image, (width, height))

        if ch_first:
            reshaped_image = np.expand_dims(resized_image.transpose(2, 0, 1), axis=0).astype(np.float32)
        else:
            reshaped_image = np.expand_dims(resized_image.transpose(0, 1, 2), axis=0).astype(np.float32)

        return reshaped_image, resized_image

    @staticmethod
    def rescale_detections(image, dims):
        """
        :return: x, y, w, h
        """
        height, width, _ = image.shape
        return [
            int(dims[0] * width),
            int(dims[1] * height),
            int(dims[2] * width),
            int(dims[3] * height)
        ]

    @staticmethod
    def crop(frame, sub_frame):

        return frame[
               int(sub_frame[1]): int(sub_frame[3]),  # (y_min: y_max)
               int(sub_frame[0]): int(sub_frame[2])  # (x_min: x_max)
               ]

    # @staticmethod
    def facial_postprocessing(self, result, image, bbox_color=(0, 255, 0)):
        height, width, _ = image.shape
        detections = result[0][0]

        faces_array = []
        face_in_ROI = False
        for det in detections:
            if det[2] > 0.2:
                x_min = int(det[3] * width)
                y_min = int(det[4] * height)
                x_max = int(det[5] * width)
                y_max = int(det[6] * height)
                # cv2.rectangle(image, (x_min, y_min), (x_max, y_max), bbox_color, 2)

                # crop the face and append to a numpy array
                # faces_array.append([int(x_min + x), int(y_min + y), int(x_max + x), int(y_max + y)])
                faces_array.append([x_min, y_min, x_max, y_max])
                face_centroid = ((x_min + x_max) / 2, (y_min + y_max) / 2)
                if not face_in_ROI:
                    face_in_ROI = self.face_in_roi(face_centroid, height, width)

        return image, np.asarray(faces_array), face_in_ROI

    @staticmethod
    def get_facial_embeddings(result):
        # print(result.shape)
        # print(result[0])

        return result[0]

    @staticmethod
    def compare_faces(x, y):
        """
        Cosine similarity between two vectors
        """
        try:
            sim = dot(x, y) / (sqrt(dot(x, x)) * sqrt(dot(y, y)))
            return sim
        except ValueError:
            print('ValueError')
            print(f'x: {len(x)}, y: {len(y)}')
            return 0

    @staticmethod
    def intersection(lst1, lst2):
        return set(lst1).intersection(lst2)

    @staticmethod
    def mat_mult(self):
        enroll_embs, _, enroll_truelabels, enroll_id2label = EncDecSpeakerLabelModel.get_batch_embeddings(
            speaker_model, enrollment_manifest, batch_size, sample_rate, device=device,
        )

        test_embs, _, _, _ = EncDecSpeakerLabelModel.get_batch_embeddings(
            speaker_model, test_manifest, batch_size, sample_rate, device=device,
        )

        # length normalize
        enroll_embs = enroll_embs / (np.linalg.norm(enroll_embs, ord=2, axis=-1, keepdims=True))
        test_embs = test_embs / (np.linalg.norm(test_embs, ord=2, axis=-1, keepdims=True))

        # reference embedding
        reference_embs = []
        keyslist = list(enroll_id2label.keys())
        for label_id in keyslist:
            indices = np.where(enroll_truelabels == label_id)
            embedding = (enroll_embs[indices].sum(axis=0).squeeze()) / len(indices)
            reference_embs.append(embedding)

        reference_embs = np.asarray(reference_embs)

        scores = np.matmul(test_embs, reference_embs.T)
        matched_labels = scores.argmax(axis=-1)