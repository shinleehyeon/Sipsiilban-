import jwt, math

from passlib.context import CryptContext
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.redis import redis_client
from app.user.entities import User

from utils.env_validator import settings
from .entities import Donation


class DonationCredential:
    def get_all_organizations(self):
        # 대충 단체 다 구하는 함수
        ...

    def get_donation_place_by_id(self):
        # 대충 단체 아이디로 구하는 함수
        ...
