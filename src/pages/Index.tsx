import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, AlertTriangle, Plus, User, LogOut, Gift, Trophy, Award, Star, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CarbonActivityCard from '@/components/CarbonActivityCard';
import MicroHabitCard from '@/components/MicroHabitCard';
import CarbonChart from '@/components/CarbonChart';
import UserProgress from '@/components/UserProgress';
import DayTracker from '@/components/DayTracker';
import CarbonActivityForm from '@/components/CarbonActivityForm';
import Footer from '@/components/Footer';
import {
  CarbonActivity,
  MOCK_ACTIVITIES,
  MOCK_USER,
  MicroHabit,
  getRandomMicroHabits,
  UserProfile
} from '@/lib/carbon-utils';
import { useToast } from '@/hooks/use-toast';

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

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CarbonActivity[]>(MOCK_ACTIVITIES);
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('carbonCompanionUser');
    
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      
      // Initialize redeemedRewards if it doesn't exist
      if (!userObj.redeemedRewards) {
        userObj.redeemedRewards = [];
      }
      
      setUser(userObj);
    } else {
      // Default to MOCK_USER if no stored user
      const mockUserWithRewards = {
        ...MOCK_USER,
        redeemedRewards: []
      };
      setUser(mockUserWithRewards);
    }
  }, []);
  
  useEffect(() => {
    if (!user) return;
    
    // Get personalized micro-habits based on user's activities
    const suggestedHabits = getRandomMicroHabits(6, activities);
    
    // Mark those that have been adopted
    const habitsWithAdoptionStatus = suggestedHabits.map(habit => ({
      ...habit,
      isAdopted: user.adoptedHabits.includes(habit.id)
    }));
    
    setHabits(habitsWithAdoptionStatus);
    
    // Initialize rewards
    setRewards([
      {
        id: '1',
        title: '5% Off Eco Store',
        description: 'Get 5% off your next purchase at participating eco-friendly stores',
        pointCost: 200,
        icon: <Gift className="h-8 w-8 text-green-500" />,
        category: 'voucher',
        isAvailable: user.points >= 200,
      },
      {
        id: '2',
        title: 'Tree Planter Badge',
        description: 'Earn this badge after adopting 5 eco-habits',
        pointCost: 100,
        icon: <Award className="h-8 w-8 text-green-500" />,
        category: 'badge',
        isAvailable: user.points >= 100,
      },
      {
        id: '3',
        title: 'Carbon Conscious Tier',
        description: 'Unlock advanced features and exclusive rewards',
        pointCost: 500,
        icon: <Trophy className="h-8 w-8 text-amber-500" />,
        category: 'tier',
        isAvailable: user.points >= 500,
      },
      {
        id: '4',
        title: 'Carbon Neutral Certificate',
        description: 'Digital certificate recognizing your carbon reduction efforts',
        pointCost: 300,
        icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
        category: 'badge',
        isAvailable: user.points >= 300,
      },
      {
        id: '5',
        title: '10% Off Public Transit',
        description: 'Discount on monthly public transportation passes',
        pointCost: 400,
        icon: <Gift className="h-8 w-8 text-green-500" />,
        category: 'voucher',
        isAvailable: user.points >= 400,
      },
      {
        id: '6',
        title: 'Eco Warrior Badge',
        description: 'Awarded for consistent carbon reduction over 30 days',
        pointCost: 250,
        icon: <Star className="h-8 w-8 text-yellow-500" />,
        category: 'badge',
        isAvailable: user.points >= 250,
      },
    ]);
  }, [activities, user?.adoptedHabits, user?.points]);
  
  const handleAddActivity = (activity: CarbonActivity) => {
    setActivities(prev => [activity, ...prev]);
  };
  
  const handleAdoptHabit = (habitId: string) => {
    if (!user) return;
    
    // Update user's adopted habits
    const updatedUser = {
      ...user,
      adoptedHabits: [...user.adoptedHabits, habitId],
      points: user.points + 10,
      totalSavedKg: user.totalSavedKg + (habits.find(h => h.id === habitId)?.potentialSavingKg || 0)
    };
    
    setUser(updatedUser);
    
    // If logged in, update localStorage
    localStorage.setItem('carbonCompanionUser', JSON.stringify(updatedUser));
    
    // Update habits list to show as adopted
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId
          ? { ...habit, isAdopted: true }
          : habit
      )
    );
    
    // Update rewards availability based on new points
    setRewards(prev => 
      prev.map(reward => ({
        ...reward,
        isAvailable: updatedUser.points >= reward.pointCost,
      }))
    );
    
    toast({
      title: "Habit adopted!",
      description: "Keep it up! You've earned 10 points.",
    });
  };
  
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
    
    // Update rewards availability based on new points
    setRewards(prev => 
      prev.map(reward => ({
        ...reward,
        isAvailable: updatedUser.points >= reward.pointCost,
      }))
    );
    
    toast({
      title: 'Reward redeemed!',
      description: `You've successfully redeemed: ${reward.title}`,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('carbonCompanionUser');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };
  
  // Calculate quick stats
  const totalCarbon = activities.reduce((sum, activity) => sum + activity.carbonKg, 0);
  const todayCarbon = activities
    .filter(a => {
      const today = new Date();
      const activityDate = new Date(a.date);
      return activityDate.getDate() === today.getDate() &&
             activityDate.getMonth() === today.getMonth() &&
             activityDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, activity) => sum + activity.carbonKg, 0);
  
  // Calculate next tier for rewards
  const currentPoints = user?.points || 0;
  const nextTier = {
    name: 'Carbon Conscious',
    points: 500,
    progress: Math.min((currentPoints / 500) * 100, 100),
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-500" />
            <h1 className="text-xl font-bold">Carbon Companion</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CarbonActivityForm onAddActivity={handleAddActivity} />
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('rewards')}>
                  <Gift className="h-4 w-4 mr-2" />
                  Rewards ({user.points} points)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="bg-muted border-b">
        <div className="container">
          <div className="flex overflow-x-auto">
            <Button 
              variant={activeTab === 'dashboard' ? "default" : "ghost"} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'dashboard' ? 'active' : undefined}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'activities' ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'activities' ? 'active' : undefined}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </Button>
            <Button 
              variant={activeTab === 'habits' ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'habits' ? 'active' : undefined}
              onClick={() => setActiveTab('habits')}
            >
              Eco-Habits
            </Button>
            <Button 
              variant={activeTab === 'rewards' ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'rewards' ? 'active' : undefined}
              onClick={() => setActiveTab('rewards')}
            >
              Rewards
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User progress card */}
              <UserProgress user={user} />
              
              {/* Day Tracker */}
              <DayTracker activities={activities} />
              
              {/* Quick stats */}
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Carbon Impact</h3>
                <p className="text-3xl font-bold eco-gradient-text">{totalCarbon.toFixed(1)} kg CO₂</p>
                <p className="text-sm text-muted-foreground mt-2">
                  From {activities.length} tracked activities
                </p>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CarbonChart 
                activities={activities} 
                chartType="daily" 
                title="Daily Carbon Footprint" 
              />
              <CarbonChart 
                activities={activities} 
                chartType="category" 
                title="Carbon by Category" 
              />
            </div>
            
            {/* Suggested habits */}
            <div>
              <h2 className="text-xl font-bold mb-4">Suggested Eco Habits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {habits.slice(0, 3).map(habit => (
                  <MicroHabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onAdopt={handleAdoptHabit}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Activities</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CarbonActivityForm onAddActivity={handleAddActivity} />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map(activity => (
                <CarbonActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </TabsContent>
          
          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Eco Habits</h2>
              <p className="text-muted-foreground mb-6">
                These personalized habits are selected based on your carbon footprint to help you reduce your impact.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map(habit => (
                  <MicroHabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onAdopt={handleAdoptHabit}
                  />
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-lg mb-2">You've saved</p>
                <p className="text-4xl font-bold eco-gradient-text mb-2">{user.totalSavedKg} kg CO₂</p>
                <p className="text-sm text-muted-foreground">
                  That's like taking {Math.round(user.totalSavedKg / 20)} trees' worth of CO₂ out of the atmosphere!
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
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
                    onClick={() => setActiveTab('dashboard')}
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
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
