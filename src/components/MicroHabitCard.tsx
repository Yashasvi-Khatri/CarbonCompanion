
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MicroHabit } from '@/lib/carbon-utils';
import { 
  Footprints, Salad, Plug, ShoppingBag, Bus, Apple, 
  Thermometer, Recycle, Users, Utensils, Droplet, Box, Check
} from 'lucide-react';

interface MicroHabitCardProps {
  habit: MicroHabit;
  onAdopt?: (habitId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'footprints': <Footprints className="h-5 w-5" />,
  'salad': <Salad className="h-5 w-5" />,
  'plug': <Plug className="h-5 w-5" />,
  'shopping-bag': <ShoppingBag className="h-5 w-5" />,
  'bus': <Bus className="h-5 w-5" />,
  'apple': <Apple className="h-5 w-5" />,
  'thermometer': <Thermometer className="h-5 w-5" />,
  'recycle': <Recycle className="h-5 w-5" />,
  'users': <Users className="h-5 w-5" />,
  'utensils': <Utensils className="h-5 w-5" />,
  'shower': <Droplet className="h-5 w-5" />,
  'box': <Box className="h-5 w-5" />,
};

const categoryColorMap: Record<string, string> = {
  'transportation': 'bg-sky-100 text-sky-700',
  'food': 'bg-green-100 text-green-700',
  'home': 'bg-earth-100 text-earth-700',
  'shopping': 'bg-purple-100 text-purple-700',
};

const difficultyMap: Record<string, string> = {
  'easy': 'bg-green-100 text-green-700',
  'medium': 'bg-earth-100 text-earth-700',
  'hard': 'bg-red-100 text-red-700',
};

const MicroHabitCard: React.FC<MicroHabitCardProps> = ({ habit, onAdopt }) => {
  const categoryClass = categoryColorMap[habit.category] || 'bg-gray-100 text-gray-700';
  const difficultyClass = difficultyMap[habit.difficulty] || 'bg-gray-100 text-gray-700';
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${categoryClass}`}>
            {iconMap[habit.icon] || <ShoppingBag className="h-5 w-5" />}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium">{habit.title}</h4>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryClass}`}>
                {habit.category}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyClass}`}>
                {habit.difficulty}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {habit.description}
        </p>
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-sm font-semibold">Save </span>
            <span className="text-green-600 font-semibold">{habit.potentialSavingKg} kg CO₂</span>
          </div>
          
          {!habit.isAdopted ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAdopt && onAdopt(habit.id)}
              className="transition-all hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              Adopt
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <Check className="h-4 w-4" />
              <span>Adopted</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MicroHabitCard;
