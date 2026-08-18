from typing import List
from tortoise import Model, fields

__all__ = ["Donation"]


class Donation(Model):
    id: str = fields.UUIDField(pk=True)
    name: str = fields.CharField(max_length=100)
    description: str = fields.TextField(null=True)
    total_amount: int = fields.IntField(default=0, description="Total amount donated")
    thumbnail_url: str = fields.CharField(
        max_length=255, null=True, description="URL of the donation thumbnail"
    )
    last_date: str = fields.CharField(
        max_length=200, null=True, description="Last date for donations"
    )

    class Meta:
        table = "donation"


class Message(Model):
    id: str = fields.UUIDField(pk=True)
    sender: str = fields.CharField(max_length=100, description="Sender's name")
    recipient: str = fields.CharField(max_length=100, description="Recipient's name")
    content: str = fields.TextField(description="Message content")
    timestamp: str = fields.CharField(
        max_length=200, description="Timestamp of the message"
    )

    class Meta:
        table = "messages"
