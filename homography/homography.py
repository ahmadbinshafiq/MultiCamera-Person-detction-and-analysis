import cv2
import numpy as np


class Homography:

    def __init__(self):
        self._image_points = []
        self._ground_truth_points = []
        self._homography_matrix = None

    @property
    def points(self):
        return self._image_points, self._ground_truth_points

    @points.setter
    def points(self, points_arr):
        self._image_points = points_arr[0]
        self._ground_truth_points = points_arr[1]

    @staticmethod
    def _reshape_points_for_homography(arr: list):
        """
        Reshapes the points to be in the format:
        [[x1, y1],
            [x2, y2],
            [x3, y3],
            [x4, y4]]

        :param points:
        :return: reshaped_points
        """
        return np.array(arr).reshape(-1, 1, 2)

    def compute_homography(self):
        """
        Computes the homography matrix based on the image points and ground truth points.

        First reshape the points to be in the format:
        [[x1, y1],
            [x2, y2],
            [x3, y3],
            [x4, y4]]

        Then compute the homography matrix using the cv2.findHomography function.

        Formula:
        H = (A^T * A)^-1 * A^T * b

        :sets self.homography_matrix;
        """
        self._image_points = self._reshape_points_for_homography(self._image_points)
        self._ground_truth_points = self._reshape_points_for_homography(self._ground_truth_points)

        homography_matrix, status = cv2.findHomography(
            np.array(self._image_points),
            np.array(self._ground_truth_points),
            cv2.RANSAC, 5.0
        )

        self._homography_matrix = homography_matrix

    def map_points(self, points):
        """
        Maps the points from the image to the ground truth image
        based on the homography matrix computed above.

        Formula:
        x' = Hx

        :param points: points to map (x, y)
                converted to (x, y, 1) vector - [3x1 matrix]
        :return: mapped_points
        """

        print("initial points: ", points)
        src_points = np.reshape(points, (3, 1))
        mapped_points = np.dot(self._homography_matrix, src_points)
        mapped_points = mapped_points / mapped_points[2]
        mapped_points = np.reshape(mapped_points[:2], (1, 2))
        print("end points: ", mapped_points)
        return mapped_points
