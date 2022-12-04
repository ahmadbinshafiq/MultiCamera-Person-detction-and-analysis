import cv2
import numpy as np


def create_ground_truth_image(path, output_path):
    original = cv2.imread(path)

    h, w, c = original.shape
    print(h, w, c)

    # create a blank image
    blank_image = np.zeros((h, w, c), np.uint8)

    # fill the blank image with white
    blank_image[:] = (255, 255, 255)

    # save the image
    cv2.imwrite(output_path, blank_image)

    # show the image
    cv2.imshow("blank_image", blank_image)
    cv2.waitKey(0)


if __name__ == "__main__":
    create_ground_truth_image("cui1.jpg", output_path="blank_image.jpg")
