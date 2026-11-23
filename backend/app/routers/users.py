from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import MeasurementsUpdate, AddressUpdate, UserProfileOut, UserOut
from app.crud.crud_user import update_user_measurements, update_user_address
from app.utils.security import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["User Profile & Measurements"])


@router.get("/profile", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Retrieve full user profile including bespoke measurements and shipping address."""
    return current_user


@router.put("/measurements", response_model=UserProfileOut)
def update_measurements(
    m: MeasurementsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Save tailored bespoke measurements (chest, shoulders, sleeves, height, fit preference)."""
    return update_user_measurements(db, user_id=current_user.id, m=m)


@router.put("/address", response_model=UserProfileOut)
def update_address(
    a: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update primary courier delivery address."""
    return update_user_address(db, user_id=current_user.id, a=a)
