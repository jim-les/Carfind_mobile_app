import joblib
import pandas as pd
import os
import sklearn

# load model
model = joblib.load('trained_model.pkl')

def make_prediction(data: dict) -> float:
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return prediction
