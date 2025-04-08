
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CarbonActivity } from '@/lib/carbon-utils';
import CategoryIcon from './CategoryIcon';
import { format } from 'date-fns';

interface CarbonActivityCardProps {
  activity: CarbonActivity;
}

const CarbonActivityCard: React.FC<CarbonActivityCardProps> = ({ activity }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
          <CategoryIcon 
            category={activity.type} 
            subtype={activity.subtype} 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium capitalize">
                {activity.subtype} {activity.type === 'transportation' ? 'travel' : ''}
              </h4>
              <p className="text-sm text-muted-foreground">
                {activity.value} {activity.unit} • {format(activity.date, 'MMM d')}
              </p>
            </div>
            <div className="text-right">
              <span className="font-semibold">{activity.carbonKg.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground ml-1">kg CO₂</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonActivityCard;
