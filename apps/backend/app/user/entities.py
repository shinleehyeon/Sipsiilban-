from tortoise import Model, fields

__all__ = ["User"]


class User(Model):
    id: str = fields.UUIDField(pk=True)
    name: str = fields.CharField(max_length=100)
    email: str = fields.CharField(max_length=100, unique=True)
    customer_type: str = fields.CharField(
        max_length=50, default="sponsor"
    )  # e.g., "sponsor", "recipient", "merchant"
    payment = fields.OneToOneField(
        "models.PaymentWallet",
        related_name="user",
        null=True,
        on_delete=fields.SET_NULL,
    )
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="users",
        null=True,
        on_delete=fields.SET_NULL,
        description="소속 조직",
    )
    verified: bool = fields.BooleanField(default=False, description="사용자 인증 여부")
    payment_history: fields.ManyToManyRelation["UserPaymentHistory"]

    class Meta:
        table = "users"
