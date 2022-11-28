# import os
# import uuid
#
# import asyncpg
# from fastapi import APIRouter, status, HTTPException, Depends, Response, UploadFile, File
#
# from sqlalchemy.future import select
# from sqlalchemy import insert
#
# from database.db import Database
#
# db = Database()
#
# router = APIRouter(
#     prefix="/video",
#     tags=["Video"],
#     responses={404: {"description": "Not found"}},
# )
#
#
# @router.get('/all', tags=["Get all cameras"])
# async def get_all_cameras_videos(response: Response):
#     await db.connect()
#     query = select(db.videos)
#     result = await db.db.fetch_all(query)
#     if result is None:
#         raise HTTPException(status_code=404, detail="No videos found")
#     await db.disconnect()
#     response.status_code = status.HTTP_200_OK
#     return result
#
#
# @router.post('/add', tags=["Add video"])
# async def add_video(video: UploadFile = File(), cam_id: int = 1):
#     if not video:
#         raise HTTPException(status_code=404, detail="No file found")
#
#     await db.connect()
#     # check if camera exists
#     query = select(db.cameras).where(db.cameras.c.id == cam_id)
#     result = await db.db.fetch_one(query)
#     if result is None:
#         raise HTTPException(status_code=404, detail="Camera not found")
#
#     # save video to local storage
#     video_path = os.path.join("media", "videos", f"{uuid.uuid4()}.mp4")
#     with open(video_path, "wb") as buffer:
#         content = await video.read()
#         buffer.write(content)
#
#     # add video to db
#     query = insert(db.videos).values(
#         path=video_path,
#         camera_id=cam_id,
#     )
#     await db.db.execute(query)
#
#     await db.disconnect()
#     return {"message": "Video added successfully"}
#
#
# @router.get('/get/{video_id}', tags=["Get video"])
# async def get_video(video_id: int, response: Response):
#     await db.connect()
#     # check if video exists
#     query = select(db.videos).where(db.videos.c.id == video_id)
#     result = await db.db.fetch_one(query)
#     if result is None:
#         raise HTTPException(status_code=404, detail="Video not found")
#     print(f"Video path: {result['path']} -- video id: {result['id']}")
#     return result
