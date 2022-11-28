class ImageUtils:

    @staticmethod
    def image_from_xywh(image, dims):
        """
        :return: image cropped from xywh
        """
        height, width, _ = image.shape
        return image[
               int(dims[1] * height): int(dims[3] * height),  # (y_min: y_max)
               int(dims[0] * width): int(dims[2] * width)  # (x_min: x_max)
               ]