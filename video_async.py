import cv2
import requests
import numpy as np
import imutils


class MultiCameraCapture:

    def __init__(self, source: dict):
        self.capture = {}
        for camera_name, link in source.items():
            self.capture[camera_name] = link
            # cap = cv2.VideoCapture(link)
            # print(camera_name)
            # self.capture[camera_name] = cap

    @staticmethod
    def read_frame(capture):
        # capture.grab()
        # ret, frame = capture.retrieve()
        ret, frame = capture.read()
        if not ret:
            print('Empty frame')
            return
        return frame

    @staticmethod
    def decode_frame(requests, url):
        img_resp = requests.get(url + '/shot.jpg')
        img_arr = np.array(bytearray(img_resp.content), dtype=np.uint8)
        img = cv2.imdecode(img_arr, -1)
        img = imutils.resize(img, width=1000, height=1800)
        return img
