from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    preferred_size = Column(String(10), default="L")
    role = Column(String(50), default="collector")  # "collector" or "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Bespoke measurements
    chest = Column(String(50), default='40"')
    shoulders = Column(String(50), default='18.5"')
    sleeves = Column(String(50), default='34"')
    height = Column(String(50), default="6'0\"")
    fit_preference = Column(String(50), default="Tailored Slim")

    # Shipping address
    address_line = Column(String(255), default="742 Evergreen Terrace, Suite 4B")
    city = Column(String(100), default="New York")
    state = Column(String(100), default="NY")
    postal_code = Column(String(50), default="10012")
    country = Column(String(100), default="United States")

    user = relationship("User", back_populates="profile")
