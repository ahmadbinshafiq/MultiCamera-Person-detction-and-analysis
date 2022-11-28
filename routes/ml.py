import base64

import cv2
from fastapi import WebSocket, WebSocketDisconnect, APIRouter, status, HTTPException, Depends, Response
from sqlalchemy.future import select

from database.db import Database
from main import TrackAndMapPointsUsingHomography
from routes.schemas import VideoId

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

    try:
        await map_points.run(video_path, gt_path, npy_path, websocket)
    except WebSocketDisconnect:
        await websocket.close()

    await db.disconnect()


@router.websocket("/ws1")
async def websocket_endpoint(websocket: WebSocket):
    path = "/home/ahmadbinshafiq/datasets/pedestrian-walking-videos-YT/1.mp4"
    cap = cv2.VideoCapture(path)

    await websocket.accept()
    print("connected")

    msg = await websocket.receive_text()
    print(msg)

    if msg == "start":
        try:
            while True:
                print("streaming...")
                ret, frame = cap.read()
                fcopy = frame.copy()
                # if not ret:
                #     break

                # cv2.imshow("frame", frame)
                # if cv2.waitKey(1) & 0xFF == ord('q'):
                #     await websocket.close()
                #     break

                # print(f"frame size: {frame.size}")
                # print(f"frame shape: {frame.shape}")
                # print(f"frame type: {frame.dtype}")
                # print(f"frame-: {type(frame)}")

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)[1]
                binary = cv2.dilate(binary, None, iterations=5)

                contours = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                contours = contours[0] if len(contours) == 2 else contours[1]

                for c in contours:
                    x, y, w, h = cv2.boundingRect(c)
                    cv2.rectangle(fcopy, (x, y), (x + w, y + h), (36, 255, 12), 2)

                # downscale image and then to base64
                frame = cv2.imencode('.jpg', frame)[1].tostring()
                frame = base64.b64encode(frame)
                frame = frame.decode('utf-8')

                gray = cv2.imencode('.jpg', gray)[1].tostring()
                gray = base64.b64encode(gray)
                gray = gray.decode('utf-8')

                binary = cv2.imencode('.jpg', binary)[1].tostring()
                binary = base64.b64encode(binary)
                binary = binary.decode('utf-8')

                fcopy = cv2.imencode('.jpg', fcopy)[1].tostring()
                fcopy = base64.b64encode(fcopy)
                fcopy = fcopy.decode('utf-8')

                # cv2.imshow('frame', frame)

                # await websocket.send_json({"image": frame, "image1": frame, "image2": frame})
                # time.sleep(0.1)
                await websocket.send_json({"image": frame, "image1": gray, "image2": binary, "image3": fcopy})

            cap.release()
            cv2.destroyAllWindows()

        except WebSocketDisconnect:
            await websocket.close()

            cap.release()
            cv2.destroyAllWindows()
