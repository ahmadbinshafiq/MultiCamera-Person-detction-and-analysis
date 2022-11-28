import cv2
import numpy as np

from io_event_handler import IOEventHandler

ground_truth = cv2.imread('videos/groundplane_lab.png')

ground_truth_obj = IOEventHandler()
# ground_truth_obj.frame(ground_truth)
ground_truth_obj.image = ground_truth
# ground_truth_obj.name('ground_truth')
ground_truth_obj.name = 'ground_truth'
ground_truth_obj.set_callback(ground_truth_obj.event_handler)
ground_truth_obj.show()

video_name = 'cam132.avi'
cap = cv2.VideoCapture(f'videos/{video_name}')
first_frame = True

while True:
    ret, frame = cap.read()
    if not ret:
        print(f'image_obj points: {image_obj.points_arr}')
        print(f'ground_truth_obj points: {ground_truth_obj.points_arr}')
        break

    if first_frame:
        first_frame = False
        image_obj = IOEventHandler()
        image_obj.image = frame
        image_obj.name = 'image'
        image_obj.set_callback(image_obj.event_handler)
        image_obj.show()
        cv2.waitKey(0)

    cv2.imshow('image', frame)

    k = cv2.waitKey(1) & 0xFF
    if k == ord('p'):
        print(f'image_obj points: {image_obj.points_arr}')
        print(f'ground_truth_obj points: {ground_truth_obj.points_arr}')
    elif k == ord('s'):
        # save points to npy file
        np.save(f'npy/{video_name}.npy', np.array([image_obj.points_arr, ground_truth_obj.points_arr]))
        print(f'points saved to npy/{video_name}.npy')
    elif k == ord('q'):
        print(f'image_obj points: {image_obj.points_arr}')
        print(f'ground_truth_obj points: {ground_truth_obj.points_arr}')
        break
