from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Profile & Measurements Schemas
class MeasurementsUpdate(BaseModel):
    chest: Optional[str] = None
    shoulders: Optional[str] = None
    sleeves: Optional[str] = None
    height: Optional[str] = None
    fit_preference: Optional[str] = None


class AddressUpdate(BaseModel):
    address_line: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class UserProfileOut(BaseModel):
    chest: str
    shoulders: str
    sleeves: str
    height: str
    fit_preference: str
    address_line: str
    city: str
    state: str
    postal_code: str
    country: str

    class Config:
        from_attributes = True


# User Registration & Login Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    size: Optional[str] = "L"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    preferred_size: str
    role: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None

    class Config:
        from_attributes = True
