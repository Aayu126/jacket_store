from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate
from app.crud.crud_product import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product
)
from app.utils.security import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/api/products", tags=["Products & Silhouettes"])


@router.get("", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = Query(None, description="Filter by category (e.g. Trucker, Bomber, Puffer)"),
    collection: Optional[str] = Query(None, description="Filter by collection (e.g. Suede, Featured Samples)"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Fetch all outerwear silhouettes available in the Suedo Atelier collection."""
    return get_all_products(db, skip=skip, limit=limit, category=category, collection_type=collection)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Fetch complete craftsmanship specifications for a single jacket silhouette."""
    product = get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Jacket silhouette '{product_id}' was not found in archive."
        )
    return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_new_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Add a new outerwear silhouette to catalog (Admin only)."""
    existing = get_product_by_id(db, product_id=product_in.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with id '{product_in.id}' already exists."
        )
    return create_product(db, p=product_in)


@router.put("/{product_id}", response_model=ProductOut)
def modify_product(
    product_id: str,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update pricing, stock, or details of a jacket (Admin only)."""
    product = update_product(db, product_id=product_id, p_update=product_update)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
