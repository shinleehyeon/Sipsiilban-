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
from app.user.entities import User
from utils.env_validator import settings


router = APIRouter(prefix="/user", tags=["User"])


@cbv(router)
class UserEndpoint:
    @router.get("/organization-logo")
    async def get_organization_logo(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ) -> RedirectResponse:
        try:
            await user.fetch_related("organization")
            return RedirectResponse(url=user.organization.logo_url)
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve organization logo"
            )

    @router.get("/info")
    async def get_user_info(
        self,
        _request: Request,
        user: User = Depends(get_current_user),
    ):
        try:
            return {
                "message": "User information retrieved successfully",
                "user": {
                    "id": user.id,
                    "name": user.name,
                },
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve user information"
            )
