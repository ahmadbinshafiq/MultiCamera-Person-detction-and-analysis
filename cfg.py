# Stream types
LOCAL_STREAM = 0
REMOTE_STREAM = 1

# postgresql database connection string
connection_string = "postgresql://postgres:postgres@localhost:5432/postgres"


# ML-PIPELINE

# yolov5 paths
STRONG_SORT_YAML = "yolov5_tracker/trackers/strong_sort/configs/strong_sort.yaml"
YOLOV5M_WEIGHTS = "weights/yolov5m.pt"

# age gender detectors (openvino) paths
FACE_DETECTION_MODEL = "weights/face-detection-adas-0001/FP32/face-detection-adas-0001.xml"
AGE_GENDER_DETECTION_MODEL = "weights/age-gender-recognition-retail-0013/FP32/age-gender-recognition-retail-0013.xml"

# config
DRAW_YOLO_DETECTIONS = True
DRAW_AGE_GENDER_DETECTIONS = True
SHOW_FACE_CROPS = False  # show detected faces in a separate window (age-gender detection)
CLASSES = [0]  # YOLO classes, 0 is person, None is all classes
DEBUG = False
HARDNESS = 0.5  # heatmap hardness
CIRCLE_WIDTH = 8  # homography circle width

# saving data
SAVE_DATA = True
HOMOGRAPHY_NPY_PATH = "media/homography_npy/"
HEATMAP_NPY_PATH = "media/heatmap_npy/"
SAVE_VIDEO_PATH = "media/videos/"
HEATMAP_IMAGE_PATH = "media/heatmap_images/"
TRACK_NPY_PATH = "media/local_storage/track_npy/"

# image stitching config
SKIP_FRAMES = 60  # skip frames for image stitching
STITCHING_FRAMES_INTERVAL = 100  # stitch images every 10 frames
SCALING_FACTOR = 0.5  # image scaling factor for image stitching


