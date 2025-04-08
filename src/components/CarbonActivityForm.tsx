
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateCarbonFootprint } from '@/lib/carbon-utils';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface CarbonActivityFormProps {
  onAddActivity: (activity: any) => void;
}

const CarbonActivityForm: React.FC<CarbonActivityFormProps> = ({ onAddActivity }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [activityType, setActivityType] = useState<string>('transportation');
  const [activitySubtype, setActivitySubtype] = useState<string>('');
  const [activityValue, setActivityValue] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [miscDescription, setMiscDescription] = useState<string>('');
  
  const typeOptions = {
    transportation: {
      subtypes: ['car', 'bus', 'train', 'plane', 'walk', 'bike'],
      unit: 'km',
      label: 'Distance'
    },
    food: {
      subtypes: ['beef', 'lamb', 'pork', 'chicken', 'fish', 'dairy', 'eggs', 'rice', 'grains', 'vegetables', 'fruits'],
      unit: 'kg',
      label: 'Weight'
    },
    home: {
      subtypes: ['electricity', 'naturalGas', 'water'],
      unit: activitySubtype === 'water' ? 'm³' : 'kWh',
      label: activitySubtype === 'water' ? 'Volume' : 'Energy'
    },
    shopping: {
      subtypes: ['clothing', 'electronics', 'plastics', 'paper'],
      unit: ['clothing', 'electronics'].includes(activitySubtype) ? 'item' : 'kg',
      label: ['clothing', 'electronics'].includes(activitySubtype) ? 'Quantity' : 'Weight'
    },
    miscellaneous: {
      subtypes: ['other'],
      unit: 'kg',
      label: 'Estimated CO₂'
    }
  };

  const handleTypeChange = (value: string) => {
    setActivityType(value);
    setActivitySubtype('');
    setUnit('');
  };

  const handleSubtypeChange = (value: string) => {
    setActivitySubtype(value);
    
    // Set appropriate unit based on subtype
    if (activityType === 'transportation') {
      setUnit('km');
    } else if (activityType === 'food') {
      setUnit('kg');
    } else if (activityType === 'home') {
      setUnit(value === 'water' ? 'm³' : 'kWh');
    } else if (activityType === 'shopping') {
      setUnit(['clothing', 'electronics'].includes(value) ? 'item' : 'kg');
    } else if (activityType === 'miscellaneous') {
      setUnit('kg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType || !activitySubtype || !activityValue || parseFloat(activityValue) <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }
    
    const value = parseFloat(activityValue);
    
    // For miscellaneous activities, use the direct CO2 value
    let carbonKg = 0;
    if (activityType === 'miscellaneous') {
      carbonKg = value;
    } else {
      carbonKg = calculateCarbonFootprint(
        activityType as any, 
        activitySubtype, 
        value
      );
    }
    
    const newActivity = {
      id: Date.now().toString(),
      type: activityType,
      subtype: activitySubtype,
      value,
      unit,
      date,
      carbonKg,
      description: activityType === 'miscellaneous' ? miscDescription : '',
    };
    
    onAddActivity(newActivity);
    
    // Reset form
    setActivityValue('');
    setMiscDescription('');
    
    toast({
      title: "Activity added",
      description: `Added ${activitySubtype} with ${carbonKg.toFixed(2)} kg CO₂ impact.`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Add Carbon Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-type">Activity Type</Label>
              <Select 
                value={activityType} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="activity-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity-subtype">Subtype</Label>
              <Select 
                value={activitySubtype} 
                onValueChange={handleSubtypeChange}
                disabled={!activityType}
              >
                <SelectTrigger id="activity-subtype">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {activityType && typeOptions[activityType as keyof typeof typeOptions].subtypes.map(subtype => (
                    <SelectItem key={subtype} value={subtype}>
                      {subtype === 'other' ? 'Other activity' : subtype.charAt(0).toUpperCase() + subtype.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {activityType === 'miscellaneous' && activitySubtype === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="misc-description">Description</Label>
              <Textarea
                id="misc-description"
                placeholder="Describe this activity"
                value={miscDescription}
                onChange={(e) => setMiscDescription(e.target.value)}
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-value">
                {activityType && activitySubtype 
                  ? activityType === 'miscellaneous' 
                    ? 'Carbon Estimate'
                    : typeOptions[activityType as keyof typeof typeOptions].label
                  : 'Value'}
              </Label>
              <div className="flex">
                <Input
                  id="activity-value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={activityValue}
                  onChange={(e) => setActivityValue(e.target.value)}
                  className="rounded-r-none"
                  placeholder="Enter value"
                />
                <div className="bg-muted flex items-center justify-center px-3 border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                  {unit || (activityType === 'miscellaneous' ? 'kg CO₂' : '')}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CarbonActivityForm;
