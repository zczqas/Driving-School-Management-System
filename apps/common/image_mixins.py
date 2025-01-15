import uuid

from fastapi import HTTPException, UploadFile, status


class ImageHelper:
    def save_file(
        self, file: UploadFile, allowed_types: list, max_size: int, path: str
    ) -> str:
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
            file.filename = f"{path}/{uuid.uuid4()}_{file.filename}"

            with open(file.filename, "wb") as f:
                f.write(file.file.read())
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving file: {str(e)}",
            ) from e

        return file.filename
