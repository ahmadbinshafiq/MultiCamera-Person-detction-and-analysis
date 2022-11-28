import cv2
import numpy as np


class MotionHeatmap:
    """
    Generates heatmap based on bbox coordinates.
    """

    def __init__(self, color=cv2.COLORMAP_TURBO, alpha=0.00001, total_frames=1):
        """
        Takes a frame as input and generates a black image of the same size.

        param frame: original frame of the video
        param color: heatmap color scheme.
        param alpha: change of white pixels in thresh_map that will be used to generate the heatmap.
        """
        self.thresh_map = None
        self.color = color
        self.alpha = alpha
        self.width = None
        self.height = None
        self.total_frames = total_frames
        self.norm_max = 255

    def _set_total_frames(self, total_frames: int):
        self.total_frames = total_frames

    def _generate_thresh_map(self, frame: np.ndarray):
        self.height, self.width, _ = frame.shape
        self.thresh_map = np.zeros((self.height, self.width), dtype=np.float)

    def _upscale_coords(self, bbox: list):
        """
        Upscale the coordinates of the bounding boxes to match the size of the frame
        """
        bbox = np.multiply(bbox, [self.width, self.height, self.width, self.height])
        bbox = bbox.astype(int)
        return bbox

    def _update_thresh_map(self, bbox: list):
        """
        Takes a list of all bboxes as input and updates the thresh_map
        on all places using numpy slicing.

        TODO: try doing through some numpy function
        """
        # bbox = self._upscale_coords(bbox)
        for box in bbox:
            box = box.astype(int)
            self.thresh_map[box[1]:box[3], box[0]:box[2]] += self.alpha

        # # show thresh_map
        # cv2.namedWindow("thresh_map", cv2.WINDOW_NORMAL)
        # cv2.imshow("thresh_map", self.thresh_map)
        # cv2.waitKey(1)

    def _normalize_max_min(self, frame_no: int, skip_frames: int = 1):
        """
        Normalize the max in cv2.normalize to the current frame number.
        """
        return (frame_no * skip_frames / self.total_frames) * 255

    def generate_heatmap(self, base_frame: np.ndarray, frame_count: int, hardness: int = 1):
        """
        Returns a heatmap generated from the thresh_map.
        get vid len, then normalize (0, len)
        """
        if hardness > 0:
            self.norm_max = self._normalize_max_min(frame_no=frame_count * hardness)
        else:
            self.norm_max = self._normalize_max_min(frame_no=frame_count * 1)

        # normalize image brightness before applying color map
        norm_thresh_map = cv2.normalize(
            self.thresh_map, None, 0, min(self.norm_max, 255), cv2.NORM_MINMAX, cv2.CV_8U
        )
        thresh_heatmap = cv2.applyColorMap(norm_thresh_map, self.color)
        heat_map = cv2.addWeighted(base_frame, 0.7, thresh_heatmap, 0.7, 0)

        return heat_map

    def load_heatmap(self, frame_shape: tuple, bbox: list):
        heatmap_frame = np.ones(frame_shape, dtype=np.uint8)
        heatmap_frame *= 255

        # show heatmap_frame
        cv2.namedWindow("heatmap_frame", cv2.WINDOW_NORMAL)
        cv2.imshow("heatmap_frame", heatmap_frame)
        cv2.waitKey(0)
        self._generate_thresh_map(heatmap_frame)
        self._set_total_frames(total_frames=len(bbox))
        for i, box in enumerate(bbox):
            self._update_thresh_map(box)
            print(f"frame: {i}")

        heatmap = self.generate_heatmap(
            heatmap_frame, frame_count=len(bbox), hardness=1
        )

        return heatmap

    def __call__(self, frame_shape, bbox):
        heatmap = self.load_heatmap(frame_shape, bbox)
        # show heatmap
        cv2.namedWindow("heatmap", cv2.WINDOW_NORMAL)
        cv2.imshow("heatmap", heatmap)
        cv2.waitKey(0)

        return heatmap


if __name__ == "__main__":

    # get all bboxes
    bboxes = np.load("bbox_list.npy", allow_pickle=True)
    print(f'Loaded {len(bboxes)} bboxes')
    print(f'bbox shape: {bboxes[0].shape}')

    # initialize heatmap
    heatmap = MotionHeatmap()

    # generate heatmap
    heatmap = heatmap((720, 1280, 3), bboxes)

    # # save heatmap
    cv2.imwrite("heatmap.jpg", heatmap)
    #
    # # close all windows
    # cv2.destroyAllWindows()