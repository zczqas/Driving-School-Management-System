import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from apps.config import settings
from urls import InitializeRouter

# TODO: Separate admin table and registration routes where only admin can register admins


def get_application():
    app = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
        version=settings.VERSION,
        description=settings.PROJECT_DESCRIPTION,
    )

    if not os.path.exists(settings.MEDIA_PATH):
        os.makedirs(settings.MEDIA_PATH)

    media_directory = Path(settings.MEDIA_PATH)
    app.mount("/media", StaticFiles(directory=media_directory), name="media")
    logo_directory = Path(settings.LOGO_PATH)
    app.mount("/logo", StaticFiles(directory=logo_directory), name="logo")
    video_directory = Path(settings.VIDEO_PATH)
    app.mount("/video", StaticFiles(directory=video_directory), name="video")
    charts_directory = Path(settings.CHART_PATH)
    app.mount("/chart", StaticFiles(directory=charts_directory), name="chart")

    origins = [
        "http://localhost:3000",
        "https://localhost:3000",
        "http://127.0.0.1:3000",
        "http://45.32.68.193",
        "http://45.32.68.193:80",
        "http://sfds.usualmarts.com",
        "https://sfds.usualmarts.com",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = get_application()

InitializeRouter(app).initialize_routes()


@app.get("/")
async def home():
    return {"status": f"{settings.APP_ENV} is okay and running."}
