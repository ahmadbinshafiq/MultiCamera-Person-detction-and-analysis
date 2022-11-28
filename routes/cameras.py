import os
import uuid
from typing import Union, List

import asyncpg
from fastapi import APIRouter, status, HTTPException, Depends, Response, UploadFile, File, Form

from sqlalchemy.future import select
from sqlalchemy import insert

from database.db import Database
from routes.schemas import Camera

db = Database()

router = APIRouter(
    prefix="/camera",
    tags=["Camera"],
    responses={404: {"description": "Not found"}},
)


@router.get('/all', tags=["Get all cameras"])
async def get_all_cameras(response: Response):
    await db.connect()
    query = select(db.cameras)
    result = await db.db.fetch_all(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No cameras found")
    await db.disconnect()
    response.status_code = status.HTTP_200_OK
    return result


@router.post('/add/local', tags=["Add camera"])
async def add_local_camera(
        floor_id: int = Form(), stream_mode: int = Form(), name: str = Form(), video: UploadFile = File(),
        gt: UploadFile = File(), npy: UploadFile = File(), response: Response = Response()
):
    await db.connect()
    # check if floor exists
    query = select(db.floors).where(db.floors.c.id == floor_id)
    result = await db.db.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="Floor not found")

    # generate paths
    random_name = str(uuid.uuid4())
    video_path = os.path.join("media", "local_storage", "videos", f"{random_name}.mp4")
    gt_path = os.path.join("media", "local_storage", "gt", f"{random_name}.png")
    npy_path = os.path.join("media", "local_storage", "npy", f"{random_name}.npy")

    # save video
    with open(video_path, "wb") as buffer:
        content = await video.read()
        buffer.write(content)

    # save gt
    with open(gt_path, "wb") as buffer:
        content = await gt.read()
        buffer.write(content)

    # save npy
    with open(npy_path, "wb") as buffer:
        content = await npy.read()
        buffer.write(content)

    query = insert(db.cameras).values(
        name=name,
        floor_id=floor_id,
        stream_mode=stream_mode,
        video_path=video_path,
        gt_path=gt_path,
        npy_path=npy_path,
    )
    try:
        await db.db.execute(query)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=404, detail="Camera already exists")

    await db.disconnect()
    response.status_code = status.HTTP_200_OK
    return {"message": "Camera added successfully"}


@router.post('/add/remote', tags=["Add camera"])
async def add_remote_camera(
    camera: Camera, response: Response = Response()
):
    await db.connect()
    # check if floor exists
    query = select(db.floors).where(db.floors.c.id == camera.floor_id)
    result = await db.db.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="Floor not found")

    query = insert(db.cameras).values(
        name=camera.name,
        floor_id=camera.floor_id,
        stream_mode=camera.stream_mode,
        ip=camera.ip,
        port=camera.port,
        typeof=camera.typeof,
        protocol=camera.protocol,
    )
    try:
        await db.db.execute(query)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=404, detail="Camera already exists")
    except asyncpg.exceptions.DataError:
        raise HTTPException(status_code=404, detail="Invalid data")

    await db.disconnect()
    response.status_code = status.HTTP_200_OK
    return {"message": "Camera added successfully"}

