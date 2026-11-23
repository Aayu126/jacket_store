# Suedo Atelier - FastAPI & MySQL Backend

High-performance, modular REST API for **Suedo Atelier** built with **Python 3.11+**, **FastAPI**, **SQLAlchemy 2.0**, and **MySQL 8.0**.

---

## 🏛️ Architecture Overview

```
backend/
├── app/
│   ├── main.py              # FastAPI application, CORS middleware, lifespan events
│   ├── config.py            # Environment settings (.env parser)
│   ├── database.py          # SQLAlchemy engine, session maker, get_db dependency
│   ├── models/              # SQLAlchemy ORM database models
│   │   ├── user.py          # User & UserProfile (measurements, addresses)
│   │   ├── product.py       # Outerwear silhouettes & craftsmanship specs
│   │   └── order.py         # Orders & OrderItems with DHL Express tracking
│   ├── schemas/             # Pydantic v2 validation models
│   │   ├── user.py          # Register, Login, Token, Profile schemas
│   │   ├── product.py       # Product request/response schemas
│   │   └── order.py         # Order placement and tracking schemas
│   ├── crud/                # Clean database operations
│   │   ├── crud_user.py
│   │   ├── crud_product.py
│   │   └── crud_order.py
│   ├── routers/             # Modular FastAPI API routers
│   │   ├── auth.py          # /api/auth (register, login, /me, token)
│   │   ├── products.py      # /api/products (list, filter, details)
│   │   ├── orders.py        # /api/orders (place order, list my orders)
│   │   └── users.py         # /api/users (measurements, shipping address)
│   └── utils/
│       └── security.py      # Bcrypt password hashing & JWT token verification
├── .env                     # Your local MySQL credentials
├── .env.example             # Template environment variables
├── requirements.txt         # Pinned Python dependencies
├── seed_data.py             # Database seeder (all 13 jackets & demo accounts)
└── postman_collection.json  # 1-click Postman import with automatic auth tokens
```

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Start MySQL and Create the Database

Make sure your **MySQL Server 8.0** is running:
- **Option A (Services)**: Press `Win + R`, type `services.msc`, locate `MySQL80`, right-click and click **Start**.
- **Option B (Command Prompt as Administrator)**:
  ```cmd
  net start MySQL80
  ```

Open **MySQL Command Line Client** or **MySQL Workbench**, log in with your root password, and run:
```sql
CREATE DATABASE IF NOT EXISTS suedo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Configure `.env`

Open `backend/.env` in VS Code and set your local MySQL password:
```ini
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD_HERE@localhost:3306/suedo_db
SECRET_KEY=suedo_atelier_super_secret_jwt_key_2026_luxury_craft
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://jacket-store-blue.vercel.app
ENVIRONMENT=development
```

---

### Step 3: Create Python Virtual Environment & Install Dependencies

In VS Code terminal (or PowerShell), navigate to the `backend` folder:
```powershell
cd "d:\Suedo Jacket Store\backend"

# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 3. Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 4: Seed the Database

Run the database seeder to automatically create tables and populate all 13 jackets and initial accounts:
```powershell
python seed_data.py
```

You will see:
```text
✓ MySQL tables verified / created successfully.
Seeding 13 jacket silhouettes...
  + Added: Suede Trucker Tobacco Brown (₹215,000)
  + Added: Suede Bomber Jet Black (₹235,000)
  ...
  + Created Admin Account: admin@suedo.atelier (Pass: AdminPassword123!)
  + Created Demo Collector: collector@suedo.com (Pass: CollectorPassword123!)
  + Created Sample Order SUE-8902 (DHL-EXP-9921048821)
✨ Database seeding completed successfully!
```

---

### Step 5: Start the FastAPI Server

Launch the development server with live reload:
```powershell
uvicorn app.main:app --reload --port 8000
```

The server will start at:
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Alternative ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 🧪 Testing with Postman & Swagger

### 1. Interactive Swagger UI (`/docs`)
1. Open `http://127.0.0.1:8000/docs` in your browser.
2. Click on `POST /api/auth/token` or the green **Authorize 🔒** button at the top right.
3. Username: `collector@suedo.com`, Password: `CollectorPassword123!`.
4. Click **Authorize** — all authenticated endpoints (`/api/auth/me`, `/api/orders`, `/api/users/measurements`) will now execute with your bearer token automatically!

### 2. Postman
1. Open Postman.
2. Click **Import** (top left) and select `backend/postman_collection.json`.
3. Run request **3. Auth - Login**: The collection script will **automatically extract and store the JWT token** into the collection variable `{{token}}`.
4. Now you can click and test any authenticated request (**Get Current User**, **Save Bespoke Measurements**, **Place Bespoke Order**, etc.) with zero manual copy-pasting!

---

## 📡 API Endpoint Summary

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new user account | No |
| **Auth** | `POST` | `/api/auth/login` | Login and receive Bearer JWT token | No |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user profile & measurements | Yes (Bearer) |
| **Products** | `GET` | `/api/products` | List all 13 jackets (filter by `category` or `collection`) | No |
| **Products** | `GET` | `/api/products/{id}` | Get complete specs of a single silhouette | No |
| **Orders** | `POST` | `/api/orders` | Place a bespoke order/commission | Yes (Bearer) |
| **Orders** | `GET` | `/api/orders/my-orders`| List orders for logged-in user | Yes (Bearer) |
| **Orders** | `GET` | `/api/orders/{id}` | View order status & DHL Express tracking | Yes (Bearer) |
| **Profile** | `PUT` | `/api/users/measurements`| Save tailored chest, shoulders, sleeves, height | Yes (Bearer) |
| **Profile** | `PUT` | `/api/users/address` | Update primary delivery address | Yes (Bearer) |
