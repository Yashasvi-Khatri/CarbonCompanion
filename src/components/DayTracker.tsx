
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { CarbonActivity } from '@/lib/carbon-utils';

interface DayTrackerProps {
  activities: CarbonActivity[];
  dailyGoal?: number;
}

const DayTracker: React.FC<DayTrackerProps> = ({ 
  activities,
  dailyGoal = 10 // 10kg CO2 default daily goal
}) => {
  const [todayActivities, setTodayActivities] = useState<CarbonActivity[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [percentOfGoal, setPercentOfGoal] = useState(0);
  
  useEffect(() => {
    // Filter today's activities
    const today = new Date();
    const filtered = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === today.getDate() &&
        activityDate.getMonth() === today.getMonth() &&
        activityDate.getFullYear() === today.getFullYear()
      );
    });
    
    setTodayActivities(filtered);
    
    // Calculate today's total carbon
    const total = filtered.reduce((sum, activity) => sum + activity.carbonKg, 0);
    setTodayTotal(total);
    
    // Calculate percentage of daily goal
    setPercentOfGoal(Math.min((total / dailyGoal) * 100, 100));
  }, [activities, dailyGoal]);
  
  // Status based on percentage of goal
  const getStatusColor = () => {
    if (percentOfGoal <= 50) return 'text-green-500';
    if (percentOfGoal <= 85) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getStatusText = () => {
    if (percentOfGoal <= 50) return 'Great! Well below daily target';
    if (percentOfGoal <= 85) return 'Good progress, stay mindful';
    return 'Above daily target';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Carbon Tracker
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(new Date(), 'EEE, MMM d')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Daily usage</span>
              <span className="font-medium">{todayTotal.toFixed(1)} kg CO₂</span>
            </div>
            <Progress value={percentOfGoal} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0 kg</span>
              <span className="text-xs text-muted-foreground">Goal: {dailyGoal} kg</span>
            </div>
          </div>
          
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Today's Activities</h4>
            {todayActivities.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {todayActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between text-sm border-b pb-1">
                    <span>{activity.subtype} ({activity.value} {activity.unit})</span>
                    <span className="font-medium">{activity.carbonKg.toFixed(1)} kg</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No activities logged today
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayTracker;
