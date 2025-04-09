import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

class CarbonEmissionsModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.data = None
        print("Initializing Carbon Emissions Model...")
    
    def load_data(self):
        """Load the carbon emissions dataset"""
        print("Loading vehicle data...")
        try:
            self.data = pd.read_csv('carbon_emission_dataset_1000_no_fuel.csv')
            print(f"Loaded {len(self.data)} records")
            return True
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            return False
    
    def train_model(self):
        """Train the carbon emissions prediction model"""
        if self.data is None:
            if not self.load_data():
                return False
        
        print("Training model...")
        try:
            # Prepare features
            X = self.data[['Distance_km', 'Mileage_kmpl']]
            y = self.data['Carbon_Emitted_kg']
            
            # Train model
            self.model.fit(X, y)
            print("Model trained successfully!")
            return True
        except Exception as e:
            print(f"Error training model: {str(e)}")
            return False
    
    def predict_emissions(self, vehicle_data):
        """Predict carbon emissions for a given vehicle"""
        try:
            # Extract features
            distance = float(vehicle_data.get('distance', 0))
            mileage = float(vehicle_data.get('mileage', 0))
            
            if distance <= 0 or mileage <= 0:
                raise ValueError("Distance and mileage must be positive numbers")
            
            # Make prediction
            prediction = self.model.predict([[distance, mileage]])[0]
            return max(0, prediction)  # Ensure non-negative emissions
            
        except Exception as e:
            print(f"Error making prediction: {str(e)}")
            return None 