from fastapi import APIRouter, HTTPException
from app.models.product import ProductCreate
from app.core.database import db
from bson import ObjectId

router = APIRouter()

@router.post("/")
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    result = await db.products.insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    product_dict.pop("_id", None)
    return {"success": True, "product": product_dict}

@router.get("/")
async def get_all_products():
    products = []
    async for p in db.products.find():
        p["id"] = str(p.pop("_id"))
        products.append(p)
    return products

@router.get("/seller/{vendor_email}")
async def get_seller_products(vendor_email: str):
    products = []
    async for p in db.products.find({"vendor_email": vendor_email}):
        p["id"] = str(p.pop("_id"))
        products.append(p)
    return products

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product deleted"}