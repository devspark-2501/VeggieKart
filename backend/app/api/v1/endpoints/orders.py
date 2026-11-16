from fastapi import APIRouter, HTTPException
from app.models.order import OrderCreate
from app.core.database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/")
async def place_order(order: OrderCreate):
    order_dict = order.dict()
    order_dict["status"] = "Pending"
    order_dict["created_at"] = datetime.utcnow().isoformat()
    result = await db.orders.insert_one(order_dict)
    return {
        "success": True,
        "order_id": str(result.inserted_id),
        "message": "Order placed successfully!"
    }

@router.get("/seller/{vendor_email}")
async def get_seller_orders(vendor_email: str):
    orders = []
    async for o in db.orders.find({"items.vendor_email": vendor_email}):
        o["id"] = str(o.pop("_id"))
        # Filter items belonging specifically to this seller
        o["seller_items"] = [i for i in o["items"] if i["vendor_email"] == vendor_email]
        orders.append(o)
    return orders

@router.patch("/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    result = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "status": status}