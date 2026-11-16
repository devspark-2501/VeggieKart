# 🥬 VeggieKart — Farm-to-Consumer E-Commerce Platform 🛒🚜

> VeggieKart is a lightning-fast, role-based farm-to-consumer e-commerce platform bridging local mandi vendors and everyday shoppers with live MongoDB inventory, instant subtotal calculations, tiered delivery fees, direct UPI payments, and cash-on-delivery options! 🚀✨🌾

---

## 📂 Complete Project Folder Structure & Architecture

```text
veggiekart/
├── 📁 backend/                        # FastAPI Python Backend Service
│   ├── 📁 app/
│   │   ├── 📁 api/                    # API Route Handlers and Endpoints
│   │   │   └── 📁 v1/
│   │   │       ├── 📁 endpoints/
│   │   │       │   ├── auth.py        # Handles user/vendor sign up, bcrypt hashing, and login
│   │   │       │   ├── products.py    # Manages adding, listing, filtering, and deleting vendor items
│   │   │       │   └── orders.py      # Processes consumer checkouts, order placement, and status updates
│   │   ├── 📁 core/
│   │   │   ├── config.py              # Loads environment variables and settings
│   │   │   └── database.py            # Establishes asynchronous Motor connection to MongoDB
│   │   ├── 📁 models/                 # Pydantic data validation schemas
│   │   │   ├── order.py               # Defines schema for order items, totals, and delivery zones
│   │   │   ├── product.py             # Defines schema for vegetable inventory and pricing
│   │   │   └── user.py                # Defines schema for user credentials, roles, and vendor details
│   │   └── main.py                    # Initializes FastAPI app, CORS middleware, and route routers
│   ├── 📄 requirements.txt            # Python dependencies (FastAPI, Uvicorn, Motor, Pydantic, etc.)
│   └── 📁 venv/                       # Local Python virtual environment container
│
└── 📁 veggiekart/                     # Next.js Frontend Application
    ├── 📁 public/                     # Static assets and public images
    ├── 📁 src/
    │   ├── 📁 app/                    # Next.js App Router pages
    │   │   ├── 📁 admin/
    │   │   │   └── page.js            # Vendor admin dashboard for inventory management and orders
    │   │   ├── 📁 shop/
    │   │   │   └── page.js            # Consumer marketplace with search, cart, delivery fees, and checkout
    │   │   ├── layout.js              # Global layout wrapper and font definitions
    │   │   └── page.js                # Role-based authentication portal (Consumer/Vendor login & signup)
    │   ├── 📁 components/             # Reusable UI components
    │   │   ├── AuthPortal.js          # Authentication form handling signup/login states and roles
    │   │   ├── SearchBar.js           # Real-time search component for filtering products and vendors
    │   │   └── Sidebar.js             # Custom capsule-shaped floating navigation bar
    │   └── 📁 styles/                 # Global Tailwind CSS styles and directives
    ├── 📄 .env.local                  # Frontend environment configuration variables
    ├── 📄 jsconfig.json               # JavaScript path aliasing configuration
    ├── 📄 package.json                # Node.js dependencies and project scripts
    └── 📄 tailwind.config.js          # Tailwind CSS styling and theme configuration
