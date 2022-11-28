import cv2
import numpy as np
from openvino.runtime import Core

from abc import ABC, abstractmethod


class OpenVinoPipeline(ABC):
    def __init__(self):
        self.input_layer = None
        self.compiled_model = None
        self.height = None
        self.width = None

    @abstractmethod
    def set_height_width(self, height, width):
        self.height = height
        self.width = width

    @abstractmethod
    def load_model(self, model_path, device):
        ie = Core()
        model = ie.read_model(model=model_path)
        self.compiled_model = ie.compile_model(model=model, device_name=device)
        self.input_layer = self.compiled_model.input(0)

    @abstractmethod
    def model_arch(self, model_name):
        print(f"{model_name} arch.")
        print(f"\n{self.compiled_model}\n")

    @abstractmethod
    def inference(self, image):
        res = self.compiled_model([image])
        return res

    @abstractmethod
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

    @abstractmethod
    def post_process(self, output):
        pass
