from datetime import datetime

from fastapi import APIRouter, status, HTTPException, Depends, Response

from sqlalchemy.future import select
from sqlalchemy import insert

from database.db import Database
from routes.schemas import IntervalAnalytics

db = Database()

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    responses={404: {"description": "Not found"}},
)


@router.get('/all', tags=["Get all analytics"])
async def get_all_analytics(response: Response):
    await db.connect()
    query = select(db.analytics)
    result = await db.db.fetch_all(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No analytics found")
    await db.disconnect()
    response.status_code = status.HTTP_200_OK
    return result


@router.post('/interval_based_analytics', tags=["Get interval based analytics"])
async def get_interval_based_analytics(interval: IntervalAnalytics, response: Response):
    start_date = datetime.strptime(interval.date_start, '%Y-%m-%d')
    end_date = datetime.strptime(interval.date_end, '%Y-%m-%d')
    start_time = datetime.strptime(interval.time_start, '%H:%M:%S')
    end_time = datetime.strptime(interval.time_end, '%H:%M:%S')
    await db.connect()
    # get data bw start and end date, and start and end time
    # query = select(db.analytics).where(db.analytics.c.date.between(interval.date_start, interval.date_end))
    query = select(db.analytics).where(db.analytics.c.date.between(start_date, end_date) &
                                       db.analytics.c.time.between(start_time, end_time))
    result = await db.db.fetch_all(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No analytics found")
    await db.disconnect()

    # calculate the analytics
    analytics = {
        'total_people': 0,
        'males_count': 0,
        'females_count': 0,
        'unknown_count': 0,
        'child_count': 0,
        'teen_count': 0,
        'adult_count': 0,
        'elderly_count': 0,
    }
    for row in result:
        analytics['males_count'] += row.males_count
        analytics['females_count'] += row.females_count
        analytics['unknown_count'] += row.unknown_count
        analytics['child_count'] += row.child_count
        analytics['teen_count'] += row.teen_count
        analytics['adult_count'] += row.adult_count
        analytics['elderly_count'] += row.elderly_count

    analytics['total_people'] = analytics['males_count'] + analytics['females_count'] + analytics['unknown_count']
    response.status_code = status.HTTP_200_OK
    return analytics


@router.post('/interval_based_analytics_per_cam', tags=["Interval based analytics per camera"])
async def get_interval_based_analytics_per_cam(interval: IntervalAnalytics, response: Response):
    start_date = datetime.strptime(interval.date_start, '%Y-%m-%d')
    end_date = datetime.strptime(interval.date_end, '%Y-%m-%d')
    start_time = datetime.strptime(interval.time_start, '%H:%M:%S')
    end_time = datetime.strptime(interval.time_end, '%H:%M:%S')
    await db.connect()
    # get data bw start and end date, and start and end time
    # query = select(db.analytics).where(db.analytics.c.date.between(interval.date_start, interval.date_end))
    query = select(db.analytics).where(db.analytics.c.date.between(start_date, end_date) &
                                       db.analytics.c.time.between(start_time, end_time) &
                                       (db.analytics.c.camera_id == interval.camera_id))
    result = await db.db.fetch_all(query)
    if result is None:
        raise HTTPException(status_code=404, detail="No analytics found")
    await db.disconnect()

    # calculate the analytics
    analytics = {
        'total_people': 0,
        'males_count': 0,
        'females_count': 0,
        'unknown_count': 0,
        'child_count': 0,
        'teen_count': 0,
        'adult_count': 0,
        'elderly_count': 0,
    }
    for row in result:
        analytics['males_count'] += row.males_count
        analytics['females_count'] += row.females_count
        analytics['unknown_count'] += row.unknown_count
        analytics['child_count'] += row.child_count
        analytics['teen_count'] += row.teen_count
        analytics['adult_count'] += row.adult_count
        analytics['elderly_count'] += row.elderly_count

    analytics['total_people'] = analytics['males_count'] + analytics['females_count'] + analytics['unknown_count']
    response.status_code = status.HTTP_200_OK
    return analytics
