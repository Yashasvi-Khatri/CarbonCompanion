
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/lib/carbon-utils';
import { useToast } from '@/hooks/use-toast';
import { Gift, Trophy, Award, Star, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  icon: React.ReactNode;
  category: 'voucher' | 'badge' | 'tier';
  isAvailable: boolean;
}

interface ExtendedUserProfile extends Omit<UserProfile, 'name'> {
  redeemedRewards?: string[];
  email?: string;
  name: string;
}

const Rewards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('carbonCompanionUser');
    
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userObj = JSON.parse(storedUser);
    
    // Initialize redeemedRewards if it doesn't exist
    if (!userObj.redeemedRewards) {
      userObj.redeemedRewards = [];
    }
    
    setUser(userObj);
    
    // Mock rewards data
    setRewards([
      {
        id: '1',
        title: '5% Off Eco Store',
        description: 'Get 5% off your next purchase at participating eco-friendly stores',
        pointCost: 200,
        icon: <Gift className="h-8 w-8 text-green-500" />,
        category: 'voucher',
        isAvailable: userObj.points >= 200,
      },
      {
        id: '2',
        title: 'Tree Planter Badge',
        description: 'Earn this badge after adopting 5 eco-habits',
        pointCost: 100,
        icon: <Award className="h-8 w-8 text-green-500" />,
        category: 'badge',
        isAvailable: userObj.points >= 100,
      },
      {
        id: '3',
        title: 'Carbon Conscious Tier',
        description: 'Unlock advanced features and exclusive rewards',
        pointCost: 500,
        icon: <Trophy className="h-8 w-8 text-amber-500" />,
        category: 'tier',
        isAvailable: userObj.points >= 500,
      },
      {
        id: '4',
        title: 'Carbon Neutral Certificate',
        description: 'Digital certificate recognizing your carbon reduction efforts',
        pointCost: 300,
        icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
        category: 'badge',
        isAvailable: userObj.points >= 300,
      },
      {
        id: '5',
        title: '10% Off Public Transit',
        description: 'Discount on monthly public transportation passes',
        pointCost: 400,
        icon: <Gift className="h-8 w-8 text-green-500" />,
        category: 'voucher',
        isAvailable: userObj.points >= 400,
      },
      {
        id: '6',
        title: 'Eco Warrior Badge',
        description: 'Awarded for consistent carbon reduction over 30 days',
        pointCost: 250,
        icon: <Star className="h-8 w-8 text-yellow-500" />,
        category: 'badge',
        isAvailable: userObj.points >= 250,
      },
    ]);
  }, [navigate]);

  const handleRedeemReward = (reward: Reward) => {
    if (!user || user.points < reward.pointCost) {
      toast({
        title: 'Not enough points',
        description: `You need ${reward.pointCost - (user?.points || 0)} more points to redeem this reward.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Update user points
    const updatedUser = {
      ...user,
      points: user.points - reward.pointCost,
      redeemedRewards: [...(user.redeemedRewards || []), reward.id],
    };
    
    setUser(updatedUser);
    localStorage.setItem('carbonCompanionUser', JSON.stringify(updatedUser));
    
    toast({
      title: 'Reward redeemed!',
      description: `You've successfully redeemed: ${reward.title}`,
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Calculate next tier
  const currentPoints = user.points;
  const nextTier = {
    name: 'Carbon Conscious',
    points: 500,
    progress: Math.min((currentPoints / 500) * 100, 100),
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Rewards & Achievements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Your Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold eco-gradient-text">{user.points}</span>
              <span className="text-muted-foreground">carbon points</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Progress to next tier</span>
                <span className="text-sm font-medium">{nextTier.progress.toFixed(0)}%</span>
              </div>
              <Progress value={nextTier.progress} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Current</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{nextTier.name}</span>
                  <Trophy className="h-3 w-3 text-amber-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Earn More</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Complete 7-day streak</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                <span className="text-sm">Adopt 3 more eco-habits</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                <span className="text-sm">Reduce weekly emissions by 5%</span>
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/')}
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className={!reward.isAvailable ? 'opacity-70' : ''}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  {reward.icon}
                </div>
                <Badge variant={reward.isAvailable ? 'default' : 'outline'}>
                  {reward.pointCost} points
                </Badge>
              </div>
              
              <h3 className="font-medium text-lg mb-2">{reward.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reward.description}
              </p>
              
              <Badge className="mb-4" variant="outline">
                {reward.category === 'voucher' ? 'Discount Voucher' : 
                 reward.category === 'badge' ? 'Achievement Badge' : 'Membership Tier'}
              </Badge>
              
              <Button 
                className="w-full" 
                variant={reward.isAvailable ? 'default' : 'outline'}
                disabled={!reward.isAvailable}
                onClick={() => handleRedeemReward(reward)}
              >
                {reward.isAvailable ? 'Redeem Reward' : `Need ${reward.pointCost - user.points} more points`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
