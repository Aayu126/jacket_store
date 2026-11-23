import uuid
import hmac
import hashlib
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.order import Order

router = APIRouter(prefix="/api/payments", tags=["Payment Integration (Razorpay + Stripe)"])


class RazorpayOrderCreate(BaseModel):
    amount: float  # Amount in INR (e.g. 84500)
    currency: str = "INR"
    receipt: Optional[str] = None


class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: Optional[str] = None


class StripeIntentCreate(BaseModel):
    amount: float  # Amount in major currency units (e.g. 1100.00 USD)
    currency: str = "usd"
    order_id: Optional[str] = None


class StripeVerifyRequest(BaseModel):
    payment_intent_id: str
    order_id: Optional[str] = None


@router.get("/config")
def get_payment_config():
    """
    Public configuration endpoint for frontend.
    Returns which payment gateways are active and their public client keys.
    """
    return {
        "gateways": {
            "razorpay": {
                "active": True,
                "key_id": settings.RAZORPAY_KEY_ID if settings.RAZORPAY_KEY_ID else "rzp_test_demo_atelier",
                "is_configured": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
                "supported_currency": "INR"
            },
            "stripe": {
                "active": True,
                "publishable_key": settings.STRIPE_PUBLISHABLE_KEY if settings.STRIPE_PUBLISHABLE_KEY else "pk_test_demo_atelier",
                "is_configured": bool(settings.STRIPE_SECRET_KEY),
                "supported_currencies": ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "AED", "SGD"]
            }
        }
    }


# ============================================================================
# RAZORPAY ENDPOINTS (Optimized for India: UPI / QR / RuPay / NetBanking)
# ============================================================================

@router.post("/razorpay/create-order")
def create_razorpay_order(payload: RazorpayOrderCreate):
    """
    Creates a Razorpay Order ID for initiating the UPI/Card modal checkout.
    If live keys are omitted in .env, seamlessly returns an Atelier simulation order.
    """
    amount_in_paise = int(round(payload.amount * 100))
    receipt_id = payload.receipt or f"rcpt_{uuid.uuid4().hex[:10]}"

    if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
        try:
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            data = {
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": receipt_id,
                "payment_capture": 1
            }
            order = client.order.create(data=data)
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": settings.RAZORPAY_KEY_ID,
                "mock": False
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Razorpay order initiation failed: {str(e)}")

    # Sandbox / Demo mode
    mock_order_id = f"order_{uuid.uuid4().hex[:14]}"
    return {
        "order_id": mock_order_id,
        "amount": amount_in_paise,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID or "rzp_test_demo_atelier",
        "mock": True
    }


@router.post("/razorpay/verify")
def verify_razorpay_payment(payload: RazorpayVerifyRequest, db: Session = Depends(get_db)):
    """
    Validates Razorpay payment signature and updates the order status in database.
    """
    # If live keys are present, verify HMAC-SHA256 signature
    if settings.RAZORPAY_KEY_SECRET:
        msg = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8")
        expected_sig = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
            msg,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, payload.razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid Razorpay payment signature.")

    # Update order in database if order_id is provided
    if payload.order_id:
        db_order = db.query(Order).filter(Order.id == payload.order_id).first()
        if db_order:
            db_order.payment_gateway = "razorpay"
            db_order.payment_id = payload.razorpay_payment_id
            db_order.payment_status = "Paid"
            db_order.status = "In Atelier Tailoring"
            db.commit()

    return {
        "success": True,
        "message": "Payment verified successfully. Suedo bespoke commission commenced.",
        "payment_id": payload.razorpay_payment_id
    }


# ============================================================================
# STRIPE ENDPOINTS (Optimized for Global Clients: USD, EUR, GBP, Apple Pay)
# ============================================================================

@router.post("/stripe/create-intent")
def create_stripe_payment_intent(payload: StripeIntentCreate):
    """
    Creates a Stripe PaymentIntent for international credit/debit card checkout.
    """
    currency_lower = payload.currency.lower()
    # Zero-decimal currencies like JPY
    is_zero_decimal = currency_lower in ["jpy"]
    amount_in_units = int(payload.amount) if is_zero_decimal else int(round(payload.amount * 100))

    if settings.STRIPE_SECRET_KEY:
        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            intent = stripe.PaymentIntent.create(
                amount=amount_in_units,
                currency=currency_lower,
                metadata={"atelier_order_id": payload.order_id or "BESPOKE"},
                automatic_payment_methods={"enabled": True}
            )
            return {
                "client_secret": intent.client_secret,
                "intent_id": intent.id,
                "amount": amount_in_units,
                "currency": currency_lower,
                "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
                "mock": False
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Stripe PaymentIntent initiation failed: {str(e)}")

    # Sandbox / Demo mode
    mock_intent_id = f"pi_mock_{uuid.uuid4().hex[:16]}"
    return {
        "client_secret": f"{mock_intent_id}_secret_{uuid.uuid4().hex[:10]}",
        "intent_id": mock_intent_id,
        "amount": amount_in_units,
        "currency": currency_lower,
        "publishable_key": settings.STRIPE_PUBLISHABLE_KEY or "pk_test_demo_atelier",
        "mock": True
    }


@router.post("/stripe/verify")
def verify_stripe_payment(payload: StripeVerifyRequest, db: Session = Depends(get_db)):
    """
    Confirms Stripe PaymentIntent capture and marks order as Paid.
    """
    if settings.STRIPE_SECRET_KEY and not payload.payment_intent_id.startswith("pi_mock"):
        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            intent = stripe.PaymentIntent.retrieve(payload.payment_intent_id)
            if intent.status not in ["succeeded", "processing"]:
                raise HTTPException(status_code=400, detail=f"Stripe payment not completed: {intent.status}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to verify Stripe PaymentIntent: {str(e)}")

    # Update order in database if order_id is provided
    if payload.order_id:
        db_order = db.query(Order).filter(Order.id == payload.order_id).first()
        if db_order:
            db_order.payment_gateway = "stripe"
            db_order.payment_id = payload.payment_intent_id
            db_order.payment_status = "Paid"
            db_order.status = "In Atelier Tailoring"
            db.commit()

    return {
        "success": True,
        "message": "Stripe payment captured successfully. Suedo bespoke commission commenced.",
        "payment_id": payload.payment_intent_id
    }
