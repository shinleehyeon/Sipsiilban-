from datetime import datetime, timedelta

import traceback
from typing import Literal, List

from fastapi import APIRouter, HTTPException, Depends, Body, Request, Query
from fastapi.responses import RedirectResponse
from fastapi_restful.cbv import cbv
from passlib.context import CryptContext

import aiohttp
import urllib.parse

from app.core.credential import Credential, depends_credential, get_current_user
from utils.env_validator import settings

from app.user.entities import User
from .service import DonationCredential

router = APIRouter(prefix="/donation", tags=["Donation"])

service = DonationCredential()


@cbv(router)
class DonationEndpoint:
    @router.post("/send")
    async def send_donation(
        self,
        id: str = Query(description="후원 단체 이름"),
        amount: int = Query(..., description="Donation amount"),
    ):
        donation_place = service.get_donation_place_by_id(id)
        donation_place.amount += amount

        return {"message": f"충전 완료!", "code": 200, "amount": amount}

    @router.get("/get", summary="Get All Donation Place")
    async def get_donation_place(self):
        try:
            donation_places = service.get_donation_place()
            if not donation_places:
                raise HTTPException(status_code=404, detail="No donation place found")
            return {
                "message": "Donation place retrieved successfully",
                "donation_place": donation_places,
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to retrieve location")
