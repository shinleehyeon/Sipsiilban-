import jwt

from passlib.context import CryptContext
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.redis import redis_client
from app.user.entities import User
from app.merchant.entities import Merchant

from utils.env_validator import settings
from os import urandom
from enum import Enum

security = HTTPBearer(
    scheme_name="access_token",
    description="/auth에서 발급받은 토큰을 입력해주세요",
)


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class PaymentService:
    def __init__(self):
        self.redis_connection = redis_client.connection

    async def create_payment_session(self, user_id: str) -> dict:
        session_id = urandom(16).hex()
        key = urandom(40).hex()

        await self.redis_connection.hset(
            "payment",
            session_id,
            {
                "user_id": user_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "key": key,
                "status": PaymentStatus.PENDING,
                "transaction": {},
            },
        )

        await self.redis_connection.expire(
            "payment", session_id, settings.PAYMENT_SESSION_EXPIRY
        )
        return {
            "session_id": session_id,
            "key": key,
            "message": "Payment session created successfully",
        }

    async def get_payment_session(self, session_id: str) -> dict:
        session_data = await self.redis_connection.hget("payment", session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Payment session not found")

        return {
            "session_id": session_id,
            "data": session_data,
            "message": "Payment session retrieved successfully",
        }

    async def request_payment(
        self, session_id: str, key: str, merchant_id: str, amount: float
    ) -> dict:
        session_data = await self.redis_connection.hget("payment", session_id)
        if not session_data:
            raise HTTPException(
                status_code=404, detail="Payment session expired or not found"
            )

        if session_data["key"] != key:
            raise HTTPException(status_code=403, detail="Invalid session key")

        if session_data["status"] != PaymentStatus.PENDING:
            raise HTTPException(
                status_code=400, detail="Payment session completed or failed"
            )

        if not await Merchant.exists(id=merchant_id):
            raise HTTPException(status_code=404, detail="Merchant not found")

        merchant = await Merchant.get(id=merchant_id)

        # Simulate payment processing
        session_data["status"] = PaymentStatus.COMPLETED
        session_data["transaction"] = {
            "amount": amount,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": PaymentStatus.COMPLETED,
            "merchant_id": merchant_id,
            "merchant_name": merchant.name if merchant else "Unknown Merchant",
        }
        await self.redis_connection.hset("payment", session_id, session_data)

        return {
            "session_id": session_id,
            "status": PaymentStatus.COMPLETED,
            "transaction": session_data["transaction"],
            "message": "Payment request completed successfully",
        }
