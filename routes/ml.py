import cv2
from fastapi import WebSocket, WebSocketDisconnect, APIRouter, status, HTTPException, Depends, Response
from sqlalchemy.future import select
from websockets.exceptions import ConnectionClosedError

from cfg import SKIP_FRAMES, SCALING_FACTOR, STITCHING_FRAMES_INTERVAL
from database.db import Database
from main import TrackAndMapPointsUsingHomography
from image_operations import ImageUtils as IM

db = Database()
map_points = TrackAndMapPointsUsingHomography()

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning Pipeline"],
    responses={404: {"description": "Not found"}},
)


@router.get('/test', tags=["Test"])
async def test(response: Response):
    response.status_code = status.HTTP_200_OK
    return {"message": "Test successful"}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_json()
    video_id = int(data['video_id'])

    await db.connect()
    query = select(db.cameras).where(db.cameras.c.id == video_id)
    result = await db.db.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No cameras found")

    video_path = result['video_path']
    gt_path = result['gt_path']
    npy_path = result['npy_path']

    # get video name from path
    video_name = video_path.split('/')[-1]
    video_name = video_name.split('.')[0]

    try:
        await map_points.run(video_path, gt_path, npy_path, video_name, websocket)
    except WebSocketDisconnect:
        await websocket.close()
    except ConnectionClosedError:
        await websocket.close()

    await db.disconnect()


@router.websocket("/stitch_and_detect")
async def stitch_and_detect_feed(websocket: WebSocket):
    """
    This endpoint is used to stitch the video and detect the objects in the video
    :param websocket: video_1: moiz iphone video, video_2: ahmad's video
    :return:
    """
    await websocket.accept()
    data = await websocket.receive_json()
    video_id_1 = int(data['video_id_1'])
    video_id_2 = int(data['video_id_2'])

    await db.connect()
    query = select(db.cameras).where(db.cameras.c.id == video_id_1)
    result_1 = await db.db.fetch_one(query)
    query = select(db.cameras).where(db.cameras.c.id == video_id_2)
    result_2 = await db.db.fetch_one(query)
    if result_1 is None or result_2 is None:
        raise HTTPException(status_code=404, detail="No cameras found")

    video1_path = result_1['video_path']
    video2_path = result_2['video_path']
    gt_path = result_1['gt_path']
    npy_path = result_1['npy_path']

    # get video name from path
    video_name = video1_path.split('/')[-1]
    npy_name = video_name.split('.')[0]

    try:
        await map_points.stitch_and_run(video1_path, video2_path, gt_path, npy_path, npy_name, SKIP_FRAMES,
                                        STITCHING_FRAMES_INTERVAL, SCALING_FACTOR, websocket)
    except WebSocketDisconnect:
        await websocket.close()
    except ConnectionClosedError:
        await websocket.close()

    await db.disconnect()


@router.websocket("/all_feeds")
async def stream_all_videos(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_json()
    print(f"Received data: {data}")
    await db.connect()
    # get all videos
    query = select(db.cameras)
    result = await db.db.fetch_all(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No cameras found")

    caps_arr = []
    for row in result:
        video_path = row['video_path']
        caps_arr.append(cv2.VideoCapture(video_path))

    try:
        while True:
            frames_arr = []
            for cap in caps_arr:
                ret, frame = cap.read()
                if ret:
                    frame = cv2.resize(frame, (640, 480))
                    frame_str = IM.np_to_base64(frame)
                    frames_arr.append(frame_str)
                else:
                    break
            if len(frames_arr) == 0:
                break

            print(f"Sending {len(frames_arr)} frames")
            await websocket.send_json({"frames_arr": frames_arr})

    except WebSocketDisconnect:
        await websocket.close()
    except ConnectionClosedError:
        await websocket.close()

    await db.disconnect()
