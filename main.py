import torch
import cv2

from detect_gender_and_age import age_gender_detector

# Model - we will use yolov5s
model = torch.hub.load('ultralytics/yolov5', 'yolov5m')

# Image
# cv_img = 'https://ultralytics.com/images/zidane.jpg'
cv_img = cv2.imread('zidane.jpg')
# cv2.imshow('zidane', cv_img)
# cv2.waitKey(0)

# Video
vid = cv2.VideoCapture(0)


while True:
    ret, frame = vid.read()
    # cv2.imshow('frame', frame)

    # Inference
    results = model(frame)  # pass the image through our model
    frame = age_gender_detector(frame)
    # print(age_gender)

    # creates a dataframe of all predictions from yolov5
    predictions = results.pandas().xyxy[0]
    filtered_preds = predictions[(predictions['class'] == 0) & (predictions['confidence'] > 0.60)]
    # filtered_preds = predictions[filtered_preds['confidence'] > 0.60]
    # print(filtered_preds)

    for index, row in filtered_preds.iterrows():
        x, y, xx, yy, label = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax']), row['name']
        frame = cv2.rectangle(frame, (x, y), (xx, yy), (255, 0, 0), 2)
        frame = cv2.putText(frame, label, (x-10, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2, cv2.LINE_AA)

    cv2.imshow('detections', frame)
    # cv2.waitKey(0)

    # the 'q' button is set as the
    # quitting button you may use any
    # desired button of your choice
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# # Inference
# results = model(cv_img) # pass the image through our model
#
# # creates a dataframe of all predictions from yolov5
# predictions = results.pandas().xyxy[0]
# filtered_preds = predictions[predictions['class'] == 0]
# # print(filtered_preds)
#
# for index, row in filtered_preds.iterrows():
#     x, y, xx, yy, cls = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax']), int(row['class'])
#     cv_img = cv2.rectangle(cv_img, (x, y), (xx, yy), (255, 0, 0), 2)
#
# # cv2.imshow('zidane', cv_img)
# # cv2.waitKey(0)

# print(results.pandas().xyxy[0])


# Press the green button in the gutter to run the script.
# if __name__ == '__main__':
#     print_hi('PyCharm')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
