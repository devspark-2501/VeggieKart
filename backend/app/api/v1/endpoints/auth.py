from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin
from app.core.database import db
import bcrypt

router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered with VeggieKart!"
        )
    
    # Hash password directly using bcrypt (safely encoding utf-8)
    pwd_bytes = user.password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    # Insert into MongoDB
    result = await db.users.insert_one(user_dict)
    
    return {
        "success": True,
        "message": f"Successfully registered as {user.role}!",
        "user_id": str(result.inserted_id),
        "role": user.role,
        "name": user.name,
        "shopName": user.shopName,
        "upiId": user.upiId,
        "phone": user.phone
    }

@router.post("/login")
async def login(credentials: UserLogin):
    # Find user in MongoDB
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    # Verify password directly using bcrypt
    password_match = bcrypt.checkpw(
        credentials.password.encode('utf-8'),
        user["password"].encode('utf-8')
    )
    
    if not password_match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    return {
        "success": True,
        "message": "Login successful!",
        "role": user["role"],
        "name": user["name"],
        "shopName": user.get("shopName"),
        "upiId": user.get("upiId"),
        "phone": user.get("phone"),
    }