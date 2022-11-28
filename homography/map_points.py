import cv2
import numpy as np

from io_event_handler import IOEventHandler
from homography import Homography
from yolo import YOLO
from image_utils import ImageUtils as im


class MapPointsUsingHomography(IOEventHandler, Homography, YOLO):

    def __init__(self):
        IOEventHandler.__init__(self)
        Homography.__init__(self)
        YOLO.__init__(self, model_path='weights/yolov5s.pt', classes=[0], device='0', conf=0.3)

    @staticmethod
    def load_npy(npy_file):
        return np.load(npy_file, allow_pickle=True)

    def homography(self, npy_path):
        points_array = self.load_npy(npy_path)
        self.points = points_array
        self.compute_homography()
        print(f'H: {self._homography_matrix}')

    def map_centroids(self, centroids: list, shape: tuple):
        mapped_centroids = []
        for centroid in centroids:
            upscaled_centroid = im.upscale_centroids(centroid, shape)
            upscaled_centroid.insert(2, 1)  # add 1 to the end of the list for matrix multiplication - 3x1 matrix
            mapped_centroids.append(self.map_points(upscaled_centroid))
        return mapped_centroids

    @staticmethod
    def plot_centroids_on_gt(centroids, frame):
        """
        Takes a frame and its results as input, and plots
        the centroids on to the frame.
        :return:
            Frame with centroids plotted on it.
        """
        # get the height and width of the frame
        height, width, _ = frame.shape
        for centroid in centroids:
            x, y = centroid[0].astype(int)
            cv2.circle(frame, (x, y), 2, (0, 0, 255), -1)
        return frame

    def run(self):
        self.homography(npy_path='npy/cam131.avi.npy')
        gt = cv2.imread('videos/groundplane_lab.png')
        gt_shape = gt.shape
        cap = cv2.VideoCapture('videos/cam131.avi')
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            labels, coords, centroids = self.score_frame(frame)
            self.plot_centroids(centroids, frame)
            self.plot_boxes(labels, coords, frame)

            mapped_centroids = self.map_centroids(centroids, gt_shape)
            gt = self.plot_centroids_on_gt(mapped_centroids, gt)

            # frame = cv2.warpPerspective(frame, self._homography_matrix, (frame.shape[1], frame.shape[0]))
            cv2.imshow('frame', frame)
            cv2.imshow('gt', gt)
            k = cv2.waitKey(1) & 0xFF
            if k == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    map_points = MapPointsUsingHomography()
    # map_points.homography()
    map_points.run()

