import cv2
import numpy as np

from cfg import *
from heatmap.heatmap import MotionHeatmap
from homography.io_event_handler import IOEventHandler
from homography.homography import Homography
from yolov5_tracker.detect_track import DetectNTrack
from age_gender_detector.detect_age_gender import AgeGenderDetector
from image_operations import ImageUtils as IM
from yolov5_tracker.tracker_utils import compare_age_tracker, counts


class TrackAndMapPointsUsingHomography(IOEventHandler, Homography, DetectNTrack, MotionHeatmap, AgeGenderDetector):

    def __init__(self):
        IOEventHandler.__init__(self)
        Homography.__init__(self)
        MotionHeatmap.__init__(self)
        DetectNTrack.__init__(self, weights=YOLOV5M_WEIGHTS, draw_detections=DRAW_YOLO_DETECTIONS, classes=CLASSES)
        AgeGenderDetector.__init__(self, face_path=FACE_DETECTION_MODEL,
                                   age_path=AGE_GENDER_DETECTION_MODEL, draw_boxes=DRAW_AGE_GENDER_DETECTIONS,
                                   show_face_crop=False
                                   )

    @staticmethod
    def load_npy(npy_file):
        return np.load(npy_file, allow_pickle=True)

    def homography(self, npy_path):
        points_array = self.load_npy(npy_path)
        self.points = points_array
        self.compute_homography()
        # print(f'H: {self._homography_matrix}')

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
            video_path, gt_path, npy_path, websocket = args[0], args[1], args[2], args[3]

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

                prev_age_tracker = compare_age_tracker(new_age_tracker, prev_age_tracker)
                counts_dict = counts(prev_age_tracker)  # live counts of people, gender and age

                cv2.namedWindow('heatmap', cv2.WINDOW_NORMAL)
                cv2.imshow('heatmap', heatmap)

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
                await websocket.send_json({"image": frame_str, "heatmap": heatmap_str, "homography_map": gt_str})  # TODO: send counts

        # save the coordinates of the bounding boxes for heatmap generation
        bbox_list = np.asanyarray(bbox_list, dtype=object)
        np.save(HEATMAP_NPY_PATH + 'bbox_list.npy', bbox_list)

        # save the current heatmap
        cv2.imwrite(HEATMAP_IMAGE_PATH + 'heatmap.png', heatmap)

        cap.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    map_points = TrackAndMapPointsUsingHomography()
    map_points.run()
