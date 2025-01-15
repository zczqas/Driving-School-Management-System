from fastapi import FastAPI

from apps.apis.v1.health.health_routes import router as health_router
from routers import routers


class InitializeRouter:
    def __init__(self, app: FastAPI):
        self.app = app

    def initialize_routes(self):
        self.app.include_router(router=health_router, prefix="/api", tags=["health"])

        for prefix, router in routers.items():
            self.app.include_router(router=router, prefix="/api/v1", tags=[prefix])
