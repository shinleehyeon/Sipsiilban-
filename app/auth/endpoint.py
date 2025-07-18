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
from utils.env_validator import settings

from app.user.entities import User


GOOGLE_SCOPES = ["openid", "email", "profile"]
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def build_google_authorization_url(platform: str):
    platform_map = {
        "web": (settings.GOOGLE_WEB_CLIENT_ID, settings.GOOGLE_WEB_REDIRECT_URI),
        "android": (settings.GOOGLE_ANDROID_CLIENT_ID, ""),
        "ios": (settings.GOOGLE_IOS_CLIENT_ID, ""),
    }
    result = platform_map.get(platform)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid platform")
    client_id, redirect_uri = result
    params = {
        "client_id": client_id,
        "response_type": "code",
        "scope": " ".join(GOOGLE_SCOPES),
        "access_type": "online",
        "include_granted_scopes": "true",
        "prompt": "select_account",
    }
    if platform == "web":
        params["redirect_uri"] = redirect_uri
    return f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"


router = APIRouter(prefix="/auth", tags=["Authentication"])


@cbv(router)
class AuthEndpoint:
    password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    credential: Credential = Depends(depends_credential)

    @router.get("/authorization_url")
    async def get_authorization_url(self, platform: Literal["web", "android", "ios"]):
        return RedirectResponse(url=build_google_authorization_url(platform))

    @router.post(
        "/login/web",
        summary="Google OAuth2.0 웹 로그인",
        description="Google OAuth2.0 인증을 통해 사용자를 인증합니다.\n회원가입이 되어 있지 않으면 자동으로 회원가입 후, 로그인합니다.",
    )
    async def login_web(
        self,
        code: str = Body(
            title="Google Oauth Callback Code",
            description="Google OAuth2.0 Callback에서 받은 code 값",
        ),
        customer_type: Literal["sponsor", "recipient", "merchant"] = Body(
            title="customer_type",
            description="사용자 유형을 지정합니다. 'sponsor', 'recipient', 'merchant' 중 하나를 선택하세요.",
        ),
    ):
        try:
            client_id, redirect_uri = (
                settings.GOOGLE_WEB_CLIENT_ID,
                settings.GOOGLE_WEB_REDIRECT_URI,
            )
            client_secret = settings.GOOGLE_WEB_CLIENT_SECRET
            async with aiohttp.ClientSession() as session:
                data = {
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                }
                async with session.post(GOOGLE_TOKEN_URL, data=data) as resp:
                    if resp.status != 200:
                        raise HTTPException(status_code=400, detail="Invalid Code")
                    token_json = await resp.json()
                    access_token = token_json.get("access_token")
                    if not access_token:
                        raise HTTPException(
                            status_code=400, detail="No access token from Google"
                        )
                headers = {"Authorization": f"Bearer {access_token}"}
                async with session.get(GOOGLE_USERINFO_URL, headers=headers) as resp:
                    if resp.status != 200:
                        raise HTTPException(
                            status_code=400, detail="Failed to get userinfo"
                        )
                    userinfo = await resp.json()
        except Exception as e:
            traceback.print_exception(e)
            raise HTTPException(status_code=500, detail="Google OAuth Error: " + str(e))

        user = await User.get_or_none(email=userinfo["email"])
        if not user:
            user = await User.create(
                name=userinfo.get("name", ""),
                email=userinfo["email"],
                customer_type=customer_type,
                verified=True if customer_type == "sponsor" else False,
            )
        access_token_expires = timedelta(days=10)
        access_token = self.credential.create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        try:
            await self.credential.register_token(
                expire=access_token_expires,
                token=access_token,
                user_id=str(user.id),
            )
            token_expired_time = datetime.now() + access_token_expires
            return {
                "message": "Login Success",
                "token": access_token,
                "expired": int(token_expired_time.timestamp()),
            }
        except Exception as e:
            traceback.print_exception(e)
            raise HTTPException(
                status_code=500, detail="Internal Server Error, " + str(e)
            )

    @router.post(
        "/login/mobile",
        summary="Google OAuth2.0 모바일 로그인",
        description="Google OAuth2.0 인증을 통해 사용자를 인증합니다.\n회원가입이 되어 있지 않으면 자동으로 회원가입 후, 로그인합니다.",
    )
    async def login_mobile(
        self,
        code: str = Body(
            title="Google Oauth Callback Code",
            description="Google OAuth2.0 Callback에서 받은 code 값",
        ),
        platform: Literal["android", "ios"] = Body(
            title="platform",
            description="로그인 요청 플랫폼(android, ios)",
        ),
        customer_type: Literal["sponsor", "recipient", "merchant"] = Body(
            title="customer_type",
            description="사용자 유형을 지정합니다. 'sponsor', 'recipient', 'merchant' 중 하나를 선택하세요.",
        ),
    ):
        try:
            if platform == "android":
                client_id = settings.GOOGLE_ANDROID_CLIENT_ID
                redirect_uri = settings.GOOGLE_ANDROID_REDIRECT_URI
                client_secret = settings.GOOGLE_ANDROID_CLIENT_SECRET
            elif platform == "ios":
                client_id = settings.GOOGLE_IOS_CLIENT_ID
                redirect_uri = settings.GOOGLE_IOS_REDIRECT_URI
                client_secret = settings.GOOGLE_IOS_CLIENT_SECRET
            else:
                raise HTTPException(status_code=400, detail="Invalid platform")
            async with aiohttp.ClientSession() as session:
                data = {
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                }
                async with session.post(GOOGLE_TOKEN_URL, data=data) as resp:
                    if resp.status != 200:
                        raise HTTPException(status_code=400, detail="Invalid Code")
                    token_json = await resp.json()
                    access_token = token_json.get("access_token")
                    if not access_token:
                        raise HTTPException(
                            status_code=400, detail="No access token from Google"
                        )
                headers = {"Authorization": f"Bearer {access_token}"}
                async with session.get(GOOGLE_USERINFO_URL, headers=headers) as resp:
                    if resp.status != 200:
                        raise HTTPException(
                            status_code=400, detail="Failed to get userinfo"
                        )
                    userinfo = await resp.json()
        except Exception as e:
            traceback.print_exception(e)
            raise HTTPException(status_code=500, detail="Google OAuth Error: " + str(e))

        user = await User.get_or_none(email=userinfo["email"])
        if not user:
            user = await User.create(
                name=userinfo.get("name", ""),
                email=userinfo["email"],
                customer_type=customer_type,
            )
        access_token_expires = timedelta(days=10)
        access_token = self.credential.create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        try:
            await self.credential.register_token(
                expire=access_token_expires,
                token=access_token,
                user_id=str(user.id),
            )
            token_expired_time = datetime.now() + access_token_expires
            return {
                "message": "Login Success",
                "token": access_token,
                "expired": int(token_expired_time.timestamp()),
            }
        except Exception as e:
            traceback.print_exception(e)
            raise HTTPException(
                status_code=500, detail="Internal Server Error, " + str(e)
            )

    @router.post("/logout", description="로그아웃하기 (토큰 만료시키기)")
    async def logout(
        self,
        request: Request,
        _current_user: "User" = Depends(get_current_user),
    ):
        token = request.headers["Authorization"].split(" ")[1]
        await self.credential.delete_token(token=token)
        return {
            "message": "Logout Success",
            "data": None,
        }

    @router.get("/profile", description="프로필 조회")
    async def get_profile(
        self,
        current_user: "User" = Depends(get_current_user),
    ):
        return {
            "message": "Profile found",
            "data": {
                "name": current_user.name,
                "email": current_user.email,
                "customer_type": current_user.customer_type,
            },
        }

    @router.get("/callback", description="Google OAuth2.0 Callback (TEST ONLY)")
    async def google_callback(
        self,
        request: Request,
        code: str = Query(..., title="Google Oauth Callback Code"),
    ):
        return {
            "message": "Google OAuth Callback",
            "code": code,
            "data": {
                "redirect_url": request.url_for("AuthEndpoint.login_web"),
            },
        }
