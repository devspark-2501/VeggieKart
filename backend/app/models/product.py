from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    stock_kg: float
    special: bool = False
    image: Optional[str] = None  # <-- Added image field
    vendor_email: str
    vendor_name: str
    shop_name: Optional[str] = None
    upi_id: Optional[str] = None
    phone: Optional[str] = None