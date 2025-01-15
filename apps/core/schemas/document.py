from typing import Optional

from pydantic import BaseModel

from apps.core.schemas.common import BaseCreatedByResponseSchema


class DocumentResponseSchema(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    document_url: Optional[str] = None
    created_by_id: Optional[int] = None
    created_by: Optional[BaseCreatedByResponseSchema] = None
