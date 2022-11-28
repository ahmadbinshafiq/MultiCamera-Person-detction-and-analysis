import argparse
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--npy_file', help='name of npy file')
parser.add_argument('--video_file', help='name of video file')
args = parser.parse_args()

if args.video_file:
    points = np.load(f'{args.video_file}.npy', allow_pickle=True)
elif args.npy_file:
    points = np.load(args.npy_file, allow_pickle=True)
else:
    print('No video or npy file specified')
    exit()

image_points = points[0]
ground_truth_points = points[1]

print(f'len(image_points): {len(image_points)} -- len(ground_truth_points): {len(ground_truth_points)}')
print(f'image_points: {image_points}')
print(f'ground_truth_points: {ground_truth_points}')
