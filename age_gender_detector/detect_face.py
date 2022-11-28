from age_gender_detector.openvino_pipeline import OpenVinoPipeline


class DetectFaceOpenvino(OpenVinoPipeline):

    def __init__(self, face_thresh=0.5):
        super().__init__()
        self.set_height_width(height=384, width=672)
        self.FACE_THRESH = face_thresh

    def set_height_width(self, height, width):
        super().set_height_width(height, width)

    def load_model(self, model_path, device="CPU"):
        super().load_model(model_path, device="CPU")

    def model_arch(self, model_name):
        super().model_arch(model_name)

    def inference(self, image):
        return super().inference(image)

    def parse_output_layer(self, output):
        """
        Parse the output layer to get the face coordinates
        """
        face = output[self.compiled_model.output(0)]
        return face

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

    def post_process(self, result):
        """
        Get the face coordinates from the result
        """
        detections = result[0][0]
        faces_array = []
        for det in detections:
            if det[2] > self.FACE_THRESH:
                faces_array.append(det[3:7])

        return faces_array
