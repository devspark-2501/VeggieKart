from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, products, orders

app = FastAPI(title="VeggieKart API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])

@app.get("/")
def read_root():
    return {"message": "Welcome to VeggieKart FastAPI Backend! 🥬"}