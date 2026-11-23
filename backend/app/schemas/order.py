from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    size: str
    color: Optional[str] = None
    quantity: int = 1
    price: float


class OrderItemOut(BaseModel):
    id: int
    product_id: str
    product_name: str
    size: str
    color: Optional[str] = None
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    total_amount: float
    currency: str = "INR"
    shipping_address: Optional[str] = None


class OrderOut(BaseModel):
    id: str
    user_id: int
    total_amount: float
    currency: str
    status: str
    tracking_number: Optional[str] = None
    shipping_address: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True
