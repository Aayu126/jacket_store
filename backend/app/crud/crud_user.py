from sqlalchemy.orm import Session
from typing import Optional
from app.models.user import User, UserProfile
from app.schemas.user import UserCreate, MeasurementsUpdate, AddressUpdate
from app.utils.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: UserCreate, role: str = "collector") -> User:
    hashed_pwd = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.name,
        phone=user_in.phone,
        preferred_size=user_in.size or "L",
        role=role
    )
    db.add(db_user)
    db.flush()

    # Create default user profile (measurements and default address)
    db_profile = UserProfile(
        user_id=db_user.id,
        fit_preference="Tailored Slim"
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_measurements(db: Session, user_id: int, m: MeasurementsUpdate) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)

    if m.chest is not None:
        profile.chest = m.chest
    if m.shoulders is not None:
        profile.shoulders = m.shoulders
    if m.sleeves is not None:
        profile.sleeves = m.sleeves
    if m.height is not None:
        profile.height = m.height
    if m.fit_preference is not None:
        profile.fit_preference = m.fit_preference

    db.commit()
    db.refresh(profile)
    return profile


def update_user_address(db: Session, user_id: int, a: AddressUpdate) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)

    if a.address_line is not None:
        profile.address_line = a.address_line
    if a.city is not None:
        profile.city = a.city
    if a.state is not None:
        profile.state = a.state
    if a.postal_code is not None:
        profile.postal_code = a.postal_code
    if a.country is not None:
        profile.country = a.country

    db.commit()
    db.refresh(profile)
    return profile
