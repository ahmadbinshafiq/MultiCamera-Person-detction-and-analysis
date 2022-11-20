import databases
import sqlalchemy
from asyncpg import UndefinedColumnError

from . import models
import cfg


class Database:
    def __init__(self):
        self.db = databases.Database(cfg.connection_string)
        self.metadata = models.metadata
        self.users = models.users_table
        self.floors = models.floors_table
        self.cameras = models.cameras_table
        self.engine = sqlalchemy.create_engine(
            cfg.connection_string, pool_size=3, max_overflow=0
        )
        self.metadata.create_all(self.engine)

    async def connect(self):
        await self.db.connect()

    async def disconnect(self):
        await self.db.disconnect()

    async def fetch_all(self):
        query = self.users.select()
        return await self.db.fetch_all(query)

    async def fetch_all_cameras(self):
        query = self.cameras.select()
        return await self.db.fetch_all(query)

    async def add_user(self, user):
        query = self.users.insert().values(user)
        return await self.db.execute(query)


