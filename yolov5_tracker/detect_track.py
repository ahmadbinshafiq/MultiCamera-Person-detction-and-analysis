import os
import cv2
import numpy as np

from yolov5_tracker.tracker import load_detector, load_tracker, detect


class DetectNTrack:
    def __init__(self, weights, draw_detections=False, classes=None):
        self.model, self.stride, self.names, self.pt, self.device = load_detector(weights=weights)
        self.tracker_list, self.outputs = load_tracker(device=self.device)
        self.draw_detections = draw_detections
        self.classes = classes

    def detect(self, frame, debug=False):
        self.outputs = detect(self.model, self.names, frame, self.tracker_list, self.outputs, device=self.device,
                              draw_detections=self.draw_detections, classes=self.classes, debug=debug)
        return self.outputs

    @staticmethod
    def get_coords_and_centroids(outputs):
        """
        Takes tracking_arr as input, and returns the coordinates,
        tracking_ids and centroids of the bounding boxes.
        """
        tracking_ids = []
        coord = []
        for output in outputs:
            if len(output) > 0:
                coord.append(output[:4])
                tracking_ids.append(output[4])
        centroids = [[(x1 + x2) / 2, y2] for x1, y1, x2, y2 in coord]  # bottom center (feet)

        return tracking_ids, coord, centroids

    def run(self):
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            self.outputs = self.detect(frame)
            tracking_ids, coord, centroids = self.get_coords_and_centroids(self.outputs[0])

            cv2.imshow('Frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    # detect_n_track = DetectNTrack(
    #     weights=os.path.join("weights", "yolov5m.pt"),
    #     draw_detections=False
    # )
    # detect_n_track.run()
    ...
