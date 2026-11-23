from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.order import OrderCreate, OrderOut
from app.crud.crud_order import create_order, get_user_orders, get_order_by_id
from app.utils.security import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/api/orders", tags=["Orders & Commissions"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit a bespoke outerwear commission/order for the authenticated user."""
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one jacket item.")
    return create_order(db, user_id=current_user.id, order_in=order_in)


@router.get("/my-orders", response_model=List[OrderOut])
def list_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all orders and commissions with live status for the authenticated user."""
    return get_user_orders(db, user_id=current_user.id)


@router.get("/{order_id}", response_model=OrderOut)
def get_order_details(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Fetch order details and courier tracking information."""
    order = get_order_by_id(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Verify owner or admin
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized access to this order.")
    return order
