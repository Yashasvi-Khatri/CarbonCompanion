
export interface CarbonActivity {
  id: string;
  type: 'transportation' | 'food' | 'home' | 'shopping';
  subtype: string;
  value: number;
  unit: string;
  date: Date;
  carbonKg: number;
}

export interface MicroHabit {
  id: string;
  title: string;
  description: string;
  category: 'transportation' | 'food' | 'home' | 'shopping';
  potentialSavingKg: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  isAdopted?: boolean;
}

const CARBON_FACTORS = {
  transportation: {
    car: 0.192, // kg CO2 per km
    bus: 0.105, // kg CO2 per km
    train: 0.041, // kg CO2 per km
    plane: 0.255, // kg CO2 per km
    walk: 0, // kg CO2 per km
    bike: 0, // kg CO2 per km
  },
  food: {
    beef: 27, // kg CO2 per kg
    lamb: 39.2, // kg CO2 per kg
    pork: 12.1, // kg CO2 per kg
    chicken: 6.9, // kg CO2 per kg
    fish: 6.1, // kg CO2 per kg
    dairy: 1.9, // kg CO2 per kg
    eggs: 4.8, // kg CO2 per kg
    rice: 2.7, // kg CO2 per kg
    grains: 1.4, // kg CO2 per kg
    vegetables: 0.4, // kg CO2 per kg
    fruits: 0.5, // kg CO2 per kg
  },
  home: {
    electricity: 0.475, // kg CO2 per kWh
    naturalGas: 0.202, // kg CO2 per kWh
    water: 0.344, // kg CO2 per m3
  },
  shopping: {
    clothing: 15, // kg CO2 per item (average)
    electronics: 100, // kg CO2 per item (average)
    plastics: 6, // kg CO2 per kg
    paper: 1.1, // kg CO2 per kg
  },
};

export const calculateCarbonFootprint = (
  type: CarbonActivity['type'],
  subtype: string,
  value: number
): number => {
  if (!CARBON_FACTORS[type] || !CARBON_FACTORS[type][subtype as keyof typeof CARBON_FACTORS[typeof type]]) {
    return 0;
  }
  
  return value * CARBON_FACTORS[type][subtype as keyof typeof CARBON_FACTORS[typeof type]];
};

export const getRandomMicroHabits = (count: number, userActivities: CarbonActivity[]): MicroHabit[] => {
  // Get the user's most carbon-intensive categories
  const categoryCarbonTotal: Record<string, number> = {
    transportation: 0,
    food: 0,
    home: 0,
    shopping: 0,
  };
  
  userActivities.forEach(activity => {
    categoryCarbonTotal[activity.type] += activity.carbonKg;
  });
  
  // Sort categories by carbon intensity
  const sortedCategories = Object.entries(categoryCarbonTotal)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category);
  
  // Weight the habits to focus on high-impact categories
  return MICRO_HABITS
    .sort(() => {
      // Prioritize habits from high-impact categories
      const categoryIndex = (habit: MicroHabit) => 
        sortedCategories.findIndex(category => category === habit.category);
      
      return Math.random() - 0.5 + (categoryIndex({ category: 'transportation' } as MicroHabit) * 0.2);
    })
    .slice(0, count);
};

export const MICRO_HABITS: MicroHabit[] = [
  {
    id: '1',
    title: 'Walk for short trips',
    description: 'Choose walking instead of driving for trips under 1 mile. Good for your health and the planet!',
    category: 'transportation',
    potentialSavingKg: 0.3,
    difficulty: 'easy',
    icon: 'footprints',
  },
  {
    id: '2',
    title: 'Meatless Monday',
    description: 'Skip meat every Monday to reduce your carbon footprint from food consumption.',
    category: 'food',
    potentialSavingKg: 2.5,
    difficulty: 'medium',
    icon: 'salad',
  },
  {
    id: '3',
    title: 'Unplug electronics',
    description: 'Unplug chargers and electronics when not in use to reduce phantom energy use.',
    category: 'home',
    potentialSavingKg: 0.1,
    difficulty: 'easy',
    icon: 'plug',
  },
  {
    id: '4',
    title: 'Reusable shopping bags',
    description: 'Bring your own bags when shopping to reduce plastic waste.',
    category: 'shopping',
    potentialSavingKg: 0.2,
    difficulty: 'easy',
    icon: 'shopping-bag',
  },
  {
    id: '5',
    title: 'Public transport day',
    description: 'Use public transportation instead of driving once a week.',
    category: 'transportation',
    potentialSavingKg: 3.2,
    difficulty: 'medium',
    icon: 'bus',
  },
  {
    id: '6',
    title: 'Eat local produce',
    description: 'Choose locally grown fruits and vegetables to reduce transportation emissions.',
    category: 'food',
    potentialSavingKg: 0.4,
    difficulty: 'medium',
    icon: 'apple',
  },
  {
    id: '7',
    title: 'Lower thermostat',
    description: 'Reduce your home temperature by 1°C/2°F to save energy.',
    category: 'home',
    potentialSavingKg: 0.5,
    difficulty: 'easy',
    icon: 'thermometer',
  },
  {
    id: '8',
    title: 'Second-hand shopping',
    description: 'Buy second-hand items instead of new when possible.',
    category: 'shopping',
    potentialSavingKg: 10,
    difficulty: 'medium',
    icon: 'recycle',
  },
  {
    id: '9',
    title: 'Carpool to work',
    description: 'Share rides with colleagues to reduce per-person emissions.',
    category: 'transportation',
    potentialSavingKg: 5,
    difficulty: 'medium',
    icon: 'users',
  },
  {
    id: '10',
    title: 'Plant-based dinner',
    description: 'Try a plant-based dinner recipe twice a week.',
    category: 'food',
    potentialSavingKg: 1.8,
    difficulty: 'medium',
    icon: 'utensils',
  },
  {
    id: '11',
    title: 'Shorter showers',
    description: 'Reduce shower time by 2 minutes to save water and energy.',
    category: 'home',
    potentialSavingKg: 0.3,
    difficulty: 'easy',
    icon: 'shower',
  },
  {
    id: '12',
    title: 'Bulk buying',
    description: 'Buy non-perishable items in bulk to reduce packaging waste.',
    category: 'shopping',
    potentialSavingKg: 0.3,
    difficulty: 'easy',
    icon: 'box',
  },
];

// Mock data for the app
export const MOCK_ACTIVITIES: CarbonActivity[] = [
  {
    id: '1',
    type: 'transportation',
    subtype: 'car',
    value: 15,
    unit: 'km',
    date: new Date(2025, 3, 5),
    carbonKg: 2.88,
  },
  {
    id: '2',
    type: 'transportation',
    subtype: 'bus',
    value: 10,
    unit: 'km',
    date: new Date(2025, 3, 4),
    carbonKg: 1.05,
  },
  {
    id: '3',
    type: 'food',
    subtype: 'beef',
    value: 0.2,
    unit: 'kg',
    date: new Date(2025, 3, 3),
    carbonKg: 5.4,
  },
  {
    id: '4',
    type: 'food',
    subtype: 'vegetables',
    value: 0.5,
    unit: 'kg',
    date: new Date(2025, 3, 6),
    carbonKg: 0.2,
  },
  {
    id: '5',
    type: 'home',
    subtype: 'electricity',
    value: 10,
    unit: 'kWh',
    date: new Date(2025, 3, 6),
    carbonKg: 4.75,
  },
  {
    id: '6',
    type: 'shopping',
    subtype: 'clothing',
    value: 1,
    unit: 'item',
    date: new Date(2025, 3, 2),
    carbonKg: 15,
  },
  {
    id: '7',
    type: 'transportation',
    subtype: 'train',
    value: 35,
    unit: 'km',
    date: new Date(2025, 3, 1),
    carbonKg: 1.435,
  }
];

export interface UserProfile {
  name: string;
  level: number;
  points: number;
  streakDays: number;
  totalSavedKg: number;
  adoptedHabits: string[];
}

export const MOCK_USER: UserProfile = {
  name: "Alex",
  level: 2,
  points: 145,
  streakDays: 3,
  totalSavedKg: 12.5,
  adoptedHabits: ['2', '4', '7']
};

// Group activities by day
export const groupActivitiesByDay = (activities: CarbonActivity[]): Record<string, CarbonActivity[]> => {
  return activities.reduce((acc, activity) => {
    const dateStr = activity.date.toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(activity);
    return acc;
  }, {} as Record<string, CarbonActivity[]>);
};

// Calculate daily totals for chart
export const getDailyCarbonTotals = (activities: CarbonActivity[]): { date: string; total: number }[] => {
  const groupedActivities = groupActivitiesByDay(activities);
  
  return Object.entries(groupedActivities).map(([date, acts]) => ({
    date,
    total: acts.reduce((sum, act) => sum + act.carbonKg, 0)
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Calculate category totals for pie chart
export const getCategoryCarbonTotals = (activities: CarbonActivity[]): { name: string; value: number }[] => {
  const categories: Record<string, number> = {
    transportation: 0,
    food: 0,
    home: 0,
    shopping: 0,
  };
  
  activities.forEach(activity => {
    categories[activity.type] += activity.carbonKg;
  });
  
  return Object.entries(categories).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2))
  }));
};
