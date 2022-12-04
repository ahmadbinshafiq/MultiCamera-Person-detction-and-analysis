FROM nvidia/cuda:11.7.1-devel-ubuntu22.04

ARG DEBIAN_FRONTEND=noninteractive

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y  \
    wget build-essential cmake git pkg-config python3 python3-pip libopencv-dev \
    libjpeg-dev libpng-dev libtiff-dev libgtk2.0-dev libatlas-base-dev gfortran webp zlib1g-dev

# FastAPI dependencies
RUN pip3 install fastapi uvicorn[standard] gunicorn asyncpg python-multipart

# Postgres dependencies
RUN pip3 install databases[postgresql] psycopg2-binary

# Extra Python dependencies
RUN pip3 install pytz imutils

# YOLO dependencies
RUN pip3 install gitpython
RUN pip3 install ipython  # interactive notebook
RUN pip3 install matplotlib>=3.2.2
RUN pip3 install numpy>=1.18.5
RUN pip3 install opencv-python>=4.1.1
RUN pip3 install Pillow>=7.1.2
RUN pip3 install psutil  # system resources
RUN pip3 install PyYAML>=5.3.1
RUN pip3 install requests>=2.23.0
RUN pip3 install scipy>=1.4.1
RUN pip3 install thop>=0.1.1  # FLOPs computation
RUN pip3 install torch>=1.7.0  # see https://pytorch.org/get-started/locally (recommended)
RUN pip3 install torchvision>=0.8.1
RUN pip3 install tqdm>=4.64.0
RUN pip3 install tensorboard>=2.4.1
RUN pip3 install pandas>=1.1.4
RUN pip3 install seaborn>=0.11.0

# StrongSORT dependencies
RUN pip3 install easydict

# torchreid -------------------------------------------------------------------
RUN pip3 install gdown

# ByteTrack -------------------------------------------------------------------
RUN pip3 install lap
RUN pip3 install git+https://github.com/samson-wang/cython_bbox.git@9badb346a9222c98f828ba45c63fe3b7f2790ea2

# OCSORT ----------------------------------------------------------------------
RUN pip3 install filterpy

RUN pip3 install openvino-dev
RUN pip3 install nvidia-pyindex
RUN pip3 install nvidia-tensorrt