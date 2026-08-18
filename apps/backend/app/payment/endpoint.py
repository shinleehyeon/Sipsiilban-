from datetime import datetime, timedelta

import traceback
from typing import Literal

from fastapi import APIRouter, HTTPException, Depends, Body, Request, Query
from fastapi.params import Param
from fastapi.responses import RedirectResponse
from fastapi_restful.cbv import cbv
from passlib.context import CryptContext

import aiohttp
import urllib.parse

from app.core.credential import Credential, depends_credential, get_current_user
from app.payment.entites import UserPaymentHistory, MerchantPaymentHistory
from app.payment.service import PaymentService
from app.user.entities import User
from utils.env_validator import settings
from tortoise.functions import Sum

from app.merchant.entities import Merchant


router = APIRouter(prefix="/pay", tags=["Payment"])


@cbv(router)
class PaymentEndpoint:
    service = PaymentService()

    @router.get(
        "/amount",
        summary="Get Payment Wallet Amount",
    )
    async def get_amount(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            await user.fetch_related("payment")
            if not user.payment:
                raise HTTPException(
                    status_code=404,
                    detail="Please register your account to recipient type",
                )
            return {
                "message": "Amount retrieved successfully",
                "amount": user.payment.amount,
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to retrieve amount")

    @router.post("/qrcode")
    async def create_qrcode(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            session = await self.service.create_payment_session(user.id)
            return {
                "message": "QR code created successfully",
                "key": session["key"],
                "session_id": session["session_id"],
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to create QR code")

    @router.get("/{session_id:str}/status")
    async def get_payment_status(
        self,
        _request: Request,
        session_id: str,
        _user: User = Depends(get_current_user),
    ):
        try:
            session = await self.service.get_payment_session(session_id)
            return {
                "message": "Payment status retrieved successfully",
                "session_id": session["session_id"],
                "status": session["data"]["status"],
                "transaction": session["data"]["transaction"],
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve payment status"
            )

    @router.post("/pos/request")
    async def request_pos_payment(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
        amount: int = Body(..., description="Amount to be paid"),
        session_id: str = Body(..., description="Session ID for the POS payment"),
        key: str = Body(..., description="Key for the POS payment"),
        merchant_id: str = Body(..., description="Merchant ID for the POS payment"),
    ):
        try:
            session = await self.service.request_payment(
                session_id=session_id,
                key=key,
                merchant_id=merchant_id,
                amount=amount,
            )
            await user.fetch_related("payment_history")
            transaction = await UserPaymentHistory.create(
                amount=amount,
                merchant_id=merchant_id,
                user_id=user.id,
            )
            await user.payment_history.add(transaction)
            await user.save()
            return {
                "message": "POS payment requested successfully",
                "session_id": session["session_id"],
                "status": session["data"]["status"],
                "transaction": session["data"]["transaction"],
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to request POS payment")

    @router.get("/pos/settlement-amount")
    async def settlement_pos_payment(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            now = datetime.now()
            qs = UserPaymentHistory.filter(
                user_id=user.id, timestamp__year=now.year, timestamp__month=now.month
            ).annotate(sum_amount=Sum("amount"))
            result = await qs.values("sum_amount")
            amount = (
                result[0]["sum_amount"]
                if result and result[0]["sum_amount"] is not None
                else 0
            )
            return {
                "message": "POS payment settlement successful",
                "amount": amount,
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to settle POS payment")

    @router.get("/pos/history")
    async def get_pos_payment_history(
        self,
        _request: Request,
        _user: User = Depends(get_current_user),
        merchant_id: str = Query(None, description="Merchant ID to filter history"),
    ):
        try:
            if not merchant_id:
                raise HTTPException(
                    status_code=400, detail="Merchant ID is required to filter history"
                )
            history = await UserPaymentHistory.filter(merchant_id=merchant_id).all()
            return {
                "message": "POS payment history retrieved successfully",
                "history": [
                    {
                        "id": transaction.id,
                        "amount": transaction.amount,
                        "timestamp": transaction.timestamp.format(),
                        "merchant": {
                            "id": transaction.merchant.id,
                            "name": transaction.merchant.name,
                        },
                    }
                    for transaction in history
                ],
            }

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve POS payment history"
            )

    @router.get("/pos/history/{history_id:int}")
    async def get_pos_payment_history_detail(
        self,
        history_id: int,
        _request: Request,
        _user: User = Depends(get_current_user),
    ):

        try:
            history = await MerchantPaymentHistory.get(id=history_id)
            if not history:
                raise HTTPException(
                    status_code=404, detail="POS payment history not found"
                )
            return {
                "message": "POS payment history detail retrieved successfully",
                "history": {
                    "id": history.id,
                    "amount": history.amount,
                    "timestamp": history.timestamp.format(),
                    "merchant": {
                        "id": history.merchant.id,
                        "name": history.merchant.name,
                    },
                    "user": {
                        "id": history.user.id,
                        "name": history.user.name,
                    },
                },
            }

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve POS payment history detail"
            )

    @router.get("/status")
    async def get_payment_status(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            if user.customer_type != "recipient":
                raise HTTPException(
                    status_code=404,
                    detail="Please register your account to recipient type",
                )
            await user.fetch_related("payment_history")
            if not user.payment_history:
                raise HTTPException(
                    status_code=404,
                    detail="Please register your account to recipient type",
                )
            now = datetime.now()
            this_month = now.month
            this_year = now.year

            # 이번 달 합계
            month_amount = (
                await UserPaymentHistory.filter(
                    user_id=user.id,
                    timestamp__year=this_year,
                    timestamp__month=this_month,
                )
                .annotate(sum_amount=Sum("amount"))
                .first()
            )

            # 지난 달 계산
            if this_month == 1:
                last_month = 12
                last_month_year = this_year - 1
            else:
                last_month = this_month - 1
                last_month_year = this_year

            last_month_amount = (
                await UserPaymentHistory.filter(
                    user_id=user.id,
                    timestamp__year=last_month_year,
                    timestamp__month=last_month,
                )
                .annotate(sum_amount=Sum("amount"))
                .first()
            )

            return {
                "message": "Payment status retrieved successfully",
                "status": {
                    "this_month": month_amount if month_amount else 0,
                    "last_month": last_month_amount if last_month_amount else 0,
                },
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve payment status"
            )

    @router.get("/history")
    async def get_payment_history(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            if user.customer_type != "recipient":
                raise HTTPException(
                    status_code=404,
                    detail="Please register your account to recipient type",
                )
            await user.fetch_related("payment_history")
            return {
                "message": "Payment history retrieved successfully",
                "history": [
                    {
                        "id": history.id,
                        "amount": history.amount,
                        "used_at": history.used_at.isoformat(),
                        "merchant": {
                            "id": history.merchant.id,
                            "name": history.merchant.name,
                        },
                    }
                    for history in user.payment_history
                ],
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve payment history"
            )
