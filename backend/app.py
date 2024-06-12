from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3
import jwt
from datetime import datetime, timedelta
from typing import Optional
from main import *

# Initialize FastAPI app
app = FastAPI()

# Database connection
conn = sqlite3.connect('car_find.db')
cursor = conn.cursor()

# Create table if not exists
cursor.execute('''CREATE TABLE IF NOT EXISTS users
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT)''')
conn.commit()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000

# Pydantic model for user input
class User(BaseModel):
    username: str
    password: str

class CarDetails(BaseModel):
    make: str
    model: str
    year: int
    country_of_origin: str
    transmission: str
    engine_type: str
    engine_size: float
    mileage: float
    condition: str
    previous_owners: int
    additional_features: str = ""

# Function to verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies the given password against the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

# Function to get user from database by username
def get_user(username: str):
    """
    Retrieves user information from the database by username.
    """
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    if user:
        return {"id": user[0], "username": user[1], "password": user[2]}
    return None

# Function to create a new user
def create_user(user: User):
    """
    Creates a new user with a hashed password.
    """
    hashed_password = pwd_context.hash(user.password)
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, hashed_password))
    conn.commit()
    return {"username": user.username}

# Function to create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT token with an expiration time.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Gets the current user from the provided JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = {"username": username}
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(username=token_data["username"])
    if user is None:
        raise credentials_exception
    return user

# Login route
@app.post("/login")
async def login(user: User):
    """
    Authenticates the user and returns a JWT token if successful.
    """
    username = user.username
    password = user.password
    db_user = get_user(username)

    if not db_user:
        return {"status": "failed", "message": "Invalid username or password"}
    
    if not verify_password(password, db_user["password"]):
        return {"status": "failed", "message": "Invalid username or password"}
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    return {"status": "success", "token": access_token}

# Register route
@app.post("/register")
async def register(user: User):
    """
    Registers a new user if the username does not already exist.
    """
    username = user.username
    password = user.password
    db_user = get_user(username)
    if db_user:
        return {"status": "failed", "message": "User already exists"}
    create_user(user)
    return {"status": "success", "message": "User created successfully"}

# Secure endpoint example
@app.get("/secure-endpoint")
async def read_secure_data(current_user: User = Depends(get_current_user)):
    """
    An example of a secure endpoint that requires authentication.
    """
    return {"message": "This is a secure endpoint", "user": current_user}

# Predict car resale value
@app.post("/predict")
async def predict(car_details: CarDetails):
    """
    Predicts the resale value of a car based on its details.
    """
    car_data = {
        'Make': car_details.make,
        'Model': car_details.model,
        'Year': car_details.year,
        'Country of Origin': car_details.country_of_origin,
        'Transmission': car_details.transmission,
        'Engine Type': car_details.engine_type,
        'Engine Size (L)': car_details.engine_size,
        'Mileage (km)': car_details.mileage,
        'Condition': car_details.condition,
        'Previous Owners': car_details.previous_owners,
        'Additional Features': car_details.additional_features
    }
    
    try:
        prediction = make_prediction(car_data)
        # return a repons to be read by react-native for the prediction
        return {"prediction": prediction} 
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

class TokenRequest(BaseModel):
    token: str
    
    
# Validate token route
@app.post("/validate-token")
async def validate_token(token: TokenRequest):
    """
    Validates the provided JWT token.
    """
    # try:
    # Decode the token
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return {"status": "success", "message": "Token Is Valid"}

    

# Include this docstring
"""
This FastAPI application implements user registration, authentication, and a secure endpoint for predicting car resale value.
- The `/register` endpoint allows new users to register.
- The `/login` endpoint authenticates users and provides a JWT token.
- The `/secure-endpoint` endpoint is a protected route that requires a valid token.
- The `/predict` endpoint uses car details to predict the resale value, requiring authentication.
- The `/validate-token` endpoint verifies the validity of a JWT token.

Dependencies include `FastAPI`, `pydantic`, `passlib`, and `jwt`. SQLite is used as the database.
"""
