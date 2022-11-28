import cv2

from age_gender_detector.detect_face import DetectFaceOpenvino
from age_gender_detector.age_gender import AgeGenderOpenvino
from age_gender_detector.image_utils import ImageUtils as im


class AgeGenderDetector(DetectFaceOpenvino, AgeGenderOpenvino):
    def __init__(self, face_path, age_path, draw_boxes=False, show_face_crop=False):
        self.face_detector = DetectFaceOpenvino()
        self.face_detector.load_model(model_path=face_path)

        self.age_gender_detector = AgeGenderOpenvino()
        self.age_gender_detector.load_model(model_path=age_path)
        self.draw_boxes = draw_boxes
        self.show_face_crop = show_face_crop

    def archs(self):
        self.face_detector.model_arch('face detector')
        self.age_gender_detector.model_arch('age gender detector')

    def detect_age_n_gender(self, frame):
        # detect face
        reshaped_image, resized_image = self.face_detector.pre_process(frame)
        output = self.face_detector.inference(reshaped_image)
        output = self.face_detector.parse_output_layer(output)
        faces_coords = self.face_detector.post_process(output)

        height, width, _ = frame.shape

        age, gender = None, None
        for face in faces_coords:
            # crop face from frame
            image = im.image_from_xywh(frame, face)
            if self.show_face_crop:
                cv2.imshow('face', image)
                cv2.waitKey(1)
            # detect age and gender
            reshaped_image, resized_image = self.age_gender_detector.pre_process(image)
            output = self.age_gender_detector.inference(reshaped_image)
            age, gender = self.age_gender_detector.parse_output_layer(output)
            age, gender = self.age_gender_detector.post_process(age, gender)

            if self.draw_boxes:
                # draw face box
                x, y, w, h = face
                x, y, w, h = int(x * width), int(y * height), int(w * width), int(h * height)
                cv2.rectangle(frame, (x, y), (w, h), (0, 255, 0), 2)
                cv2.putText(
                    frame,
                    f"{age}-{gender}",
                    (x - 10, y - 20),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 255),
                    2,
                )

        return age, gender


if __name__ == '__main__':
    # model_path_face = "models/face-detection-adas-0001/FP32/face-detection-adas-0001.xml"
    # model_path_age = "models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"
    # detector = AgeGenderDetector(model_path_face, model_path_age, draw_boxes=True)
    # detector.archs()
    # img = cv2.imread('ahmad.jpg')
    # age, gender = detector.detect_age_n_gender(img)
    # print(f"age: {age}, gender: {gender}")
    # cv2.imshow('img', img)
    # cv2.waitKey(0)
    ...
