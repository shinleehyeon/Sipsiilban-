from typing import List
from tortoise import Model, fields

__all__ = ["Organization"]


class Organization(Model):
    id: str = fields.UUIDField(pk=True)
    name: str = fields.CharField(max_length=100)
    description: str = fields.TextField(null=True)
    phone: str = fields.CharField(max_length=100, unique=True)
    location: List[str] = fields.JSONField(
        description="Location in the format [latitude, longitude]", default=[]
    )
    logo_url: str = fields.CharField(
        max_length=255, null=True, description="URL of the organization's logo"
    )
    join_code: str = fields.CharField(
        max_length=100,
        unique=True,
        description="Unique code for joining the organization",
    )

    class Meta:
        table = "organizations"
