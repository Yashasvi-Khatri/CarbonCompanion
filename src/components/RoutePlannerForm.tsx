import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Navigation, ArrowRight, Car, Bike } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Route {
  name: string;
  distance: number;
  time: number;
  traffic: string;
  emissions: number;
  emissions_interpretation: string;
}

interface RouteAnalysis {
  origin: string;
  destination: string;
  routes: Route[];
  eco_recommended_route: string;
  eco_savings: {
    vs_worst_route: number;
    percentage: number;
  };
}

interface AlternativeVehicle {
  vehicle: string;
  emissions: number;
  is_eco_friendly: boolean;
}

interface AlternativesAnalysis {
  alternatives: AlternativeVehicle[];
  eco_recommended: string;
}

interface RoutePlannerFormProps {
  onCalculateRoutes: (routeData: any) => void;
}

const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({ onCalculateRoutes }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [fuelType, setFuelType] = useState('Petrol');
  const [mileage, setMileage] = useState('12.5');
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysis | null>(null);
  const [alternativesAnalysis, setAlternativesAnalysis] = useState<AlternativesAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to the backend
      // For demo, we're simulating the response from our Python model
      const routeData = {
        origin,
        destination,
        vehicleType,
        fuelType,
        mileage: parseFloat(mileage)
      };

      // Call the parent handler which would make the actual API call
      onCalculateRoutes(routeData);

      // Simulate API response for demo purposes
      // In a real app, this would come from the API response
      setTimeout(() => {
        // Generate mock route data
        const routes = [
          {
            name: "Route A (Fastest)",
            distance: 15 + Math.random() * 5,
            time: 25 + Math.random() * 10,
            traffic: "Low to Moderate",
            emissions: 3 + Math.random() * 2,
            emissions_interpretation: "This journey has relatively low carbon emissions."
          },
          {
            name: "Route B (Shortest)",
            distance: 12 + Math.random() * 3,
            time: 30 + Math.random() * 15,
            traffic: "Moderate",
            emissions: 2.5 + Math.random() * 1.5,
            emissions_interpretation: "This journey has relatively low carbon emissions."
          },
          {
            name: "Route C (Alternative)",
            distance: 18 + Math.random() * 7,
            time: 35 + Math.random() * 20,
            traffic: "Low",
            emissions: 4 + Math.random() * 3,
            emissions_interpretation: "This journey has moderate carbon emissions."
          }
        ];

        // Sort routes by emissions
        routes.sort((a, b) => a.emissions - b.emissions);
        
        const routeAnalysisData: RouteAnalysis = {
          origin,
          destination,
          routes,
          eco_recommended_route: routes[0].name,
          eco_savings: {
            vs_worst_route: routes[routes.length - 1].emissions - routes[0].emissions,
            percentage: ((routes[routes.length - 1].emissions - routes[0].emissions) / routes[routes.length - 1].emissions) * 100
          }
        };

        // Generate alternatives data
        const alternatives: AlternativeVehicle[] = [
          { vehicle: "Car (Petrol)", emissions: 3.5 + Math.random() * 1.5, is_eco_friendly: false },
          { vehicle: "Car (Diesel)", emissions: 3.2 + Math.random() * 1, is_eco_friendly: false },
          { vehicle: "Car (Electric)", emissions: 1 + Math.random() * 0.5, is_eco_friendly: true },
          { vehicle: "Bus", emissions: 1.5 + Math.random() * 1, is_eco_friendly: true },
          { vehicle: "Motorcycle", emissions: 2 + Math.random() * 1, is_eco_friendly: true },
          { vehicle: "Bicycle", emissions: 0, is_eco_friendly: true },
          { vehicle: "Walking", emissions: 0, is_eco_friendly: true }
        ];
        
        // Sort alternatives by emissions
        alternatives.sort((a, b) => a.emissions - b.emissions);
        
        const alternativesData: AlternativesAnalysis = {
          alternatives,
          eco_recommended: alternatives[0].vehicle
        };

        setRouteAnalysis(routeAnalysisData);
        setAlternativesAnalysis(alternativesData);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error calculating routes:", error);
      setIsLoading(false);
    }
  };

  const getEmissionColor = (emissions: number) => {
    if (emissions === 0) return "text-green-600";
    if (emissions < 2) return "text-green-500";
    if (emissions < 4) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Route Planner
          </CardTitle>
          <CardDescription>
            Find the most eco-friendly route for your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="origin" className="text-sm font-medium">
                  Origin
                </label>
                <Input
                  id="origin"
                  placeholder="Starting point"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">
                  Destination
                </label>
                <Input
                  id="destination"
                  placeholder="Ending point"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="vehicleType" className="text-sm font-medium">
                  Vehicle Type
                </label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type
                </label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="mileage" className="text-sm font-medium">
                  Mileage (km/L)
                </label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="Mileage in km/L"
                  min="0.1"
                  step="0.1"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Calculating Routes..." : "Calculate Routes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {routeAnalysis && (
        <>
          <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Route Options</CardTitle>
              <CardDescription>
                From {routeAnalysis.origin} to {routeAnalysis.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routeAnalysis.routes.map((route, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${route.name === routeAnalysis.eco_recommended_route 
                      ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20' 
                      : 'border-border/50 bg-card'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{route.name}</h3>
                        {route.name === routeAnalysis.eco_recommended_route && (
                          <Badge className="ml-2 bg-green-500" variant="secondary">
                            <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly
                          </Badge>
                        )}
                      </div>
                      <div className={`font-bold ${getEmissionColor(route.emissions)}`}>
                        {route.emissions.toFixed(2)} kg CO₂
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Distance:</span> {route.distance.toFixed(1)} km
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span> {route.time.toFixed(0)} min
                      </div>
                      <div>
                        <span className="text-muted-foreground">Traffic:</span> {route.traffic}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {route.emissions_interpretation}
                    </p>
                  </div>
                ))}
                
                <div className="mt-4 p-4 rounded-lg bg-primary/10">
                  <h3 className="font-medium mb-2">Eco-Friendly Choice</h3>
                  <p className="text-sm mb-2">
                    By choosing {routeAnalysis.eco_recommended_route}, you can save approximately{' '}
                    <span className="font-bold text-primary">
                      {routeAnalysis.eco_savings.vs_worst_route.toFixed(2)} kg
                    </span>{' '}
                    of CO₂ emissions ({routeAnalysis.eco_savings.percentage.toFixed(1)}% reduction).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {alternativesAnalysis && (
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Alternative Transportation</CardTitle>
                <CardDescription>
                  Consider these eco-friendly alternatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alternativesAnalysis.alternatives.map((alt, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card"
                    >
                      <div className="flex items-center">
                        {alt.vehicle.includes("Car") ? (
                          <Car className="h-5 w-5 mr-2 text-primary" />
                        ) : alt.vehicle.includes("Bicycle") || alt.vehicle.includes("Walking") ? (
                          <Bike className="h-5 w-5 mr-2 text-green-500" />
                        ) : (
                          <Navigation className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <span>{alt.vehicle}</span>
                        {alt.is_eco_friendly && (
                          <Badge className="ml-2 bg-green-500" variant="secondary">
                            <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly
                          </Badge>
                        )}
                      </div>
                      <div className={`font-bold ${getEmissionColor(alt.emissions)}`}>
                        {alt.emissions.toFixed(2)} kg CO₂
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-primary/10">
                  <h3 className="font-medium mb-2">Most Eco-Friendly Option</h3>
                  <p className="text-sm">
                    <span className="font-bold text-primary">{alternativesAnalysis.eco_recommended}</span>{' '}
                    is the most environmentally friendly mode of transportation for this route.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default RoutePlannerForm;
