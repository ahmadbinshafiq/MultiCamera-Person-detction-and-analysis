import cv2
import numpy as np
import imutils
import itertools


class ImageStitching:

    def __init__(self):
        self.keypoints_right = None
        self.keypoints_left = None
        self.H = None
        self.k = 2  # number of nearest neighbors to use during matching
        self.ratio = 0.75  # ratio of distance between keypoints to be considered a match
        self.BLACK_AREA_THRESH = 30

    def detect_features(self, gray_right, gray_left, draw_keypoints=False):
        """
        Detecting the SIFT features in the images
        """
        descriptor = cv2.SIFT_create()
        self.keypoints_right, features_right = descriptor.detectAndCompute(gray_right, None)
        self.keypoints_left, features_left = descriptor.detectAndCompute(gray_left, None)

        if draw_keypoints:
            right_kp = cv2.drawKeypoints(gray_right, self.keypoints_right, None, color=(0, 255, 0))
            left_kp = cv2.drawKeypoints(gray_left, self.keypoints_left, None, color=(0, 255, 0))
            cv2.namedWindow("right_kp", cv2.WINDOW_NORMAL)
            cv2.imshow('right_kp', right_kp)
            cv2.namedWindow("left_kp", cv2.WINDOW_NORMAL)
            cv2.imshow('left_kp', left_kp)
            cv2.waitKey(0)

        return features_right, features_left

    @staticmethod
    def print_sift_keypoints(keypoints):
        for i, keypoint in enumerate(keypoints):
            x, y = keypoint.pt
            size = keypoint.size
            orientation = keypoint.angle
            response = keypoint.response
            octave = keypoint.octave
            class_id = keypoint.class_id

            print(f'\nPrinting SIFT Keypoints details: {i}')
            print(f'(x, y): {x}, {y}')
            print(f'size: {size}')
            print(f'orientation: {orientation}')
            print(f'response: {response}')
            print(f'octave: {octave}')
            print(f'class_id: {class_id}')
            print(f'length of keypoints_left_img: {len(keypoints)}')

    def match_keypoints(self, features_right, features_left, left_image, right_image, draw_matches=False):
        """
        returns the matching SIFT features in the images
        """

        bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)
        raw_matches = bf.knnMatch(features_right, features_left, k=self.k)
        # print("Raw matches (knn):", len(raw_matches))
        matches = []

        # TODO: try to do this through numpy slicing
        # loop over the raw matches
        for m, n in raw_matches:
            # ensure the distance is within a certain ratio of each
            # other (i.e. Lowe's ratio test)
            if m.distance < n.distance * self.ratio:
                matches.append(m)

        if draw_matches:
            mapped_features_image = cv2.drawMatches(
                right_image,
                self.keypoints_right,
                left_image,
                self.keypoints_left,
                np.random.choice(matches, 100),
                None,
                flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
            )
            cv2.namedWindow(f"images_features", cv2.WINDOW_NORMAL)
            cv2.imshow(f'images_features', mapped_features_image)
            cv2.waitKey(0)

        return matches

    def homography_stitching(self, matches, reproj_thresh=4):
        """
        Converting the key points to numpy arrays before passing them for calculating Homography Matrix.
        Because we are supposed to pass 2 arrays of coordinates to cv2.findHomography,
        as in I have these points in image-1, and I have points in image-2,
        so now what is the homography matrix to transform the points from image 1 to image 2
        """

        kp_right = np.float32([keypoint.pt for keypoint in self.keypoints_right])
        kp_left = np.float32([keypoint.pt for keypoint in self.keypoints_left])

        """
        For findHomography() - 
            I need to have an assumption of a minimum of correspondence points
            that are present between the 2 images.
            Here, I am assuming that Minimum Match Count to be 4
        """
        if len(matches) > 4:
            # construct the two sets of points
            points_right_image = np.float32([kp_right[m.queryIdx] for m in matches])
            points_left_image = np.float32([kp_left[m.trainIdx] for m in matches])

            # Calculate the homography between the sets of points
            H, status = cv2.findHomography(points_right_image, points_left_image, cv2.RANSAC, reproj_thresh)

            return matches, H, status
        else:
            return None

    def warp_images(self, H, left_image, right_image):
        """
        Warping the left image to the right image using the Homography Matrix

        For the calculation of the width and height of the final horizontal panoramic images
        I can just add the widths of the individual images and for the height
        I can take the max from the 2 individual images.
        """

        if H is None:
            return left_image

        width = left_image.shape[1] + right_image.shape[1]
        height = max(left_image.shape[0], right_image.shape[0])

        # stitch the images together using the homography matrix
        result = cv2.warpPerspective(right_image, H, (width, height))

        """
        The warpPerspective() function returns an image or video 
        whose size is the same as the size of the original image or video.
        
        Hence set the pixels as per my left_image

        Overwrite the pixels of the right_image with the pixels of the result image
        creating a horizontal panoramic image
        """
        # TODO: try doing it through cv2.addWeighted()
        # TODO: try to crop right image to the left image size
        #  and then concatenate them and then do the blending
        #  OR
        #  try out stitcher class methods in opencv

        # we are placing the left image on top of warped right image
        result[0:left_image.shape[0], 0:left_image.shape[1]] = left_image

        # now paste them together
        # result[0:right_image.shape[0], 0:right_image.shape[1]] = right_image
        # result[0:left_image.shape[0], 0:left_image.shape[1]] = left_image

        return result

    @staticmethod
    def post_process_pano(result, debug=False):
        """
        Post processing the panorama image
        Getting the area of the image which is not black
        """

        # post-processing stitched panorama
        stitched_img = cv2.copyMakeBorder(result, 10, 10, 10, 10, cv2.BORDER_CONSTANT, (0, 0, 0))
        # check if the image is grayscale or color
        if len(stitched_img.shape) == 3:
            gray = cv2.cvtColor(stitched_img, cv2.COLOR_BGR2GRAY)
        else:
            gray = stitched_img

        thresh_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)[1]
        contours = cv2.findContours(
            thresh_img.copy(),
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )
        contours = imutils.grab_contours(contours)
        areaOI = max(contours, key=cv2.contourArea)
        mask = np.zeros(thresh_img.shape, dtype="uint8")
        x, y, w, h = cv2.boundingRect(areaOI)
        cv2.rectangle(mask, (x, y), (x + w, y + h), 255, -1)
        min_rect = mask.copy()
        sub = mask.copy()

        while cv2.countNonZero(sub) > 0:
            min_rect = cv2.erode(min_rect, None)
            sub = cv2.subtract(min_rect, thresh_img)

        contours = cv2.findContours(min_rect.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(contours)
        areaOI = max(contours, key=cv2.contourArea)

        if debug:
            cv2.namedWindow("Threshold Image", cv2.WINDOW_NORMAL)
            cv2.imshow("Threshold Image", thresh_img)
            cv2.namedWindow("minRectangle Image", cv2.WINDOW_NORMAL)
            cv2.imshow("minRectangle Image", min_rect)
            cv2.waitKey(0)

        x, y, w, h = cv2.boundingRect(areaOI)
        stitched_img = stitched_img[y:y + h, x:x + w]

        if debug:
            # cv2.imwrite("stitchedOutputProcessed.png", stitched_img)
            cv2.namedWindow("Stitched Image Processed", cv2.WINDOW_NORMAL)
            cv2.imshow("Stitched Image Processed", stitched_img)
            cv2.waitKey(0)

        return stitched_img

    @staticmethod
    def save_keypoints_to_numpy(keypoints, filename):
        kp_arr = np.float32([keypoint.pt for keypoint in keypoints])
        np.save(filename, kp_arr)

    @staticmethod
    def load_keypoints_from_numpy(filename):
        kp_arr = np.load(filename)
        return kp_arr

    def get_homography_matrix(self, left_image, right_image, debug=False):
        """
        Computes the homography matrix between the left and right images
        using the SIFT and RANSAC - key-points and descriptors

        returns the homography matrix
        """

        # convert the images to grayscale
        gray_left = cv2.cvtColor(left_image, cv2.COLOR_RGB2GRAY)
        gray_right = cv2.cvtColor(right_image, cv2.COLOR_RGB2GRAY)

        # detect and extract features from the images
        features_right, features_left = self.detect_features(
            gray_right, gray_left, draw_keypoints=debug
        )

        # compute the homography matrix
        matches = self.match_keypoints(
            features_right, features_left,
            left_image, right_image,
            draw_matches=debug
        )
        M = self.homography_stitching(matches)

        if M is not None:
            matches, H, status = M
            return H, matches
        else:
            print('Not enough matches found - %d/%d' % (len(matches), 4))
            return None

    @staticmethod
    def _find_contours(image: np.ndarray):
        # check if the image is grayscale or color
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # find contours having black color with area greater than 100
        contours, hierarchy = cv2.findContours(
            gray, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
        )
        contours = [cnt for cnt in contours if cv2.contourArea(cnt) > 100]

        return contours

    @staticmethod
    def _crop_biggest_contour(image: np.ndarray):
        """
        Crop the image to the biggest contour
        """
        contours = ImageStitching._find_contours(image)
        # get the biggest contour
        biggest_contour = max(contours, key=cv2.contourArea)
        # get the bounding rectangle of the biggest contour
        x, y, w, h = cv2.boundingRect(biggest_contour)
        # crop the image
        cropped_image = image[y:y + h, x:x + w]
        return cropped_image

    @staticmethod
    def get_blank_area_of_image(image: np.ndarray, debug=False):
        """
        Get the blank area of the image
        """
        contours = ImageStitching._find_contours(image)
        # get the blank area of the image
        blank_area = np.zeros(image.shape, dtype=np.uint8)
        cv2.drawContours(blank_area, contours, -1, (255, 255, 255), -1)
        blank_area = cv2.bitwise_not(blank_area)

        # calculate the percentage of the black area
        blank_area_percentage = np.count_nonzero(blank_area) * 100 / np.size(image)
        print(f'Blank area percentage: {blank_area_percentage}')

        if debug:
            cv2.namedWindow("Blank Area", cv2.WINDOW_NORMAL)
            cv2.imshow("Blank Area", blank_area)
            cv2.waitKey(0)

        return blank_area_percentage

    def find_correct_image_pattern(self, image_list: list):
        """
        Find the correct image pattern for stitching

        Computes the whole image stitching process on all the possible image patterns
        and returns the correct image pattern based on the min black area

        returns the correct image pattern
            left_image, right_image
        """
        patterns = list(itertools.permutations(image_list))
        combinations = list(itertools.combinations(patterns, 1))
        print('Number of combinations: ', len(combinations))

        blank_area_list = []
        matches_list = []
        for k, combination in enumerate(combinations):
            # if the length of the combination is 1, then we have only one pattern
            # so we can directly use the pattern
            if len(image_list) == 1:
                pattern = combination[0]  # TODO: update this acc to return statement of function

            # if the length of the combination is greater than 2,
            # then we can get values from the combination as below
            if len(image_list) == 2:
                left_image, right_image = combination[0]
                pano = self.stitch_two_images(left_image, right_image, debug=False)
                if pano is not None:
                    pano, matches = pano
                    matches_list.append([matches])

            # if the length of the combination is greater than 2,
            # now we have to stitch the pano with the next image
            if len(image_list) > 2:
                left_image, right_image = combination[0][0], combination[0][1]
                matches_sub_arr = []
                for i in range(1, len(combination[0])):
                    # get the next image
                    next_image = combination[0][i]
                    # stitch the pano with the next image
                    pano = self.stitch_two_images(left_image, right_image, debug=False)
                    if pano is None:
                        matches_sub_arr.append([0])
                        break
                    # get the pano and the matches
                    pano, matches = pano
                    pano = self._crop_biggest_contour(pano)
                    # set left and right images for the next iteration
                    left_image = pano
                    right_image = next_image
                    matches_sub_arr.append(matches)

                matches_list.append(matches_sub_arr)

            if pano is not None:
                # show the pano
                # cv2.namedWindow("Pano", cv2.WINDOW_NORMAL)
                # cv2.imshow("Pano", pano)
                # cv2.waitKey(0)

                # save the pano
                cv2.imwrite(f'runtime-pano/{k}.jpg', pano)

                # append the blank area percentage to the list
                blank_area = self.get_blank_area_of_image(pano, debug=False)
                if blank_area < self.BLACK_AREA_THRESH:
                    blank_area_list.append(blank_area)
                else:
                    blank_area_list.append(100)
            else:
                blank_area_list.append(100)

        print(f'Blank area list: {blank_area_list}')
        print(f'Matches list: {matches_list}')

        # get index of black areas list where the blank area is less than the threshold
        min_blank_area_index = [i for i, x in enumerate(blank_area_list) if x < self.BLACK_AREA_THRESH]
        # get all matches for the minimum blank area index
        min_blank_area_matches = [matches_list[i] for i in min_blank_area_index]
        # find index of match whose sum is largest
        max_sum = 0
        max_sum_index = 0
        for i, match in enumerate(min_blank_area_matches):
            print(f'Match: {match} - Sum: {sum(match)} - Index: {matches_list.index(match)}')
            # self.stitch_images_list(list(combinations[matches_list.index(match)])[0])
            if sum(match) > max_sum:
                max_sum_index = matches_list.index(match)

        # get the correct image pattern
        # correct_image_pattern = combinations[min_blank_area_index]
        correct_image_pattern = combinations[max_sum_index]

        return list(correct_image_pattern)[0]

    @staticmethod
    def overlay_image_alpha(img, img_overlay, x, y, alpha_mask):
        """Overlay `img_overlay` onto `img` at (x, y) and blend using `alpha_mask`.

        `alpha_mask` must have same HxW as `img_overlay` and values in range [0, 1].
        """
        # Image ranges
        y1, y2 = max(0, y), min(img.shape[0], y + img_overlay.shape[0])
        x1, x2 = max(0, x), min(img.shape[1], x + img_overlay.shape[1])

        # Overlay ranges
        y1o, y2o = max(0, -y), min(img_overlay.shape[0], img.shape[0] - y)
        x1o, x2o = max(0, -x), min(img_overlay.shape[1], img.shape[1] - x)

        # Exit if nothing to do
        if y1 >= y2 or x1 >= x2 or y1o >= y2o or x1o >= x2o:
            return

        # Blend overlay within the determined ranges
        img_crop = img[y1:y2, x1:x2]
        img_overlay_crop = img_overlay[y1o:y2o, x1o:x2o]
        alpha = alpha_mask[y1o:y2o, x1o:x2o]
        alpha_inv = 1.0 - alpha

        # show shapes of all the images
        print(f'img_crop: {img_crop.shape}')
        print(f'img_overlay_crop: {img_overlay_crop.shape}')
        print(f'alpha: {alpha.shape}')
        print(f'alpha_inv: {alpha_inv.shape}')

        img_crop[:] = alpha * img_overlay_crop + alpha_inv * img_crop
        print('DONE')

        # show the image
        cv2.namedWindow(f"images_features", cv2.WINDOW_NORMAL)
        cv2.imshow(f'images_features', img_crop)
        cv2.waitKey(0)

    def stitch_images_list(self, image_list: list):
        """
        Stitch list of images in the specified pattern.

        The correct pattern has been calculated in find_correct_image_pattern() method
        """
        left_image, right_image = image_list[0], image_list[1]
        for i in range(2, len(image_list)):
            # get the next image
            next_image = image_list[i]
            # stitch the pano with the next image
            pano, matches = self.stitch_two_images(left_image, right_image, debug=False)
            pano = self._crop_biggest_contour(pano)
            # set the next image as the left image
            left_image = pano
            # set the next image as the right image
            right_image = next_image

            # pano = left_image
            # show pano
            cv2.namedWindow("Normal Pano", cv2.WINDOW_NORMAL)
            cv2.imshow("Normal Pano", pano)
            cv2.waitKey(0)

        # show pano
        cv2.namedWindow("FINAL Pano", cv2.WINDOW_NORMAL)
        cv2.imshow("FINAL Pano", pano)
        cv2.waitKey(0)

        return pano

    def stitch_two_images(self, left_image, right_image, debug=False):
        """
        Stitch two images together using the homography matrix
        """
        # compute the homography matrix
        H = self.get_homography_matrix(left_image, right_image, debug=debug)

        if H is not None:
            H, matches = H
            print(f'No. of matches: {len(matches)}')
            # use the homography matrix to stitch the images together
            stitched_img = self.warp_images(H, left_image, right_image)
            return stitched_img, len(matches)
        else:
            return None

    def stitch_two_videos(self, vid_1, vid_2, save=False):
        """
        Stitching first frame from videos, and then using
        those key points to auto-stitch the rest of the frames
        without applying the stitching process on all frames

        """
        cap1 = cv2.VideoCapture(vid_1)
        cap2 = cv2.VideoCapture(vid_2)

        total_frames_cap1 = int(cap1.get(cv2.CAP_PROP_FRAME_COUNT))
        total_frames_cap2 = int(cap2.get(cv2.CAP_PROP_FRAME_COUNT))
        print(f'Total frames cap 1: {total_frames_cap1}')
        print(f'Total frames cap 2: {total_frames_cap2}')

        # skip first 10 frames
        for i in range(60):
            cap1.read()
            # cap2.read()

        if save:
            # size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
            #         int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
            # size = (3840, 1080)
            size = (1920, 540)
            out = cv2.VideoWriter('out_videos/out_1.mp4',
                                  cv2.VideoWriter_fourcc('m', 'p', '4', 'v'),
                                  10, size)

        scaling = True
        scaling_factor = 0.5
        is_stitched = False
        counter = 0
        while cap1.isOpened() and cap2.isOpened():
            print("Frame: ", counter)
            counter += 1

            ret1, left_image = cap2.read()
            ret2, right_image = cap1.read()

            if not ret1 or not ret2:
                break

            # stitch the first frame and compute the homography bw images
            # then use that homography to stitch/warp the rest of the frames
            if not is_stitched:
                print("Computing homography matrix...")
                H, _ = self.get_homography_matrix(left_image, right_image)
                is_stitched = True
                if H is None:
                    print("No homography matrix found")
                    break

            # after every 20 frames, set is_stitched to False, to recompute the homography matrix
            if counter % 50 == 0:
                is_stitched = False

            # warping the right image to the left image
            pano = self.warp_images(H, left_image, right_image)
            print(f'pano shape: {pano.shape}')

            # post--processing the panorama image by cropping out the black area
            # pano = self.post_process_pano(pano, debug=False)

            if save:
                if scaling:
                    size = pano.shape[1], pano.shape[0]
                    scaled_size = (int(size[0] * scaling_factor), int(size[1] * scaling_factor))
                    # size = (3840, 1080)
                    # size = (1920, 540)
                    out = cv2.VideoWriter('out_videos/out_1.mp4',
                                          cv2.VideoWriter_fourcc('m', 'p', '4', 'v'),
                                          10, scaled_size)
                scaling = False
                # scaled_down_dims = (int(pano.shape[1] / 2), int(pano.shape[0] / 2))
                img = cv2.resize(pano, scaled_size)
                out.write(img)

            cv2.namedWindow("panorama", cv2.WINDOW_NORMAL)
            cv2.imshow("panorama", pano)
            cv2.waitKey(1)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap1.release()
        cap2.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    ...
    # left_image = cv2.imread('images/campus_left.jpeg')
    # right_image = cv2.imread('images/campus_right.jpeg')
    # output_image = 'output/room_translated.jpeg'
    #
    # # img1 = cv2.imread('mares-cv-panorama-dataset/S1.jpg')
    # # img2 = cv2.imread('mares-cv-panorama-dataset/S2.jpg')
    # # img3 = cv2.imread('mares-cv-panorama-dataset/S3.jpg')
    # # img4 = cv2.imread('mares-cv-panorama-dataset/S5.jpg')
    # # img5 = cv2.imread('mares-cv-panorama-dataset/S6.jpg')
    #
    # # ================================================== #
    # # ================== CUI Videos =================== #
    # # ================================================== #
    # ICPR_BASE_PATH = '/home/ahmadbinshafiq/datasets/pano-cui-2'
    # # get first frame from each video
    # cap1 = cv2.VideoCapture(f'{ICPR_BASE_PATH}/ahmad/a1.mp4')
    # cap2 = cv2.VideoCapture(f'{ICPR_BASE_PATH}/Moiz/a1.MOV')
    # # cap3 = cv2.VideoCapture(f'{ICPR_BASE_PATH}/right.mp4')
    # # cap4 = cv2.VideoCapture(f'{ICPR_BASE_PATH}/cam-134.avi')
    #
    # ret1, img1 = cap1.read()
    # ret2, img2 = cap2.read()
    # # ret3, img3 = cap3.read()
    #
    # # save these images
    # cv2.imwrite('ICRV/a1.jpg', img1)
    # cv2.imwrite('ICRV/m1.jpg', img2)
    # # cv2.imwrite('ICRV/cam133.jpg', img3)
    #
    # cap1.release()
    # cap2.release()
    # # cap3.release()
    #
    # # ================================================== #
    # # ================== ICPR Videos =================== #
    # # ================================================== #
    #
    #
    # vid_1 = 'videos/16.mp4'
    # vid_2 = 'videos/15.mp4'
    #
    # vid_1 = f'{ICPR_BASE_PATH}/ahmad/a2.mp4'
    # # vid_1 = f'{ICPR_BASE_PATH}/basit/vid/b3.mp4'
    # vid_2 = f'{ICPR_BASE_PATH}/Moiz/m2.MOV'
    #
    # cap1 = cv2.VideoCapture(vid_1)
    # cap2 = cv2.VideoCapture(vid_2)
    #
    # ret1, img1 = cap1.read()
    # ret2, img2 = cap2.read()
    # # ret3, img3 = cap3.read()
    #
    # # save these images
    # cv2.imwrite('ICRV/a2.jpg', img1)
    # cv2.imwrite('ICRV/m2.jpg', img2)
    # # cv2.imwrite('ICRV/cam133.jpg', img3)
    #
    # # cap1.release()
    # # cap2.release()
    # # cap3.release()
    #
    # pano = ImageStitching()
    # # pano.stitch_two_videos(vid_2, vid_1, save=True)
    # panorama1, _ = pano.stitch_two_images(img1, img2, debug=True)
    # # panorama2, _ = pano.stitch_two_images(img2, img3, debug=False)
    #
    # # panorama, _ = pano.stitch_two_images(panorama1, img3, debug=False)
    # # panorama = pano._crop_biggest_contour(panorama)
    # if panorama1 is not None:
    #     cv2.namedWindow("panorama1", cv2.WINDOW_NORMAL)
    #     cv2.imshow("panorama1", panorama1)
    # #     cv2.imwrite('output/cui1.jpg', panorama1)
    # #     cv2.namedWindow("panorama2", cv2.WINDOW_NORMAL)
    # #     cv2.imshow("panorama2", panorama2)
    # #     cv2.namedWindow("f-panorama", cv2.WINDOW_NORMAL)
    # #     cv2.imshow("f-panorama", panorama)
    # #
    #     cv2.waitKey(0)
    #
    # # images_pattern = pano.find_correct_image_pattern([img2, img1])
    # # pano.stitch_images_list(images_pattern)
    #
    # # images_pattern = pano.find_correct_image_pattern([img3, img1])
    # # pano.stitch_images_list(images_pattern)
    #
    # # my_pano = pano.stitch_images_list([img1, img2, img3, img4, img5])
    # # cv2.imwrite('output/my_pano.jpg', my_pano)
    # # static methods
    # # img = cv2.imread(output_image)
    # # cv2.imshow('img', img)
    # # cv2.waitKey(0)
    # # blank_area = pano.get_blank_area_of_image(img)
    #
    # # a = np.array([[0, 1, 7, 0], [3, 0, 2, 19]])
    # # print(np.count_nonzero(a))
    # # # count all elements in the array
    # # print(np.size(a))
    #
    # # overlay image crop code below ...
    # # prepare inputs for function overlay_image_alpha
    # # img = cv2.imread('images/ll.png')
    # # img_overlay = cv2.imread('images/mm.png')
    # # print(f'img: {img.shape}')
    # # x, y = 0, 0
    # # alpha_mask = np.ones(img_overlay.shape, img_overlay.dtype) * 0.5
    # # print(f'alpha_mask: {alpha_mask.shape}')
    #
    # # call function overlay_image_alpha
    # # ImageStitching.overlay_image_alpha(img, img_overlay, x, y, alpha_mask)
    # # ImageStitching().overlay_image_alpha()
