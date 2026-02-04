#!/usr/bin/env python3

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Load dataset
df = pd.read_csv('dataset/cricket_injury_risk_dataset.csv')

# Handle missing values (last row appears incomplete)
df = df.dropna()

# Prepare features
features = ['Age', 'Player Role', 'Player Type', 'BMI', 'Matches Last Week', 
           'Matches Last Month', 'Balls Faced Last Match', 'Acute Workload (7d)', 
           'Chronic Workload (30d)', 'Injuries Last 30d', 'Rest Days', 
           'Travel Load', 'Match Format']

X = df[features].copy()
y = df['Injury Risk %']

# Encode categorical variables
le_role = LabelEncoder()
le_type = LabelEncoder()
le_travel = LabelEncoder()
le_format = LabelEncoder()

X['Player Role'] = le_role.fit_transform(X['Player Role'])
X['Player Type'] = le_type.fit_transform(X['Player Type'])
X['Travel Load'] = le_travel.fit_transform(X['Travel Load'])
X['Match Format'] = le_format.fit_transform(X['Match Format'])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Test model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Performance:")
print(f"MSE: {mse:.2f}")
print(f"R²: {r2:.3f}")
print(f"RMSE: {np.sqrt(mse):.2f}")

# Save model and encoders
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/injury_predictor.pkl')
joblib.dump(le_role, 'models/role_encoder.pkl')
joblib.dump(le_type, 'models/type_encoder.pkl')
joblib.dump(le_travel, 'models/travel_encoder.pkl')
joblib.dump(le_format, 'models/format_encoder.pkl')

print("\nModel and encoders saved to 'models/' directory")