from sqlalchemy import Table, MetaData, Column, Integer, String, ForeignKey, Boolean, DateTime, Float, Date, Time
from sqlalchemy.orm import relationship

metadata = MetaData()

users_table = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True),
    Column("password", String),
)

cameras_table = Table(
    "cameras",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("stream_mode", Integer, nullable=False),
    Column("name", String, unique=True, nullable=False),
    Column("ip", String, nullable=True, default=None),
    Column("port", String, nullable=True, default=None),
    Column("typeof", String, nullable=True, default=None),
    Column("protocol", String, nullable=True, default=None),
    Column("video_path", String, nullable=True, default=None),
    Column("gt_path", String, nullable=True, default=None),  # ground truth image for homography mapping
    Column("npy_path", String, nullable=True, default=None),  # npy_file for homography matrix
    Column("floor_id", Integer, ForeignKey("floors.id"))
)

floors_table = Table(
    "floors",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, unique=True, nullable=False),
)

analytics_table = Table(
    "analytics",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("camera_id", Integer, ForeignKey("cameras.id")),
    Column("date", Date, nullable=True),
    Column("time", Time, nullable=True),
    Column("males_count", Integer, nullable=True),
    Column("females_count", Integer, nullable=True),
    Column("unknown_count", Integer, nullable=True),
    Column("child_count", Integer, nullable=True),
    Column("teen_count", Integer, nullable=True),
    Column("adult_count", Integer, nullable=True),
    Column("elderly_count", Integer, nullable=True),
)

