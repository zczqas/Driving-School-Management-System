from fastapi import UploadFile

from apps.common.image_mixins import ImageHelper
from apps.config.settings import HERO_PATH, LOGO_PATH


def save_hero_file(hero: UploadFile) -> str:
    return ImageHelper().save_file(
        hero,
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        5 * 1024 * 1024,
        HERO_PATH,
    )


def save_logo_file(logo: UploadFile) -> str:
    return ImageHelper().save_file(
        logo,
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        5 * 1024 * 1024,
        LOGO_PATH,
    )
