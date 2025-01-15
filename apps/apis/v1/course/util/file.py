import os
import uuid

import ffmpeg
from fastapi import HTTPException, UploadFile, status

from apps.config.settings import CHART_PATH, VIDEO_PATH


class CourseFileUtil:
    def check_and_get_video_path(self, video: UploadFile):
        if video.content_type not in ["video/mp4", "video/quicktime"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only mp4 and quicktime video files are allowed.",
            )
        video.file.seek(0, os.SEEK_END)
        file_size = video.file.tell()
        video.file.seek(0, os.SEEK_SET)

        if file_size > 100 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size should not exceed 100MB",
            )

        try:
            unique_id = uuid.uuid4()
            video_path = f"{VIDEO_PATH}/{unique_id}_{video.filename}"

            with open(video_path, "wb") as buffer:
                buffer.write(video.file.read())

            no_extension = video.filename.split(".")[0]  # type: ignore

            compressed_video_path = (
                # f"{VIDEO_PATH}/{unique_id}_compressed_{video.filename}"
                f"{VIDEO_PATH}/{unique_id}_compressed_{no_extension}.m3u8"
            )
            segment_filename = f"{VIDEO_PATH}/{unique_id}_segment_%03d.ts"

            ffmpeg.input(video_path).output(
                compressed_video_path,
                format="hls",
                start_number=0,
                hls_time=10,
                hls_list_size=0,
                hls_segment_filename=segment_filename,
                vcodec="libx264",
                video_bitrate="500k",
                vf="scale=-1:720",
            ).run()

            os.remove(video_path)  # Remove the original video file

            return compressed_video_path
            # return video_path
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving or compressing video: {str(e)}",
            ) from e

    def save_video_without_compression(self, video: UploadFile):
        if video.content_type not in ["video/mp4", "video/quicktime"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only mp4 and quicktime video files are allowed.",
            )
        video.file.seek(0, os.SEEK_END)
        file_size = video.file.tell()
        video.file.seek(0, os.SEEK_SET)

        if file_size > 100 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size should not exceed 100MB",
            )

        try:
            unique_id = uuid.uuid4()
            video_path = f"{VIDEO_PATH}/{unique_id}_{video.filename}"

            with open(video_path, "wb") as buffer:
                buffer.write(video.file.read())

            return video_path
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving video: {str(e)}",
            ) from e

    def check_and_get_image_path(self, image: UploadFile):
        if image.content_type not in [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
            "image/svg+xml",
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only jpeg and png image files are allowed.",
            )

        if image.size.__sizeof__() > 10 * 1024 * 1024:  # 10 MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size should not exceed 10MB",
            )

        try:
            image_path = f"{CHART_PATH}/{uuid.uuid4()}_{image.filename}"

            with open(image_path, "wb") as buffer:
                buffer.write(image.file.read())

            return image_path
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving or compressing image: {str(e)}",
            ) from e
