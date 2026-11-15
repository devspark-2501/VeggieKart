from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin
from app.core.database import db
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup")
async def signup(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered with VeggieKart!"
        )
    
    # Hash password
    hashed_password = pwd_context.hash(user.password)
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    # Insert into MongoDB
    result = await db.users.insert_one(user_dict)
    
    return {
        "success": True,
        "message": f"Successfully registered as {user.role}!",
        "user_id": str(result.inserted_id),
        "role": user.role
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
    
    # Verify password
    valid_password = pwd_context.verify(credentials.password, user["password"])
    if not valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    return {
        "success": True,
        "message": "Login successful!",
        "role": user["role"],
        "name": user["name"],
        "shopName": user.get("shopName")
    }