from tortoise import fields
from tortoise.models import Model

__all__ = ["Merchant"]


class Merchant(Model):
    id: str = fields.UUIDField(pk=True)
    name: str = fields.CharField(max_length=100, unique=True)
    description: str = fields.TextField(null=True)
    phone: str = fields.CharField(max_length=100, unique=True)
    latitude: str = fields.CharField(
        max_length=20, description="Latitude of the merchant's location"
    )
    longitude: str = fields.CharField(
        max_length=20, description="Longitude of the merchant's location"
    )
    logo_url: str = fields.CharField(
        max_length=255, null=True, description="URL of the merchant's logo"
    )
    payment_history: fields.ManyToManyRelation["MerchantPaymentHistory"]

    class Meta:
        table = "merchants"