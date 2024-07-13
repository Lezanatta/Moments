from pydantic import BaseModel
from typing import Optional

class Comment(BaseModel):
    id: Optional[int] = None
    text: str
    username: str
    moment_id: int
