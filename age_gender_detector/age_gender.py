import numpy as np

from age_gender_detector.openvino_pipeline import OpenVinoPipeline


class AgeGenderOpenvino(OpenVinoPipeline):
    """
    Detects the age and gender.

    Input:
        Image, name: data, shape: 1, 3, 62, 62 in 1, C, H, W format, where:
            C - number of channels
            H - image height
            W - image width
        Expected color order is BGR.

    Output:
        1. Name: fc3_a, shape: 1, 1, 1, 1 - Estimated age divided by 100.
        2. Name: prob, shape: 1, 2, 1, 1 - Softmax output across 2 type classes [0 - female, 1 - male].

    output_layer(0): prob -> gender
    output_layer(1): age_conv3 -> age
    """

    def __init__(self):
        super().__init__()
        self.set_height_width(height=62, width=62)

    def load_model(self, model_path, device="CPU"):
        super().load_model(model_path=model_path, device=device)

    def model_arch(self, model_name):
        super().model_arch(model_name)

    def inference(self, image):
        return super().inference(image)

    def parse_output_layer(self, output):
        """
        Parse the output layers to get the age and gender
        """
        gender = output[self.compiled_model.output(0)]
        age = output[self.compiled_model.output(1)]

        return age, gender

    def set_height_width(self, height, width):
        super().set_height_width(height, width)

    def pre_process(self, image):
        """
        Resize the image to the model input size
        and then reshaping it to the model input shape

        Original image shape: (H, W, C)
        Reshaped image shape: (1, C, H, W)
        (640, 640, 3) --> (1, 3, 62, 62)

        :returns reshaped_image and resized_image
        """
        return super().pre_process(image)

    def post_process(self, age_res, gender_res):
        """
        Post process the result from the model
        age = result[0][0][0][0]
        gender = result[1][0][0][0]

        :param result:
        :return: age, gender (0 - female, 1 - male)
        """
        age = age_res[0][0][0][0]
        gender_f = gender_res[0][0][0][0]
        gender_m = gender_res[0][1][0][0]
        age = int(age * 100)
        gender = 'MALE' if gender_m >= gender_f else 'FEMALE'

        return age, gender

    @staticmethod
    def image_from_xywh(image: np.ndarray, xywh: list):
        """
        Crop image portion from xywh coords
        :param image:
        :param xywh:
        :return:
        """
        x, y, w, h = xywh
        image = image[y:y + h, x:x + w]
        # return reshaped image only
        reshaped_image, _ = super().pre_process(image)
        return reshaped_image


if __name__ == "__main__":
    ...
    # # model_path = "/home/ahmadbinshafiq/ahmad/fyp/dev/models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"
    # model_path = "/hp/ahmad/fyp/dev/models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"
    # age_gender = AgeGenderOpenvino()
    # age_gender._load_model(model_path)
    # age_gender._model_arch('Age Gender Detector')
    #
    # import time
    #
    # # get webcam feed from opencv
    # cap = cv2.VideoCapture('abdullah.mp4')
    # while True:
    #     ret, frame = cap.read()
    #     if not ret:
    #         print("Unable to capture video")
    #         break
    #
    #     reshaped_image, resized_image = age_gender.pre_process(frame)
    #     age_res, gender_res = age_gender._inference(reshaped_image)
    #     age, gender = age_gender._post_process(age_res, gender_res)
    #     # break
    #     cv2.putText(
    #         frame,
    #         f"Age: {age} - Gender: {gender}",
    #         (10, 20),
    #         cv2.FONT_HERSHEY_SIMPLEX,
    #         0.7,
    #         (0, 0, 255),
    #         2,
    #     )
    #     time.sleep(0.1)
    #     cv2.imshow('frame', frame)
    #     if cv2.waitKey(1) & 0xFF == ord('q'):
    #         break
    # cap.release()
    # cv2.destroyAllWindows()
