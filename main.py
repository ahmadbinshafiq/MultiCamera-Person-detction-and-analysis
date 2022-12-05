from datetime import date, time, datetime

import cv2
import numpy as np
from sqlalchemy import insert

from cfg import *
from heatmap.heatmap import MotionHeatmap
from homography.io_event_handler import IOEventHandler
from homography.homography import Homography
from yolov5_tracker.detect_track import DetectNTrack
from age_gender_detector.detect_age_gender import AgeGenderDetector
from image_operations import ImageUtils as IM
from yolov5_tracker.tracker_utils import compare_age_tracker, counts
from image_stitching.stitch_images import ImageStitching


class TrackAndMapPointsUsingHomography(IOEventHandler, Homography, DetectNTrack, MotionHeatmap, AgeGenderDetector,
                                       ImageStitching):

    def __init__(self):
        IOEventHandler.__init__(self)
        Homography.__init__(self)
        MotionHeatmap.__init__(self)
        DetectNTrack.__init__(self, weights=YOLOV5M_WEIGHTS, draw_detections=DRAW_YOLO_DETECTIONS, classes=CLASSES)
        AgeGenderDetector.__init__(self, face_path=FACE_DETECTION_MODEL,
                                   age_path=AGE_GENDER_DETECTION_MODEL, draw_boxes=DRAW_AGE_GENDER_DETECTIONS,
                                   show_face_crop=False
                                   )
        ImageStitching.__init__(self)

    @staticmethod
    def load_npy(npy_file):
        return np.load(npy_file, allow_pickle=True)

    def homography(self, npy_path):
        points_array = self.load_npy(npy_path)
        self.points = points_array
        self.compute_homography()
        # print(f'START H: {self._homography_matrix}')

    def map_centroids(self, centroids: list, shape: tuple):
        mapped_centroids = []
        for centroid in centroids:
            # upscaled_centroid = im.upscale_centroids(centroid, shape)
            centroid.insert(2, 1)  # add 1 to the end of the list for matrix multiplication - 3x1 matrix
            mapped_centroids.append(self.map_points(centroid))
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
            cv2.circle(frame, (x, y), CIRCLE_WIDTH, (0, 0, 255), -1)
        return frame

    async def run(self, *args):
        # TODO: give heatmap_image name, and npy_file name in the args
        if len(args) > 0:
            camera_id, video_path, gt_path, npy_path, npy_name, websocket, db = args[0], args[1], args[2], args[3], args[4], args[5], args[6]

        self.homography(npy_path=npy_path)
        gt = cv2.imread(gt_path)
        gt_shape = gt.shape
        cap = cv2.VideoCapture(video_path)

        # get total number of frames
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self._set_total_frames(total_frames)

        bbox_list = []
        new_age_tracker, prev_age_tracker = {}, {}
        first_frame = True
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if first_frame:
                print(f'Frame shape: {frame.shape}')
                self._generate_thresh_map(frame)
                heatmap = frame.copy()
                first_frame = False

            # get current frame number
            frame_num = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
            # print(f'Frame: {frame_num}/{total_frames}')

            self.outputs = self.detect(frame, debug=DEBUG)
            if self.outputs[0] is not None:  # if there are detections
                # map the centroids to the ground plane
                tracking_ids, coord, centroids = self.get_coords_and_centroids(self.outputs[0])
                mapped_centroids = self.map_centroids(centroids, gt_shape)
                gt = self.plot_centroids_on_gt(mapped_centroids, gt)

                # generate heatmap
                bbox_list.append(coord)
                self._update_thresh_map(bbox=coord)
                heatmap = self.generate_heatmap(
                    base_frame=frame, frame_count=frame_num, hardness=HARDNESS
                )

                # detect age and gender
                for track_id, coordinate in zip(tracking_ids, coord):
                    person_crop = IM.image_from_xywh(frame, coordinate)
                    # check if the person is in the frame i.e. crop is valid
                    if person_crop.shape[0] > 0 and person_crop.shape[1] > 0:
                        age, gender = self.detect_age_n_gender(person_crop)
                        new_age_tracker[int(track_id)] = [age, gender]
                        # print(f'Age: {age}, -- Gender: {gender}')

                # get all the keys in the new tracker and the previous tracker
                new_keys = list(new_age_tracker.keys())
                prev_keys = list(prev_age_tracker.keys())
                print(f'New keys: {new_keys} -- Prev keys: {prev_keys}')

                # check if the prev tracker has any keys that are not in the new tracker
                unique_keys = list(set(new_keys) - set(prev_keys))
                if len(unique_keys) > 0:
                    for key in unique_keys:
                        key = int(key)
                        print(f"pushing {key} - {new_age_tracker[key]} to db...")
                        counts_for_db = counts({key: new_age_tracker[key]})
                        del counts_for_db['total_people']
                        print(f"data to be pushed to db: {counts_for_db}")
                        query = insert(db.analytics).values(
                            camera_id=camera_id,  # TODO: change this to the camera id
                            date=date.today(),
                            time=datetime.now().time(),
                            males_count=counts_for_db['male_count'],
                            females_count=counts_for_db['female_count'],
                            unknown_count=counts_for_db['unknown_count'],
                            child_count=counts_for_db['child_count'],
                            teen_count=counts_for_db['teen_count'],
                            adult_count=counts_for_db['adult_count'],
                            elderly_count=counts_for_db['elderly_count']
                        )
                        await db.db.execute(query)

                cv2.namedWindow('heatmap', cv2.WINDOW_NORMAL)
                cv2.imshow('heatmap', heatmap)

            prev_age_tracker = compare_age_tracker(new_age_tracker, prev_age_tracker)
            counts_dict = counts(prev_age_tracker)  # live counts of people, gender and age
            # print(f"counts_dict: {counts_dict}")

            # frame = cv2.warpPerspective(frame, self._homography_matrix, (frame.shape[1], frame.shape[0]))
            cv2.namedWindow('frame', cv2.WINDOW_NORMAL)
            cv2.imshow('frame', frame)
            cv2.namedWindow('gt', cv2.WINDOW_NORMAL)
            cv2.imshow('gt', gt)
            k = cv2.waitKey(1) & 0xFF
            if k == ord('q'):
                break

            if len(args) > 0:
                frame_str = IM.np_to_base64(frame)
                heatmap_str = IM.np_to_base64(heatmap)
                gt_str = IM.np_to_base64(gt)
                await websocket.send_json({"image": frame_str, "heatmap": heatmap_str, "homography_map": gt_str,
                                           "counts": counts_dict})

        # save the coordinates of the bounding boxes for heatmap generation
        bbox_list = np.asanyarray(bbox_list, dtype=object)
        np.save(TRACK_NPY_PATH + f'{npy_name}.npy', bbox_list)

        # save the current heatmap
        cv2.imwrite(HEATMAP_IMAGE_PATH + f'{npy_name}.png', heatmap)

        cap.release()
        cv2.destroyAllWindows()

    async def stitch_and_run(self, *args):
        if len(args) > 0:
            video1_path, video2_path, gt_path, npy_path, npy_name, skip_frames, frames_interval, scaling_factor, \
            websocket = args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]

        self.homography(npy_path=npy_path)
        gt = cv2.imread(gt_path)
        gt_shape = gt.shape
        cap1 = cv2.VideoCapture(video1_path)
        cap2 = cv2.VideoCapture(video2_path)

        # get total number of frames
        total_frames = int(cap2.get(cv2.CAP_PROP_FRAME_COUNT))
        self._set_total_frames(total_frames)

        for i in range(skip_frames):
            cap1.read()
            # cap2.read()

        bbox_list = []
        new_age_tracker, prev_age_tracker = {}, {}
        first_frame = True
        is_stitched = False
        counter = 0
        while cap1.isOpened() and cap2.isOpened():
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
            if counter % frames_interval == 0:
                is_stitched = False

            # warping the right image to the left image
            pano = self.warp_images(H, left_image, right_image)
            print(f'pano shape: {pano.shape}')

            # resize the stitched image
            size = pano.shape[1], pano.shape[0]
            scaled_size = (int(size[0] * scaling_factor), int(size[1] * scaling_factor))
            pano = cv2.resize(pano, scaled_size)

            cv2.namedWindow('pano', cv2.WINDOW_NORMAL)
            cv2.imshow('pano', pano)

            if first_frame:
                print(f'Frame shape: {pano.shape}')
                self._generate_thresh_map(pano)
                heatmap = pano.copy()
                first_frame = False

            # get current frame number
            frame_num = int(cap2.get(cv2.CAP_PROP_POS_FRAMES))
            # print(f'Frame: {frame_num}/{total_frames}')

            self.outputs = self.detect(pano, debug=DEBUG)
            if self.outputs[0] is not None:  # if there are detections
                # map the centroids to the ground plane
                tracking_ids, coord, centroids = self.get_coords_and_centroids(self.outputs[0])
                mapped_centroids = self.map_centroids(centroids, gt_shape)
                self.plot_centroids_on_gt(mapped_centroids, gt)

                # generate heatmap
                bbox_list.append(coord)
                self._update_thresh_map(bbox=coord)
                heatmap = self.generate_heatmap(
                    base_frame=pano, frame_count=frame_num, hardness=HARDNESS
                )

                # detect age and gender
                for track_id, coordinate in zip(tracking_ids, coord):
                    person_crop = IM.image_from_xywh(pano, coordinate)
                    # check if the person is in the frame i.e. crop is valid
                    if person_crop.shape[0] > 0 and person_crop.shape[1] > 0:
                        age, gender = self.detect_age_n_gender(person_crop)
                        new_age_tracker[int(track_id)] = [age, gender]
                        # print(f'Age: {age}, -- Gender: {gender}')

                prev_age_tracker = compare_age_tracker(new_age_tracker, prev_age_tracker)
                counts_dict = counts(prev_age_tracker)  # live counts of people, gender and age
                # print(f"counts_dict: {counts_dict}")

                cv2.namedWindow('heatmap', cv2.WINDOW_NORMAL)
                cv2.imshow('heatmap', heatmap)

            if len(args) > 0:  # if websocket is passed
                frame_str = IM.np_to_base64(pano)
                heatmap_str = IM.np_to_base64(heatmap)
                gt_str = IM.np_to_base64(gt)
                left_image_str = IM.np_to_base64(left_image)
                right_image_str = IM.np_to_base64(right_image)
                await websocket.send_json({"image": frame_str, "heatmap": heatmap_str, "homography_map": gt_str,
                                           "counts": counts_dict, "left_image": left_image_str,
                                           "right_image": right_image_str})

            # frame = cv2.warpPerspective(frame, self._homography_matrix, (frame.shape[1], frame.shape[0]))
            cv2.namedWindow('pano-frame', cv2.WINDOW_NORMAL)
            cv2.imshow('pano-frame', pano)
            cv2.namedWindow('gt', cv2.WINDOW_NORMAL)
            cv2.imshow('gt', gt)
            k = cv2.waitKey(1) & 0xFF
            if k == ord('q'):
                break

        cap1.release()
        cap2.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    map_points = TrackAndMapPointsUsingHomography()
    video_path = "media/local_storage/videos/7fe95985-7724-4744-a9f2-22e2a98caf58.mp4"
    gt_path = "media/local_storage/gt/7fe95985-7724-4744-a9f2-22e2a98caf58.png"
    npy_path = "media/local_storage/npy/7fe95985-7724-4744-a9f2-22e2a98caf58.npy"
    npy_name = "7fe95985-7724-4744-a9f2-22e2a98caf58.npy"
    websocket = "ws://localhost:8000/ws/track_and_map_points/"
    # map_points.run(video_path, gt_path, npy_path, npy_name, websocket)


    ICPR_BASE_PATH = '/home/ahmadbinshafiq/datasets/pano-cui-2'
    vid_1 = f'{ICPR_BASE_PATH}/ahmad/a2.mp4'
    vid_2 = f'{ICPR_BASE_PATH}/Moiz/m2.MOV'
    # gt_path = 'media/gts/cui1_gt1.jpg'
    # npy_path = 'media/homography_npy/cui1.mp4.npy'
    npy_name = 'cui1'
    skip_frames = 60
    frames_interval = 200
    scaling_factor = 0.5
    websocket = None

    # map_points.stitch_and_run(vid_2, vid_1, gt_path, npy_path, npy_name, skip_frames, frames_interval, scaling_factor, websocket)