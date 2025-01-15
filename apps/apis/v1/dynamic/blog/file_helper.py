import uuid

from fastapi import HTTPException, UploadFile, status

from apps.config.settings import BLOG


def get_blog_image_paths(
    files: list[UploadFile], allowed_types: list, max_size: int, path: str
) -> list[str]:
    for file in files:
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File must be one of the following types: {', '.join(allowed_types)}",
            )

        if file.file.__sizeof__() > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size should not exceed {max_size / (1024 * 1024)}MB",
            )

    try:
        file_paths = []
        for file in files:
            file.filename = f"{path}/{uuid.uuid4()}{file.filename}"
            with open(file.filename, "wb") as f:
                f.write(file.file.read())
            file_paths.append(file.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}",
        ) from e

    return file_paths


def save_blog_image_files(files: list[UploadFile]) -> list[str]:
    return get_blog_image_paths(
        files,
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        5 * 1024 * 1024,
        BLOG,
    )
