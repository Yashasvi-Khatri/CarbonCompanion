import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def get_numeric_input(prompt):
    """Get numeric input from user with validation"""
    while True:
        try:
            value = float(input(prompt))
            if value > 0:
                return value
            print("Please enter a positive number.")
        except ValueError:
            print("Please enter a valid number.")

def get_choice(prompt, options):
    """Get user choice from a list of options"""
    while True:
        print(prompt)
        for i, option in enumerate(options, 1):
            print(f"{i}. {option}")
        
        try:
            choice = int(input("Enter your choice (number): "))
            if 1 <= choice <= len(options):
                return options[choice - 1]
            print(f"Please enter a number between 1 and {len(options)}")
        except ValueError:
            print("Please enter a valid number.")

class EmissionsCalculator:
    def __init__(self):
        self.model = None
        self.label_encoders = {
            'Vehicle_Type': LabelEncoder(),
            'Fuel_Type': LabelEncoder()
        }
        self.load_data()
        
    def load_data(self):
        # Load the new dataset
        self.data = pd.read_csv('accurate_carbon_emission_dataset_2500.csv')
        
        # Handle missing values
        self.data['Mileage_kmpl'] = self.data['Mileage_kmpl'].fillna(self.data['Mileage_kmpl'].mean())
        
        # Encode categorical variables
        self.data['Vehicle_Type_encoded'] = self.label_encoders['Vehicle_Type'].fit_transform(self.data['Vehicle_Type'])
        self.data['Fuel_Type_encoded'] = self.label_encoders['Fuel_Type'].fit_transform(self.data['Fuel_Type'])
        
        # Prepare features and target
        X = self.data[['Vehicle_Type_encoded', 'Fuel_Type_encoded', 'Distance_km', 'Mileage_kmpl']]
        y = self.data['Carbon_Emitted_kg']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Save model and encoders
        joblib.dump(self.model, 'carbon_emissions_model_v2.joblib')
        joblib.dump(self.label_encoders, 'label_encoders.joblib')
        
    def predict_emissions(self, vehicle_type, fuel_type, distance, mileage):
        # Encode vehicle type and fuel type
        vehicle_type_encoded = self.label_encoders['Vehicle_Type'].transform([vehicle_type])[0]
        fuel_type_encoded = self.label_encoders['Fuel_Type'].transform([fuel_type])[0]
        
        # Prepare input data
        input_data = np.array([[vehicle_type_encoded, fuel_type_encoded, distance, mileage]])
        
        # Make prediction
        prediction = self.model.predict(input_data)[0]
        
        # Calculate comparison values
        comparisons = {
            'car': self.data[self.data['Vehicle_Type'] == 'Car']['Carbon_Emitted_kg'].mean(),
            'bus': self.data[self.data['Vehicle_Type'] == 'Bus']['Carbon_Emitted_kg'].mean(),
            'motorcycle': self.data[self.data['Vehicle_Type'] == 'Motorcycle']['Carbon_Emitted_kg'].mean()
        }
        
        # Generate interpretation
        interpretation = self._interpret_emissions(prediction)
        
        return {
            'emissions': max(0, prediction),
            'interpretation': interpretation,
            'comparison': {
                'car': f"~{comparisons['car']:.1f} kg CO2 per 100km",
                'bus': f"~{comparisons['bus']:.1f} kg CO2 per 100km",
                'motorcycle': f"~{comparisons['motorcycle']:.1f} kg CO2 per 100km"
            }
        }
    
    def _interpret_emissions(self, emissions):
        if emissions < 10:
            return 'This journey has relatively low carbon emissions.'
        elif emissions < 30:
            return 'This journey has moderate carbon emissions.'
        elif emissions < 50:
            return 'This journey has high carbon emissions.'
        else:
            return 'This journey has very high carbon emissions.'
    
    def get_available_vehicle_types(self):
        return self.label_encoders['Vehicle_Type'].classes_.tolist()
    
    def get_available_fuel_types(self):
        return self.label_encoders['Fuel_Type'].classes_.tolist()

def main():
    """Main function for the emissions calculator"""
    clear_screen()
    print("=" * 50)
    print("CARBON EMISSIONS CALCULATOR")
    print("=" * 50)
    
    # Initialize and train the model
    calculator = EmissionsCalculator()
    if not calculator.model:
        print("Failed to initialize the model. Please check if the dataset file exists.")
        return
    
    while True:
        clear_screen()
        print("=" * 50)
        print("CARBON EMISSIONS CALCULATOR")
        print("=" * 50)
        
        # Get vehicle type
        vehicle_type = get_choice("Select vehicle type:", calculator.get_available_vehicle_types())
        
        # Get fuel type
        fuel_type = get_choice("Select fuel type:", calculator.get_available_fuel_types())
        
        # Get mileage and distance
        print("\nEnter journey details:")
        mileage = get_numeric_input("Enter vehicle mileage (km/L): ")
        distance = get_numeric_input("Enter journey distance (km): ")
        
        # Make prediction
        try:
            result = calculator.predict_emissions(vehicle_type, fuel_type, distance, mileage)
            print("\n" + "=" * 50)
            print(f"PREDICTED CARBON EMISSIONS: {result['emissions']:.2f} kg CO2")
            print("=" * 50)
            
            # Provide interpretation
            print("\n" + result['interpretation'])
            
            # Provide comparison
            print("\nComparison with average vehicles (per 100km):")
            print(f"- Average Car: {result['comparison']['car']}")
            print(f"- Average Bus: {result['comparison']['bus']}")
            print(f"- Average Motorcycle: {result['comparison']['motorcycle']}")
            
        except Exception as e:
            print(f"\nError making prediction: {str(e)}")
        
        # Ask if user wants to calculate again
        choice = input("\nWould you like to calculate emissions for another journey? (y/n): ")
        if choice.lower() != 'y':
            break
    
    print("\nThank you for using the Carbon Emissions Calculator!")

if __name__ == "__main__":
    main() 