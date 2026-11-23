from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "SUE-8902"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="In Atelier Tailoring")
    payment_gateway = Column(String(50), nullable=True)  # 'razorpay' | 'stripe' | 'courtesy'
    payment_id = Column(String(100), nullable=True)  # Razorpay Payment ID or Stripe PaymentIntent ID
    payment_status = Column(String(50), default="Pending")  # 'Pending' | 'Paid' | 'Failed'
    tracking_number = Column(String(100), nullable=True)
    shipping_address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(100), ForeignKey("products.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    size = Column(String(10), nullable=False)
    color = Column(String(50), nullable=True)
    quantity = Column(Integer, default=1)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
