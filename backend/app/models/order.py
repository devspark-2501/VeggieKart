from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    qty: int
    vendor_email: str
    vendor_name: str

class OrderCreate(BaseModel):
    consumer_name: str
    consumer_email: Optional[str] = "Guest"
    items: List[OrderItem]
    subtotal: float
    delivery_fee: float
    delivery_zone: str
    grand_total: float
    payment_method: str  # "upi" or "cod"