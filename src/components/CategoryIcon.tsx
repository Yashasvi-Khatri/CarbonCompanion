
import React from 'react';
import { 
  Bus, Car, Train, Plane, Footprints, Bike,
  Beef, Fish, Egg, Apple, Salad, 
  Home, Lightbulb, Plug, Droplets,
  ShoppingBag, Package, Shirt, Smartphone,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CategoryIconProps = {
  category: string;
  subtype?: string;
  className?: string;
  size?: number;
};

const iconMap: Record<string, Record<string, LucideIcon>> = {
  transportation: {
    default: Car,
    car: Car,
    bus: Bus,
    train: Train,
    plane: Plane,
    walk: Footprints,
    bike: Bike,
  },
  food: {
    default: Salad,
    beef: Beef,
    fish: Fish,
    eggs: Egg,
    fruits: Apple,
    vegetables: Salad,
  },
  home: {
    default: Home,
    electricity: Lightbulb,
    naturalGas: Plug,
    water: Droplets,
  },
  shopping: {
    default: ShoppingBag,
    clothing: Shirt,
    electronics: Smartphone,
    plastics: Package,
    paper: Package,
  },
};

const iconColorMap: Record<string, string> = {
  transportation: 'text-sky-500',
  food: 'text-green-500',
  home: 'text-earth-500',
  shopping: 'text-purple-500',
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  subtype, 
  className,
  size = 20
}) => {
  const categoryIcons = iconMap[category] || { default: ShoppingBag };
  const Icon = (subtype && categoryIcons[subtype]) || categoryIcons.default;
  const colorClass = iconColorMap[category] || 'text-primary';
  
  return (
    <Icon 
      className={cn(colorClass, className)} 
      size={size} 
    />
  );
};

export default CategoryIcon;
