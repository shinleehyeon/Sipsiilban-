from datetime import datetime, timedelta

import traceback
from typing import Literal

from fastapi import APIRouter, HTTPException, Depends, Body, Request, Query
from fastapi.responses import RedirectResponse
from fastapi_restful.cbv import cbv
from passlib.context import CryptContext

import aiohttp
import urllib.parse
import math

from app.core.credential import Credential, depends_credential, get_current_user
from app.user.entities import User
from utils.env_validator import settings
from app.merchant.entities import Merchant


router = APIRouter(prefix="/merchant", tags=["Merchant"])

KAKAO_REST_API_KEY = "878ed35d34249e4b4286384011c38f68"


async def get_region_from_coords(latitude: str, longitude: str) -> str:
    url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    params = {"x": longitude, "y": latitude}
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, params=params) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=500, detail="Kakao API 호출 실패")
            data = await resp.json()
            documents = data.get("documents", [])
            if not documents:
                raise HTTPException(
                    status_code=404, detail="행정구역 정보를 찾을 수 없음"
                )
            region = documents[0]
            return f"{region['region_2depth_name']} {region['region_3depth_name']}"


# Haversine formula for distance in meters
def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
    R = 6371  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    return R * c * 1000  # meter


@cbv(router)
class MerchantEndpoint:

    @router.get("/get-my-location", summary="Get My Location")
    async def get_my_location(
        self,
        latitude: str = Query(..., description="Latitude of the location"),
        longitude: str = Query(..., description="Longitude of the location"),
        current_user: User = Depends(get_current_user),
    ):
        try:
            location = await get_region_from_coords(latitude, longitude)
            return {
                "message": "Location retrieved successfully",
                "location": location,
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to retrieve location")

    @router.get("/list", summary="Get Merchant Data")
    async def get_merchant(
        self,
        latitude: float = Query(..., description="Latitude of the location"),
        longitude: float = Query(..., description="Longitude of the location"),
        page: int = Query(1, ge=1, description="페이지 번호"),
        size: int = Query(10, ge=1, le=100, description="페이지 크기"),
        current_user: User = Depends(get_current_user),
    ):
        try:
            merchants = await Merchant.all()
            # Merchant 모델에 location이 [lat, lon] 배열로 저장되어 있다고 가정
            merchant_with_distance = []
            for m in merchants:
                # location이 배열이 아닐 경우, m.latitude, m.longitude 등으로 수정 필요
                lat, lon = m.location
                distance = haversine(latitude, longitude, lat, lon)
                merchant_with_distance.append({
                    "id": m.id,
                    "name": m.name,
                    "location": m.location,
                    "distance": distance,
                })
            merchant_with_distance.sort(key=lambda x: x["distance"])
            start = (page - 1) * size
            end = start + size
            paged = merchant_with_distance[start:end]
            return {
                "message": "Merchant data retrieved successfully",
                "total": len(merchant_with_distance),
                "page": page,
                "size": size,
                "merchants": paged,
            }
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(
                status_code=500, detail="Failed to retrieve merchant data"
            )
