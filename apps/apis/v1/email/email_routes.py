from typing import Optional

from fastapi import APIRouter, HTTPException, status

from apps.apis.v1.email.email_template_service import EmailTemplateService
from apps.config.settings import DEFAULT_TEMPLATE_DIR, TEMPLATE_DIR
from apps.core.schemas.email import UpdateTemplateSchema

router = APIRouter(prefix="/email-templates", tags=["email templates"])


email_template_service = EmailTemplateService(
    template_dir=TEMPLATE_DIR, default_template_dir=DEFAULT_TEMPLATE_DIR
)


@router.get("/list")
async def list_email_templates_name():
    templates = email_template_service.list_templates()
    return {"templates": templates}


@router.get("/get/{template_name}")
async def get_email_templates(
    template_name: Optional[str] = None,
):
    if not template_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template name is required",
        )

    template = email_template_service.get_template(template_name)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    return {"content": template}


@router.get("/get/modifiable/{template_name}")
async def get_modifiable_email_templates_elements(
    template_name: Optional[str] = None,
):
    if not template_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template name is required",
        )

    template = email_template_service.get_modifiable_elements(template_name)
    print("hello", template)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    return {"elements": template}


@router.put("/update/{template_name}")
async def update_email_templates(
    template: UpdateTemplateSchema,
    template_name: Optional[str] = None,
):
    if not template_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template name is required",
        )

    if not template.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template content is required",
        )

    if not email_template_service.update_template(template_name, template):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong",
        )

    return {"message": "Template updated successfully"}


@router.put("/reset/{template_name}")
async def reset_email_templates(template_name: Optional[str] = None):
    if not template_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template name is required",
        )

    if not email_template_service.reset_template(template_name):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong",
        )

    return {"message": "Template reset successfully"}
