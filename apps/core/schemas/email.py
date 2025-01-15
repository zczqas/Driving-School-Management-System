from typing import Optional

from pydantic import BaseModel


class UpdateTemplateSchema(BaseModel):
    content: Optional[str] = None
