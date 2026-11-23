"""
Suedo Atelier - MySQL Database Seeder Script
Populates all 13 handcrafted jacket models and initial admin/collector demo users.
Usage:
    python seed_data.py
"""
import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models.user import User, UserProfile
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.utils.security import get_password_hash


JACKETS_DATA = [
    # --- SUEDE HERITAGE SILHOUETTES (7 Original Styles) ---
    {
        "id": "trucker-tobacco-brown",
        "name": "Suede Trucker Tobacco Brown",
        "category": "Trucker",
        "collection_type": "Suede",
        "base_price_inr": 215000.0,
        "url_slug": "/products/suede-trucker-tobacco-brown",
        "color_hex": "#8b5a36",
        "tagline": "Classic Western silhouette reimagined in velvety Tuscan lambskin suede.",
        "fabric": "0.8mm Full-Nap Italian Lambskin",
        "hardware": "Hand-patinated Antiqued Brass Shank Buttons",
        "lining": "Unlined Soft Reverse Finish",
        "weight": "720g Midweight",
        "image_front": "Images/Brown jacket images/Brown Jacket Front-tight.webp",
        "image_back": "Images/Brown jacket images/Brown Jacket Back-tight.webp",
        "image_side": "Images/Brown jacket images/Brown Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 12,
        "is_featured": True
    },
    {
        "id": "bomber-jet-black",
        "name": "Suede Bomber Jet Black",
        "category": "Bomber",
        "collection_type": "Suede",
        "base_price_inr": 235000.0,
        "url_slug": "/products/suede-bomber-jet-black",
        "color_hex": "#141414",
        "tagline": "Minimalist MA-1 military cut tailored with pure tonal ribbed wool collar and hems.",
        "fabric": "Deep Pigment Matte Calf Suede",
        "hardware": "Two-Way Polished Silver YKK Excella Zipper",
        "lining": "Cupro Satin Sleeves & Interior",
        "weight": "780g All-Season",
        "image_front": "Images/Black jacket images/Black Jacket Front-tight.webp",
        "image_back": "Images/Black jacket images/Black Jacket Back-tight.webp",
        "image_side": "Images/Black jacket images/Black Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 10,
        "is_featured": True
    },
    {
        "id": "harrington-jet-burgundy",
        "name": "Suede Harrington Jet Burgundy",
        "category": "Harrington",
        "collection_type": "Suede",
        "base_price_inr": 205000.0,
        "url_slug": "/products/suede-harrington-jet-burgundy",
        "color_hex": "#5b1f28",
        "tagline": "Iconic umbrella yoke back with twin-button stand collar in rich wine burgundy.",
        "fabric": "Tuscan Suede with Water-Repellent Nano Coating",
        "hardware": "Real Horn Buttons with Hand-Sewn Stems",
        "lining": "Breathable Cotton Twill Lining",
        "weight": "690g Lightweight",
        "image_front": "Images/Burgundy jacket images/Burgundy Jacket Front-tight.webp",
        "image_back": "Images/Burgundy jacket images/Burgundy Jacket Back-tight.webp",
        "image_side": "Images/Burgundy jacket images/Burgundy Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 8,
        "is_featured": False
    },
    {
        "id": "chore-charcoal-grey",
        "name": "Suede Chore Charcoal Grey",
        "category": "Chore",
        "collection_type": "Suede",
        "base_price_inr": 190000.0,
        "url_slug": "/products/suede-chore-charcoal-grey",
        "color_hex": "#404245",
        "tagline": "Utilitarian French workwear jacket updated with three patch pockets in ash charcoal.",
        "fabric": "Double-Buffed Goat Suede Nap",
        "hardware": "Matte Gunmetal Riveted Snaps",
        "lining": "Unlined Raw Leather Face",
        "weight": "710g Durable",
        "image_front": "Images/Charcoal Grey jacket images/Charcoal Jacket Front-tight.webp",
        "image_back": "Images/Charcoal Grey jacket images/Charcoal Jacket Back-tight.webp",
        "image_side": "Images/Charcoal Grey jacket images/Charcoal Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 14,
        "is_featured": False
    },
    {
        "id": "overshirt-forest-green",
        "name": "Suede Overshirt Forest Green",
        "category": "Overshirt",
        "collection_type": "Suede",
        "base_price_inr": 185000.0,
        "url_slug": "/products/suede-overshirt-forest-green",
        "color_hex": "#344b3c",
        "tagline": "Relaxed layering piece with clean point collar and curved hem in deep pine green.",
        "fabric": "Ultra-Supple 0.6mm Baby Calf Suede",
        "hardware": "Concealed Corozo Nut Snap Placket",
        "lining": "Silk-Touch Cupro Yoke",
        "weight": "590g Featherweight",
        "image_front": "Images/Forest Green jacket images/Forest Green Jacket Front-tight.webp",
        "image_back": "Images/Forest Green jacket images/Forest Green Jacket Back-tight.webp",
        "image_side": "Images/Forest Green jacket images/Forest Green Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 15,
        "is_featured": False
    },
    {
        "id": "blazer-camel",
        "name": "Suede Tailored Blazer Camel",
        "category": "Blazer",
        "collection_type": "Suede",
        "base_price_inr": 255000.0,
        "url_slug": "/products/suede-tailored-blazer-camel",
        "color_hex": "#c49a6c",
        "tagline": "Neapolitan soft-shoulder two-button blazer with patch pockets in warm golden camel.",
        "fabric": "Prime Selection Tuscan Calf Suede",
        "hardware": "Hand-Carved Buffalo Horn Buttons",
        "lining": "Half-Lined Bemberg Cupro",
        "weight": "760g Tailored",
        "image_front": "Images/Brown jacket images/Brown Jacket Front-tight.webp",
        "image_back": "Images/Brown jacket images/Brown Jacket Back-tight.webp",
        "image_side": "Images/Brown jacket images/Brown Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 7,
        "is_featured": False
    },
    {
        "id": "field-jacket-olive",
        "name": "Suede Field Jacket Safari Olive",
        "category": "Field Jacket",
        "collection_type": "Suede",
        "base_price_inr": 228000.0,
        "url_slug": "/products/suede-field-jacket-safari-olive",
        "color_hex": "#556b2f",
        "tagline": "Four bellowed cargo pockets with internal drawstring waist and rollaway throat latch.",
        "fabric": "Heavyweight Wax-Infused Lamb Suede",
        "hardware": "Reinforced Brass Ring Snaps",
        "lining": "Quilted Silk Tartan Body",
        "weight": "850g Rugged",
        "image_front": "Images/Forest Green jacket images/Forest Green Jacket Front-tight.webp",
        "image_back": "Images/Forest Green jacket images/Forest Green Jacket Back-tight.webp",
        "image_side": "Images/Forest Green jacket images/Forest Green Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 9,
        "is_featured": False
    },

    # --- FEATURED SAMPLE SILHOUETTES (Puffers & Varsity) ---
    {
        "id": "puffer-noir",
        "name": "Tuscan Down Puffer Noir",
        "category": "Puffer",
        "collection_type": "Featured Samples",
        "base_price_inr": 225000.0,
        "url_slug": "/products/puffer-noir",
        "color_hex": "#111110",
        "tagline": "Bespoke 800-fill goose down enveloped in matte water-resistant micro-suede.",
        "fabric": "Waterproof Technical Micro-Suede Shell with 90/10 White Goose Down",
        "hardware": "Waterproof Aquaguard YKK Matte Zips",
        "lining": "Thermal Reflective Ripstop Silk",
        "weight": "940g Thermal Guard",
        "image_front": "Images/Black jacket images/Black Jacket Front-tight.webp",
        "image_back": "Images/Black jacket images/Black Jacket Back-tight.webp",
        "image_side": "Images/Black jacket images/Black Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 6,
        "is_featured": True
    },
    {
        "id": "puffer-sky-blue",
        "name": "Tuscan Down Puffer Sky Blue",
        "category": "Puffer",
        "collection_type": "Featured Samples",
        "base_price_inr": 212000.0,
        "url_slug": "/products/puffer-sky-blue",
        "color_hex": "#7bb5d9",
        "tagline": "Vibrant alpine sky tint with articulated sleeve baffles and detachable hood.",
        "fabric": "Ultra-light Italian Ciré Shell with Fine Goose Down Core",
        "hardware": "Polished Nickel Storm Snaps",
        "lining": "Smooth Antistatic Cupro",
        "weight": "890g Lightweight Thermal",
        "image_front": "Images/Charcoal Grey jacket images/Charcoal Jacket Front-tight.webp",
        "image_back": "Images/Charcoal Grey jacket images/Charcoal Jacket Back-tight.webp",
        "image_side": "Images/Charcoal Grey jacket images/Charcoal Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 8,
        "is_featured": True
    },
    {
        "id": "varsity-chestnut",
        "name": "Heritage Varsity Chestnut & Cream",
        "category": "Varsity",
        "collection_type": "Featured Samples",
        "base_price_inr": 242000.0,
        "url_slug": "/products/varsity-chestnut",
        "color_hex": "#8c4a2f",
        "tagline": "Heavyweight boiled wool body with supple cream nappa calfskin sleeves.",
        "fabric": "24oz Tuscan Meltons Wool Body with Full-Grain Nappa Leather Sleeves",
        "hardware": "Custom Enamelled Letterman Snaps",
        "lining": "Diamond-Quilted Silk Twill",
        "weight": "980g Heavyweight Heritage",
        "image_front": "Images/Brown jacket images/Brown Jacket Front-tight.webp",
        "image_back": "Images/Brown jacket images/Brown Jacket Back-tight.webp",
        "image_side": "Images/Brown jacket images/Brown Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 11,
        "is_featured": True
    },
    {
        "id": "varsity-forest",
        "name": "Heritage Varsity Forest & Bone",
        "category": "Varsity",
        "collection_type": "Featured Samples",
        "base_price_inr": 245000.0,
        "url_slug": "/products/varsity-forest",
        "color_hex": "#274e37",
        "tagline": "Emerald wool body with chenille atelier crest patch and bone-white leather sleeves.",
        "fabric": "Heritage English Tweed Wool with Grain Calf Sleeves",
        "hardware": "Oxidized Brass Heavy Snaps",
        "lining": "Lustrous Emerald Cupro Satin",
        "weight": "990g Heavyweight Heritage",
        "image_front": "Images/Forest Green jacket images/Forest Green Jacket Front-tight.webp",
        "image_back": "Images/Forest Green jacket images/Forest Green Jacket Back-tight.webp",
        "image_side": "Images/Forest Green jacket images/Forest Green Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 7,
        "is_featured": True
    },
    {
        "id": "commuter-navy",
        "name": "Quilted Suede Commuter Navy",
        "category": "Commuter",
        "collection_type": "Suede",
        "base_price_inr": 210000.0,
        "url_slug": "/products/quilted-suede-commuter-navy",
        "color_hex": "#1b2838",
        "tagline": "Diamond-quilted baby suede with stand corduroy collar and storm wind-guard.",
        "fabric": "0.7mm Tuscan Suede with Light Thermocore Interlining",
        "hardware": "Branded Horn Buttons with Concealed YKK Zipper",
        "lining": "Water-Repellent Poly-Cupro",
        "weight": "740g All-Weather",
        "image_front": "Images/Black jacket images/Black Jacket Front-tight.webp",
        "image_back": "Images/Black jacket images/Black Jacket Back-tight.webp",
        "image_side": "Images/Black jacket images/Black Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 12,
        "is_featured": False
    },
    {
        "id": "shearling-flight-espresso",
        "name": "B-3 Shearling Flight Jacket Espresso",
        "category": "Shearling",
        "collection_type": "Suede",
        "base_price_inr": 285000.0,
        "url_slug": "/products/shearling-flight-espresso",
        "color_hex": "#38241b",
        "tagline": "Substantial WWII aviator bomber crafted from 15mm plush merino sheepskin shearling.",
        "fabric": "100% Genuine Tuscan Merino Shearling Sheepskin",
        "hardware": "Dual Buckled Collar Straps & Heavy Brass Zip",
        "lining": "Natural Untreated Merino Wool Fleece",
        "weight": "1420g Sub-Zero Warmth",
        "image_front": "Images/Brown jacket images/Brown Jacket Front-tight.webp",
        "image_back": "Images/Brown jacket images/Brown Jacket Back-tight.webp",
        "image_side": "Images/Brown jacket images/Brown Jacket Side-tight.webp",
        "in_stock": True,
        "stock_count": 5,
        "is_featured": True
    }
]


def seed():
    print("Connecting to MySQL database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Products
        print(f"Seeding {len(JACKETS_DATA)} jacket silhouettes...")
        for jacket in JACKETS_DATA:
            existing = db.query(Product).filter(Product.id == jacket["id"]).first()
            if not existing:
                p = Product(**jacket)
                db.add(p)
                print(f"  + Added: {jacket['name']} (₹{jacket['base_price_inr']:,.0f})")
            else:
                print(f"  • Exists: {jacket['name']}")
        db.commit()

        # 2. Seed Admin User
        admin_email = "admin@suedo.atelier"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("AdminPassword123!"),
                full_name="Master Tailor (Admin)",
                phone="+39 055 210000",
                preferred_size="L",
                role="admin"
            )
            db.add(admin)
            db.flush()
            admin_profile = UserProfile(
                user_id=admin.id,
                fit_preference="Tailored Slim",
                address_line="Via de' Tornabuoni, 15",
                city="Florence",
                state="Tuscany",
                postal_code="50123",
                country="Italy"
            )
            db.add(admin_profile)
            db.commit()
            print(f"  + Created Admin Account: {admin_email} (Pass: AdminPassword123!)")

        # 3. Seed Demo Collector User
        collector_email = "collector@suedo.com"
        collector = db.query(User).filter(User.email == collector_email).first()
        if not collector:
            collector = User(
                email=collector_email,
                hashed_password=get_password_hash("CollectorPassword123!"),
                full_name="Alexander Vance",
                phone="+1 (555) 782-9901",
                preferred_size="L",
                role="collector"
            )
            db.add(collector)
            db.flush()
            collector_profile = UserProfile(
                user_id=collector.id,
                chest='40"',
                shoulders='18.5"',
                sleeves='34"',
                height="6'0\"",
                fit_preference="Tailored Slim",
                address_line="742 Evergreen Terrace, Suite 4B",
                city="New York",
                state="NY",
                postal_code="10012",
                country="United States"
            )
            db.add(collector_profile)

            # Sample Order for Collector
            sample_order = Order(
                id="SUE-8902",
                user_id=collector.id,
                total_amount=215000.0,
                currency="INR",
                status="In Atelier Tailoring",
                tracking_number="DHL-EXP-9921048821",
                shipping_address="742 Evergreen Terrace, Suite 4B, New York, NY 10012"
            )
            db.add(sample_order)
            db.flush()

            order_item = OrderItem(
                order_id=sample_order.id,
                product_id="trucker-tobacco-brown",
                product_name="Suede Trucker Tobacco Brown",
                size="L",
                color="Tobacco Brown",
                quantity=1,
                price=215000.0
            )
            db.add(order_item)
            db.commit()
            print(f"  + Created Demo Collector: {collector_email} (Pass: CollectorPassword123!)")
            print("  + Created Sample Order SUE-8902 (DHL-EXP-9921048821)")

        print("\n✨ Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
