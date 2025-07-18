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
from .service import OrganizationCredential

router = APIRouter(prefix="/organization", tags=["Organization"])

service = OrganizationCredential()


@cbv(router)
class OrganizationEndpoint:
    @router.get("/list")
    async def get(
        self,
        location: List[str] = Query(None, description="Location query parameter"),
        max_distance: int = Query(1000, description="Maximum distance in meters"),
    ):
        organizations = service.get_all_organizations()
        result = []
        for org in organizations:
            distance = service.get_distance(location[0], location[1], org)
            if distance <= max_distance:
                result.append(
                    {
                        "id": org.id,
                        "name": org.name,
                        "location": org.location,
                        "distance": distance,
                    }
                )
        return result
