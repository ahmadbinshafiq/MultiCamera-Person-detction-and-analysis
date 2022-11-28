import time

import cv2
import numpy as np

from detect_face import DetectFaceOpenvino
from age_gender import AgeGenderOpenvino
from image_utils import ImageUtils as im

model_path_face = "models/face-detection-adas-0001/FP32/face-detection-adas-0001.xml"
model_path_age = "models/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"

face_detector = DetectFaceOpenvino()
face_detector.load_model(model_path=model_path_face)
face_detector.model_arch('face detector')

age_gender_detector = AgeGenderOpenvino()
age_gender_detector.load_model(model_path=model_path_age)
age_gender_detector.model_arch('age gender detector')

# play video from opencv
cap = cv2.VideoCapture('vlc-record-2022-10-21-19h50m04s-NVR_ch3_main_20221020130001_20221020140001.mp4-.mp4')

size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
size = (360, 640)
out = cv2.VideoWriter('out_1.mp4',
                      cv2.VideoWriter_fourcc(*'MJPG'),
                      10, size)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Unable to capture video")
        break

    # detect face
    reshaped_image, resized_image = face_detector.pre_process(frame)
    output = face_detector.inference(reshaped_image)
    output = face_detector.parse_output_layer(output)
    faces_coords = face_detector.post_process(output)

    height, width, _ = frame.shape
    print(f'frame shape: {frame.shape}')

    for face in faces_coords:
        # crop face from frame
        image = im.image_from_xywh(frame, face)
        cv2.imshow('face', image)
        cv2.waitKey(1)
        # detect age and gender
        reshaped_image, resized_image = age_gender_detector.pre_process(image)
        output = age_gender_detector.inference(reshaped_image)
        age, gender = age_gender_detector.parse_output_layer(output)
        age, gender = age_gender_detector.post_process(age, gender)

        # draw face box
        x, y, w, h = face
        x, y, w, h = int(x * width), int(y * height), int(w * width), int(h * height)
        cv2.rectangle(frame, (x, y), (w, h), (0, 255, 0), 2)
        cv2.putText(
            frame,
            f"{age}-{gender}",
            (x - 10, y - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 255),
            2,
        )

    # save to video file
    frame = cv2.resize(frame, (360, 640))
    out.write(frame)

    cv2.namedWindow('frame', cv2.WINDOW_NORMAL)
    cv2.imshow('frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
