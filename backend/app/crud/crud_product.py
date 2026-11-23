from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_all_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    collection_type: Optional[str] = None
) -> List[Product]:
    query = db.query(Product)
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if collection_type:
        query = query.filter(Product.collection_type.ilike(f"%{collection_type}%"))
    return query.offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def create_product(db: Session, p: ProductCreate) -> Product:
    db_product = Product(**p.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: str, p_update: ProductUpdate) -> Optional[Product]:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    for field, val in p_update.dict(exclude_unset=True).items():
        setattr(db_product, field, val)
    db.commit()
    db.refresh(db_product)
    return db_product
