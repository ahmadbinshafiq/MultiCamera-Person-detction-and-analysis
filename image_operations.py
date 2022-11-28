import base64

import cv2


class ImageUtils:

    @staticmethod
    def image_from_xywh(image, dims):
        """
        :return: image cropped from xywh
        """
        height, width, _ = image.shape
        return image[
               int(dims[1]): int(dims[3]),  # (y_min: y_max)
               int(dims[0]): int(dims[2])  # (x_min: x_max)
               ]

    @staticmethod
    def upscale_centroids(centroid: list, image_shape: tuple):
        """
        upscales the centroid based on the image shape
        """
        height, width, _ = image_shape
        return [int(centroid[0] * width), int(centroid[1] * height)]

    @staticmethod
    def np_to_base64(image):
        """
        Convert numpy array to base64 string
        """
        image = cv2.imencode('.jpg', image)[1].tostring()
        image = base64.b64encode(image)
        image = image.decode('utf-8')
        return image