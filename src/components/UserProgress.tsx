
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from '@/lib/carbon-utils';
import { Award, Flame } from 'lucide-react';

interface UserProgressProps {
  user: UserProfile;
}

const UserProgress: React.FC<UserProgressProps> = ({ user }) => {
  const nextLevelPoints = (user.level) * 100;
  const progressPercentage = (user.points / nextLevelPoints) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Level {user.level}</p>
              <p className="text-xs text-muted-foreground">
                {user.points} / {nextLevelPoints} points to next level
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold">{user.streakDays} day streak</p>
            </div>
          </div>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2 mb-4" 
        />
        
        <div className="mt-4 p-3 bg-secondary rounded-lg text-center">
          <p className="text-sm font-medium">You've saved</p>
          <p className="text-2xl font-bold eco-gradient-text">{user.totalSavedKg} kg CO₂</p>
          <p className="text-xs text-muted-foreground mt-1">
            That's like planting {Math.round(user.totalSavedKg / 20)} trees! 🌳
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProgress;
