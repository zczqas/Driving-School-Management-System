from pathlib import Path
from typing import List, Optional

from fastapi import HTTPException
from fastapi.templating import Jinja2Templates
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader

from apps.config import settings
from apps.services.email_log import log_email

templates = Jinja2Templates(directory=Path(__file__).parent.parent / "templates")

# Configuration remains the same
conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_HOST_USER,
    MAIL_PASSWORD=settings.EMAIL_HOST_PASSWORD,
    MAIL_FROM=settings.EMAIL_HOST_USER,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    TEMPLATE_FOLDER=Path(__file__).parent.parent / "templates",
)

env = Environment(
    loader=FileSystemLoader(Path(__file__).parent.parent / "templates"), autoescape=True
)


async def render_template(template_name: str | None, body: dict) -> str:
    if template_name is None:
        return ""
    template = env.get_template(template_name)
    return template.render(**body)


async def send_email(
    subject: str,
    receiver: List[str],
    body: dict,
    user_profiles_id: Optional[int] = None,
    template_name: Optional[str] = None,
    db=None,
) -> Optional[dict]:
    try:
        content = await render_template(template_name, body)

        message = MessageSchema(
            subject=subject, recipients=receiver, body=content, subtype="html"  # type: ignore
        )

        fm = FastMail(conf)
        await fm.send_message(message)

        if user_profiles_id is not None:
            await log_email(
                name=subject,
                user_profiles_id=user_profiles_id,
                html_file_name=template_name if template_name else "",
                content=content,
                db=db,  # type: ignore
            )

        return {"message": "Email sent successfully"}
    except HTTPException as e:
        print("HTTPException:::", str(e))
    except Exception as e:
        print("Exception:::", str(e))


async def send_email_with_attachment(
    subject: str,
    receiver: List[str],
    body: dict,
    user_profiles_id: Optional[int] = None,
    template_name: Optional[str] = None,
    attachment: Optional[str] = None,
    db=None,
) -> Optional[dict]:
    try:
        content = await render_template(template_name, body)

        message = MessageSchema(
            subject=subject,
            recipients=receiver,
            body=content,
            subtype="html",  # type: ignore
            attachments=[attachment] if attachment else None,  # type: ignore
        )

        fm = FastMail(conf)
        await fm.send_message(message)

        if user_profiles_id is not None:
            await log_email(
                name=subject,
                user_profiles_id=user_profiles_id,
                html_file_name=template_name if template_name else "",
                content=content,
                db=db,  # type: ignore
            )

        return {"message": "Email sent successfully"}
    except HTTPException as e:
        print("HTTPException:::", str(e))
    except Exception as e:
        print("Hello Exception:::", str(e))
