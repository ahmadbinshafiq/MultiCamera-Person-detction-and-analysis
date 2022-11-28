import torch
import numpy as np
import cv2
import time
import copy


class YOLO:

    def __init__(self, model_path, classes, device, conf=0.3):
        # super().__init__()
        self.model = self._load_model(model_path=model_path, device=device)
        self.model.classes = classes
        self.model.num_classes = len(classes)
        self.classes = self.model.names
        # self.model.conf = conf

    @staticmethod
    def _load_model(model_path, device):
        model = torch.hub.load(
            'ultralytics/yolov5', 'custom', path=model_path, device=device, force_reload=True
        )
        return model

    def score_frame(self, frame):
        """
        Takes a frame as input, and returns the coordinates of the bounding boxes and the labels.
        :param frame:
        :return:
            labels: list of labels
            coord: list of coordinates
        """
        results = self.model(frame)
        # get labels and coords from results in an optimized way
        labels = results.xyxyn[0][:, -1].cpu().numpy()
        coord = results.xyxyn[0][:, :-2].cpu().numpy()

        # get centroids of bounding boxes
        # centroids = np.array([((x1 + x2) / 2, (y1 + y2) / 2) for x1, y1, x2, y2 in coord])
        centroids = np.array([((x1 + x2) / 2, y2) for x1, y1, x2, y2 in coord])  # bottom center (feet)

        return labels, coord, centroids

    def _label_to_class(self, label):
        """
        Takes a label as input and returns the class name.
        :param label:
        :return:
        """
        return self.classes[int(label)]

    @staticmethod
    def plot_centroids(centroids, frame):
        """
        Takes a frame and its results as input, and plots
        the centroids on to the frame.
        :return:
            Frame with centroids plotted on it.
        """
        # get the height and width of the frame
        height, width, _ = frame.shape
        for centroid in centroids:
            x, y = centroid
            x, y = int(x * width), int(y * height)
            cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)

    def plot_boxes(self, labels, coord, frame):
        """
        Takes a frame and its results as input, and plots
        the bounding boxes and label on to the frame.
        Use filled text ares for labels
        :return:
            Frame with bounding boxes and labels plotted on it.
        """
        # get the height and width of the frame
        height, width, _ = frame.shape
        for i in range(len(labels)):
            x1, y1, x2, y2 = coord[i]
            x1, y1, x2, y2 = int(x1 * width), int(y1 * height), int(x2 * width), int(y2 * height)
            label = self._label_to_class(labels[i])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # create a filled text area for the label and put the label text on it like done in yolov5 detect.py
            (text_width, text_height), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(frame, (x1, y1), (x1 + text_width, y1 - text_height - baseline), (0, 255, 0), cv2.FILLED)
            cv2.putText(frame, label, (x1, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)

    def __call__(self, video_path):
        """
        This function is called when class is executed, it runs the loop to read the video frame by frame,
        and write the output into a new file.
        :return: void
        """
        cap = cv2.VideoCapture(video_path)

        # get total number of frames
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        # self._set_total_frames(total_frames)

        bbox_list = []
        first_frame = True
        while cap.isOpened():
        #for i in range(300):
            start_time = time.perf_counter()
            ret, frame = cap.read()
            if not ret:
                break

            if first_frame:
                print(f'Frame shape: {frame.shape}')
                # self._generate_thresh_map(frame)
                first_frame = False
                #break

            # To test images instead of videos, uncomment the following line
            # frame = cv2.imread('my_pano.jpg')

            # get current frame number
            frame_num = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
            print(f'Frame: {frame_num}/{total_frames}')

            labels, coords, centroids = self.score_frame(frame)
            bbox_list.append(coords)
            # self._update_thresh_map(bbox=coords)
            # heatmap = self.generate_heatmap(
            #     base_frame=frame, frame_count=frame_num, hardness=6
            # )
            self.plot_centroids(centroids, frame)
            self.plot_boxes(labels, coords, frame)
            end_time = time.perf_counter()
            fps = 1 / np.round(end_time - start_time, 3)

            print(f'FPS: {fps}  |  {len(labels)} objects detected in frame ')
            print(f'Inference time: {end_time - start_time} seconds\n')

            # cv2.namedWindow('heatmap', cv2.WINDOW_NORMAL)
            # cv2.imshow('heatmap', heatmap)
            cv2.imshow("img", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        print(f'Finished processing {total_frames} frames.')
        # bbox_list = np.asanyarray(bbox_list, dtype=object)
        # np.save('bbox_list.npy', bbox_list)
        print(f'Numpy array of bounding boxes saved!')

        cap.release()
        cv2.destroyAllWindows()


if __name__ == '__main__':
    BASE_PATH = '/home/ahmadbinshafiq/datasets/pedestrian-walking-videos-YT'
    # BASE_PATH = '/hp/datasets/pedestrian-walking-videos-YT'
    video_name = '1.mp4'
    video_path = f'{BASE_PATH}/{video_name}'

    yolo = YOLO(model_path='weights/yolov5s.pt', classes=[0], device='0', conf=0.3)
    yolo(video_path)
    # pass
