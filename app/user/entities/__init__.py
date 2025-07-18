from tortoise import Model, fields

__all__ = ["User"]


class User(Model):
    id: str = fields.UUIDField(pk=True)
    name: str = fields.CharField(max_length=100)
    email: str = fields.CharField(max_length=100, unique=True)
    customer_type: str = fields.CharField(
        max_length=50, default="sponsor"
    )  # e.g., "sponsor", "recipient", "merchant"

    class Meta:
        table = "users"
