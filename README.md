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

📋 File-by-File Breakdown & Responsibilities
🐍 Backend (/backend)
backend/app/main.py

What it does: Serves as the core entry point for the FastAPI server, configuring global CORS middleware so the Next.js frontend can communicate seamlessly, and mounting all API route routers.

backend/app/core/database.py

What it does: Initializes and manages the asynchronous MongoDB client connection via Motor, linking the application directly to your cloud or local database cluster.

backend/app/core/config.py

What it does: Manages environment configurations and secret keys safely across the backend service using pydantic-settings.

backend/app/models/user.py

What it does: Defines rigorous data validation rules using Pydantic for user signups, logins, roles (consumer or seller), shop names, locations, UPI IDs, and mobile numbers.

backend/app/models/product.py

What it does: Validates incoming vegetable listings, pricing, available stock weights, special tags, desktop-uploaded base64 images, and vendor contact info.

backend/app/models/order.py

What it does: Validates consumer shopping carts, individual order items, delivery fees, delivery zones, grand totals, and chosen payment methods.

backend/app/api/v1/endpoints/auth.py

What it does: Handles secure user registration with bcrypt password hashing, duplicate email verification, and authentication login checks.

backend/app/api/v1/endpoints/products.py

What it does: Exposes REST endpoints for sellers to publish new harvest items, fetch marketplace listings, view vendor-specific stock, and delete products.

backend/app/api/v1/endpoints/orders.py

What it does: Manages order placement submissions from buyers and lets vendors view incoming orders or update fulfillment statuses to delivered.

⚛️ Frontend (/veggiekart/veggiekart)
src/app/page.js

What it does: Renders the main Landing & Authentication Portal where users can toggle between Consumer and Vendor roles, sign in, register accounts, or browse as a guest.

src/app/shop/page.js

What it does: The primary consumer marketplace where users browse live MongoDB products, add items to their cart with instant subtotal updates, calculate dynamic delivery fees, view vendor UPI details, and place orders.

src/app/admin/page.js

What it does: The secure Vendor Admin Dashboard allowing sellers to browse desktop product images, publish new harvest listings, delete items, and track live customer orders.

src/components/AuthPortal.js

What it does: Captures user credentials, handles form validation, communicates with FastAPI auth routes, and persists session states locally.

src/components/Sidebar.js

What it does: Implements a custom capsule-shaped floating navigation bar featuring quick tab switching and account sign-out controls.

src/components/SearchBar.js

What it does: Provides a dedicated search input bar enabling users to instantly filter vegetables and vendor stalls by name.


