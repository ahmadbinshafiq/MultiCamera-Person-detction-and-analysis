import cv2
import json
import requests

from video_async import MultiCameraCapture


def launch_camera():
    cameras = json.loads(open('cameras.json').read())
    captured = MultiCameraCapture(source=cameras)

    while True:
        for cam_name, cap in captured.capture.items():
            # frame = captured.read_frame(cap)
            frame = captured.decode_frame(requests, cap)
            cv2.imshow(cam_name, frame)
            # cv2.waitKey(0)

            if cv2.waitKey(1) == 27:
                break


if __name__ == '__main__':
    launch_camera()

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
