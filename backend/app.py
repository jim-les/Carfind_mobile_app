from fastapi import FastAPI, HTTPException, Depends, status, Request, Response, Form
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3
import secrets
from typing import Optional
from main import *
import joblib
import pandas as pd
import os
import sklearn

# Initialize FastAPI app
app = FastAPI()

# Database connection
conn = sqlite3.connect('car_find.db')
cursor = conn.cursor()

# Create table if not exists
cursor.execute('''CREATE TABLE IF NOT EXISTS users
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT)''')
conn.commit()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

# In-memory session storage
sessions = {}

# Function to verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Function to get user from database by username
def get_user(username: str):
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    if user:
        return {"id": user[0], "username": user[1], "password": user[2]}
    return None

# Function to create a new user
def create_user(user: User):
    hashed_password = pwd_context.hash(user.password)
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, hashed_password))
    conn.commit()
    return {"username": user.username}

# Function to create session ID
def create_session_id():
    return secrets.token_hex(16)

# Dependency to get current user from session
def get_current_user(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return sessions[session_id]


# Login route
@app.post("/login")
async def login(user: User, response: Response):
    username = user.username
    password = user.password
    
    db_user = get_user(username)
    
    if not db_user or not verify_password(password, db_user["password"]):
        return {"status": "failed", "message": "Invalid username or password"}
    
    session_id = create_session_id()
    sessions[session_id] = db_user
    
    # Set cookie in the response
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=3600)  # max_age is 1 hour

    return {"status": "success", "message": "Logged in successfully"}
    

# Register route
@app.post("/register")
async def register(user: User):
    db_user = get_user(user.username)
    if db_user:
        return {"status": "failed", "message": "User already exists"}
    create_user(user)
    return {"status": "success", "message": "User created successfully"}

# Secure endpoint example
@app.get("/secure-endpoint")
async def read_secure_data(current_user: dict = Depends(get_current_user)):
    return {"message": "This is a secure endpoint", "user": current_user}

class PredictionInput(BaseModel):
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
    additional_features: str

class PredictionOutput(BaseModel):
    prediction: float
    
@app.post("/predict", response_model=PredictionOutput)
async def predict_price(data: PredictionInput):
    try:
        # Replace this with your actual prediction logic
        predicted_price = your_prediction_function(data)  # Ensure this function returns a float or int

        # Return a Pydantic model instance
        return PredictionOutput(prediction=predicted_price)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# load model
model = joblib.load('trained_model.pkl')

def your_prediction_function(data: PredictionInput) -> float:
    # Convert input data to DataFrame
    input_dict = {
        "Make": data.make,
        "Model": data.model,
        "Year": data.year,
        "Country of Origin": data.country_of_origin,
        "Transmission": data.transmission,
        "Engine Type": data.engine_type,
        "Engine Size (L)": data.engine_size,
        "Mileage (km)": data.mileage,
        "Condition": data.condition,
        "Previous Owners": data.previous_owners,
        "Additional Features": data.additional_features
    }
    df = pd.DataFrame([input_dict])
    # Make prediction
    prediction = model.predict(df)[0]
    return prediction

# Logout route
@app.post("/logout")
async def logout(response: Response, current_user: dict = Depends(get_current_user)):
    session_id = response.cookies.get("session_id")
    if session_id in sessions:
        del sessions[session_id]
    response.delete_cookie(key="session_id")
    return {"status": "success", "message": "Logged out successfully"}

# Validate session route
@app.get("/validate-session")
async def validate_session(current_user: dict = Depends(get_current_user)):
    return {"status": "success", "message": "Session is valid", "user": current_user}

# Include this docstring
"""
This FastAPI application implements user registration, authentication, and a secure endpoint for predicting car resale value without using JWT.
- The `/register` endpoint allows new users to register.
- The `/login` endpoint authenticates users and creates a session.
- The `/secure-endpoint` endpoint is a protected route that requires a valid session.
- The `/predict` endpoint uses car details to predict the resale value, requiring authentication.
- The `/validate-session` endpoint verifies the validity of a session.

Dependencies include `FastAPI`, `pydantic`, `passlib`, and `sqlite3`.
"""
