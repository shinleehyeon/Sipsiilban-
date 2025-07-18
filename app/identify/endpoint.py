from datetime import datetime, timedelta

import traceback
from typing import Literal

from fastapi import APIRouter, HTTPException, Depends, Body, Request, Query
from fastapi.responses import RedirectResponse
from fastapi_restful.cbv import cbv
from passlib.context import CryptContext

import aiohttp
import urllib.parse

from app.core.credential import Credential, depends_credential, get_current_user
from app.user.entities import User
from utils.env_validator import settings
from .service import IdentifyService

from app.organization.entities import Organization
from app.payment.entites import PaymentWallet

router = APIRouter(prefix="/identify", tags=["Identify"])

service = IdentifyService()

@cbv(router)
class IdentifyEndpoint:
    @router.post("/recipient/join-organization", summary="Join Organization with Code")
    async def join_organization(
        self,
        request: Request,
        code: str = Body(..., description="Organization join code"),
        current_user: User = Depends(get_current_user),
    ):
        try:
            await current_user.fetch_related("organization")
            if current_user.organization:
                raise HTTPException(
                    status_code=400,
                    detail="User is already a member of an organization",
                )

            if not await Organization.exists(code=code):
                raise HTTPException(
                    status_code=404, detail="Organization with this code does not exist"
                )

            organization = await Organization.get(code=code)
            if not organization:
                raise HTTPException(
                    status_code=404, detail="Organization with this code does not exist"
                )

            current_user.organization = organization
            wallet = await PaymentWallet.create(amount=15000)
            current_user.wallet = wallet
            await current_user.save()

            return {
                "message": "Successfully joined organization",
                "organization": {
                    "id": organization.id,
                    "name": organization.name,
                    "location": organization.location,
                },
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to join organization")

    @router.get("/verify-organization")
    async def verify(self, business_id: str, verify_type: int):
        return service.verify(business_id, verify_type)
