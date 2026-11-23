from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import random
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate


def generate_order_id() -> str:
    """Generates a luxury Suedo atelier order ID like 'SUE-9284'"""
    num = random.randint(1000, 9999)
    return f"SUE-{num}"


def generate_dhl_tracking() -> str:
    """Generates a DHL Express format tracking code"""
    code = "".join(str(random.randint(0, 9)) for _ in range(10))
    return f"DHL-EXP-{code}"


def create_order(db: Session, user_id: int, order_in: OrderCreate) -> Order:
    order_id = generate_order_id()
    tracking = generate_dhl_tracking()

    db_order = Order(
        id=order_id,
        user_id=user_id,
        total_amount=order_in.total_amount,
        currency=order_in.currency,
        status="In Atelier Tailoring" if (order_in.payment_status == "Paid" or not order_in.payment_gateway) else "Payment Pending",
        payment_gateway=order_in.payment_gateway,
        payment_id=order_in.payment_id,
        payment_status=order_in.payment_status or "Pending",
        tracking_number=tracking,
        shipping_address=order_in.shipping_address
    )
    db.add(db_order)
    db.flush()

    for item in order_in.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            size=item.size,
            color=item.color,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)
    return db_order


def get_user_orders(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()


def get_order_by_id(db: Session, order_id: str) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()
