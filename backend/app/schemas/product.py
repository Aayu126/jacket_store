from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    id: str
    name: str
    category: str
    collection_type: str
    base_price_inr: float
    url_slug: str
    color_hex: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    hardware: Optional[str] = None
    lining: Optional[str] = None
    weight: Optional[str] = None
    image_front: Optional[str] = None
    image_back: Optional[str] = None
    image_side: Optional[str] = None
    in_stock: bool = True
    stock_count: int = 15
    is_featured: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    base_price_inr: Optional[float] = None
    in_stock: Optional[bool] = None
    stock_count: Optional[int] = None
    is_featured: Optional[bool] = None


class ProductOut(ProductBase):
    created_at: datetime

    class Config:
        from_attributes = True
