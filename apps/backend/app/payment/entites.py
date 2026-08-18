from tortoise import Model, fields

from app.merchant.entities import Merchant
from app.organization.entities import Organization
from app.user.entities import User

__all__ = ["PaymentWallet", "UserPaymentHistory"]


class PaymentWallet(Model):
    id: str = fields.IntField(pk=True, generated=True)
    amount: int = fields.IntField(default=0)

    class Meta:
        table = "payment_wallets"


class UserPaymentHistory(Model):
    id: str = fields.UUIDField(pk=True)
    amount: int = fields.IntField()
    used_at = fields.DatetimeField(auto_now_add=True)
    merchant: Organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="payment_histories",
        on_delete=fields.CASCADE,
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="payment_history",
        on_delete=fields.CASCADE,
    )
    timestamp: str = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "user_payment_histories"


class MerchantPaymentHistory(Model):
    id: str = fields.UUIDField(pk=True)
    amount: int = fields.IntField()
    user: User = fields.ForeignKeyField(
        "models.User",
        related_name="merchant_payment_history",
        on_delete=fields.CASCADE,
    )
    merchant: Merchant = fields.ForeignKeyField(
        "models.Merchant",
        related_name="payment_history",
        on_delete=fields.CASCADE,
        null=True,
    )
    timestamp: str = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "merchant_payment_histories"
