from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from datetime import datetime
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(100), primary_key=True, index=True)  # slug id like 'trucker-tobacco-brown'
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)  # 'Trucker', 'Bomber', 'Puffer', etc.
    collection_type = Column(String(100), nullable=False, index=True)  # 'Suede', 'Featured Samples'
    base_price_inr = Column(Float, nullable=False)  # Base price in INR
    url_slug = Column(String(255), nullable=False)
    color_hex = Column(String(20), nullable=True)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    fabric = Column(String(255), nullable=True)
    hardware = Column(String(255), nullable=True)
    lining = Column(String(255), nullable=True)
    weight = Column(String(100), nullable=True)
    image_front = Column(String(255), nullable=True)
    image_back = Column(String(255), nullable=True)
    image_side = Column(String(255), nullable=True)
    in_stock = Column(Boolean, default=True)
    stock_count = Column(Integer, default=15)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
