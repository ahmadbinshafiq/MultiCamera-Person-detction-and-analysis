import cv2
import imutils
import numpy as np


class ImageBlending:
    ...


class Panorama:
    """
    Get the image stitching with opencv and python code, for panorama creation.
    The code is based on the following tutorial:
    https://pyimagesearch.com/2018/12/17/image-stitching-with-opencv-and-python/
    """

    def __init__(self, images, ratio=0.75, reproj_thresh=4.0, show_matches=False):
        """
        :param images: List of images to stitch.
        :param ratio: The ratio of the keypoint detector.
        :param reproj_thresh: The threshold for the RANSAC algorithm.
        :param show_matches: Show the matches between the images.
        """
        self.images = images
        self.ratio = ratio
        self.reproj_thresh = reproj_thresh
        self.show_matches = show_matches

    def stitch(self):
        """
        Stitch the images together.
        :return: The stitched image.
        """
        # Detect and extract features from the images.
        (image_b, image_a) = self.images
        (kps_a, features_a) = self._detect_and_extract(image_a)
        (kps_b, features_b) = self._detect_and_extract(image_b)

        # Match the features between the two images.
        M = self._match_keypoints(kps_a, kps_b, features_a, features_b)

        # If the match is None, then there aren't enough matched keypoints to create a panorama.
        if M is None:
            return None

        # Otherwise, apply a perspective warp to stitch the images together.
        (matches, H, status) = M
        result = cv2.warpPerspective(image_a, H, (image_a.shape[1] + image_b.shape[1], image_a.shape[0]))
        result[0:image_b.shape[0], 0:image_b.shape[1]] = image_b

        # Check to see if the keypoint matches should be visualized.
        if self.show_matches:
            vis = self._draw_matches(image_a, image_b, kps_a, kps_b, matches, status)
            return (result, vis)

        # Return the stitched image.
        return result

    def _detect_and_extract(self, image):
        """
        Detect and extract features from the image.
        :param image: The image to detect and extract features.
        :return: The keypoints and features.
        """
        descriptor = cv2.xfeatures2d.SIFT_create()
        (kps, features) = descriptor.detectAndCompute(image, None)
        kps = np.float32([kp.pt for kp in kps])
        return (kps, features)

    def _match_keypoints(self, kps_a, kps_b, features_a, features_b):
        """
        Match the keypoints between the two images.
        :param kps_a: The keypoints of the first image.
        :param kps_b: The keypoints of the second image.
        :param features_a: The features of the first image.
        :param features_b: The features of the second image.
        :return: The matches between the two images.
        """
        matcher = cv2.DescriptorMatcher_create("BruteForce")
        raw_matches = matcher.knnMatch(features_a, features_b, 2)
        matches = []

        # Loop over the raw matches.
        for m in raw_matches:
            # Ensure the distance is within a certain ratio of each other (i.e. Lowe's ratio test).
            if len(m) == 2 and m[0].distance < m[1].distance * self.ratio:
                matches.append((m[0].trainIdx, m[0].queryIdx))

        # Computing a homography requires at least 4 matches.
        if len(matches) > 4:
            # Construct the two sets of points.
            pts_a = np.float32([kps_a[i] for (_, i) in matches])
            pts_b = np.float32([kps_b[i] for (i, _) in matches])

            # Compute the homography between the two sets of points.
            (H, status) = cv2.findHomography(pts_a, pts_b, cv2.RANSAC, self.reproj_thresh)

            # Return the matches along with the homograpy matrix and status of each matched point.
            return (matches, H, status)

        # Otherwise, no homograpy could be computed.
        return None

    def _draw_matches(self, image_a, image_b, kps_a, kps_b, matches, status):
        """
        Draw the matches between the two images.
        :param image_a: The first image.
        :param image_b: The second image.
        :param kps_a: The keypoints of the first image.
        :param kps_b: The keypoints of the second image.
        :param matches: The matches between the two images.
        :param status: The status of the matches.
        :return: The image with the matches drawn.
        """
        # Initialize the output visualization image.
        (h_a, w_a) = image_a.shape[:2]
        (h_b, w_b) = image_b.shape[:2]
        vis = np.zeros((max(h_a, h_b), w_a + w_b, 3), dtype="uint8")
        vis[0:h_a, 0:w_a] = image_a
        vis[0:h_b, w_a:] = image_b

        # Loop over the matches.
        for ((train_idx, query_idx), s) in zip(matches, status):
            # Only process the match if the keypoint was successfully matched.
            if s == 1:
                # Draw the match.
                pt_a = (int(kps_a[query_idx][0]), int(kps_a[query_idx][1]))
                pt_b = (int(kps_b[train_idx][0]) + w_a, int(kps_b[train_idx][1]))
                cv2.line(vis, pt_a, pt_b, (0, 255, 0), 1)

        # Return the visualization.
        return vis


if __name__ == '__main__':
    # Load the images and resize them to have a width of 400 pixels (for faster processing).
    image_a = cv2.imread("mares-cv-panorama-dataset/S1.jpg")
    image_b = cv2.imread("mares-cv-panorama-dataset/S1.jpg")
    image_a = imutils.resize(image_a, width=400)
    image_b = imutils.resize(image_b, width=400)

    # Stitch the images together to create a panorama.
    stitcher = Panorama([image_a, image_b], show_matches=True)
    (result, vis) = stitcher.stitch()

    # Show the images.
    cv2.imshow("Image A", image_a)
    cv2.imshow("Image B", image_b)
    cv2.imshow("Keypoint Matches", vis)
    cv2.imshow("Result", result)
    cv2.waitKey(0)
