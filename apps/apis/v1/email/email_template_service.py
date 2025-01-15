import os
from typing import Optional

from fastapi import HTTPException, status

from apps.core.schemas.email import UpdateTemplateSchema


class EmailTemplateService:
    def __init__(self, template_dir: str, default_template_dir: str):
        self.template_dir = template_dir
        self.default_template_dir = default_template_dir

    def list_templates(self) -> list[str]:
        try:
            templates = [
                f
                for f in os.listdir(self.template_dir)
                if os.path.isfile(os.path.join(self.template_dir, f))
            ]
            return templates
        except FileNotFoundError:
            return []

    def get_template(self, template_name: str) -> Optional[str]:
        try:
            with open(os.path.join(self.template_dir, template_name), "r") as file:
                return file.read()
        except FileNotFoundError:
            return None

    def get_modifiable_elements(self, template_name: str) -> Optional[dict]:
        template = self.get_template(template_name)
        if template is None:
            return None

        elements = {}
        lines = template.splitlines()
        for line in lines:
            start = line.find("{{")
            end = line.find("}}", start + 2)
            while start != -1 and end != -1:
                element = line[start + 2 : end].strip()
                elements[element] = None
                start = line.find("{{", end + 2)
                end = line.find("}}", start + 2)

        return elements

    def update_template(
        self, template_name: str, template: UpdateTemplateSchema
    ) -> bool:
        if not template.content:
            return False

        template_path = os.path.join(self.template_dir, template_name)
        if not os.path.isfile(template_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found",
            )

        try:
            with open(template_path, "w") as file:
                file.write(template.content)
            return True
        except FileNotFoundError:
            return False

    def reset_template(self, template_name: str) -> bool:
        default_template = self.get_default_template(template_name)
        if default_template is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Default template not found",
            )

        try:
            template_path = os.path.join(self.template_dir, template_name)
            with open(template_path, "w") as file:
                file.write(default_template)
            return True
        except FileNotFoundError:
            return False

    def get_default_template(self, template_name: str) -> Optional[str]:
        try:
            default_template_path = os.path.join(
                self.default_template_dir, template_name
            )
            with open(default_template_path, "r") as file:
                return file.read()
        except FileNotFoundError:
            return None
