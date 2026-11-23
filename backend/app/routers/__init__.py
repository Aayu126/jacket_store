from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.orders import router as orders_router
from app.routers.users import router as users_router
from app.routers.currency import router as currency_router
from app.routers.payments import router as payments_router

__all__ = [
    "auth_router",
    "products_router",
    "orders_router",
    "users_router",
    "currency_router",
    "payments_router",
]
