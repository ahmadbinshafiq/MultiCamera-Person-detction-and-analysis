import numpy as np
import cv2
from openvino.runtime import Core


class AgeGenderOpenvino:
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
        self.height = 62
        self.width = 62

    def _load_model(self, model_path, device="CPU"):
        ie = Core()
        model = ie.read_model(model=model_path)
        self.compiled_model = ie.compile_model(model=model, device_name=device)
        self.input_layer = self.compiled_model.input(0)
        # self.output_layer_loc = self.compiled_model.output(0)

    def _model_arch(self, model_name):
        print(f"{model_name} arch.")
        print(f"\n{self.compiled_model}\n")

        # get layer names
        print('input layer name: ', self.input_layer)
        # print('output layer name: ', self.output_layer_loc)
        print(f'output: {self.compiled_model.output(1).any_name}')
        print(f'output: {self.compiled_model.output(0).any_name}')

    def _inference(self, image):
        res = self.compiled_model([image])
        gender = res[self.compiled_model.output(0)]
        age = res[self.compiled_model.output(1)]

        return age, gender

    def _set_height_width(self, height, width):
        self.height = height
        self.width = width

    def pre_process(self, image):
        """
        Resize the image to the model input size
        and then reshaping it to the model input shape

        Original image shape: (H, W, C)
        Reshaped image shape: (1, C, H, W)
        (640, 640, 3) --> (1, 3, 62, 62)

        :returns reshaped_image and resized_image
        """
        resized_image = cv2.resize(image, (self.width, self.height))
        reshaped_image = np.expand_dims(
            resized_image.transpose(2, 0, 1), axis=0
        ).astype(np.float32)
        return reshaped_image, resized_image

    def _post_process(self, age_res, gender_res):
        """
        Post process the result from the model
        age = result[0][0][0][0]
        gender = result[1][0][0][0]

        :param result:
        :return: age, gender (0 - female, 1 - male)
        """
        age = age_res[0][0][0][0]
        gender = gender_res[0][0][0][0]
        age = int(age * 100)
        # gender = 1 if gender > 0.5 else 0
        gender = 'MALE' if gender >= 0.5 else 'FEMALE'
        print(f'age: {age}, gender: {gender}')

        return age, gender


if __name__ == "__main__":
    # model_path = "/home/ahmadbinshafiq/ahmad/fyp/dev/models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"
    model_path = "/hp/ahmad/fyp/dev/models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"
    age_gender = AgeGenderOpenvino()
    age_gender._load_model(model_path)
    age_gender._model_arch('Age Gender Detector')

    import time

    # get webcam feed from opencv
    cap = cv2.VideoCapture('abdullah.mp4')
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Unable to capture video")
            break

        reshaped_image, resized_image = age_gender.pre_process(frame)
        age_res, gender_res = age_gender._inference(reshaped_image)
        age, gender = age_gender._post_process(age_res, gender_res)
        # break
        cv2.putText(
            frame,
            f"Age: {age} - Gender: {gender}",
            (10, 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2,
        )
        time.sleep(0.1)
        cv2.imshow('frame', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
