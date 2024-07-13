from Comment import Comment
from pydantic import BaseModel
from typing import List, Optional

class Moment(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    image: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    comments: Optional[List[Comment]] = None

