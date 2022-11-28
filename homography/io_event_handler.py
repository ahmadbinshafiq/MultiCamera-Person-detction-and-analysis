import cv2


class IOEventHandler:

    def __init__(self):
        self.frame = None
        self.iname = None
        self.points_arr = []
        self.frame_copy = None

    @property
    def image(self):
        return self.frame

    @image.setter
    def image(self, img):
        self.frame = img
        self.frame_copy = img.copy()

    @property
    def name(self):
        return self.iname

    @name.setter
    def name(self, name):
        self.iname = name
        cv2.namedWindow(self.iname, cv2.WINDOW_NORMAL)

    def event_handler(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDBLCLK:
            print('x: {}, y: {}'.format(x, y))
            self.points_arr.append([x, y])
            cv2.circle(self.frame_copy, (x, y), 5, (0, 255, 0), -1)
            self.show()

    @staticmethod
    def get_event_x_y(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDBLCLK:
            print('x: {}, y: {}'.format(x, y))
            return x, y

    def set_callback(self, callback):
        cv2.setMouseCallback(self.iname, callback)

    def show(self):
        print('Showing image: {}'.format(self.iname))
        print('Shape: {}'.format(self.frame_copy.shape))
        cv2.imshow(self.iname, self.frame_copy)
