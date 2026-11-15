from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    stock_kg: float
    special: bool = False
    vendor_email: str
    vendor_name: str
    shop_name: Optional[str] = None
    upi_id: Optional[str] = None
    phone: Optional[str] = None