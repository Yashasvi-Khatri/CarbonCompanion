
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, AlertTriangle, Plus, User, LogOut, Gift, Map } from 'lucide-react';
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
import CarbonActivityCard from '@/components/CarbonActivityCard';
import MicroHabitCard from '@/components/MicroHabitCard';
import CarbonChart from '@/components/CarbonChart';
import UserProgress from '@/components/UserProgress';
import DayTracker from '@/components/DayTracker';
import CarbonActivityForm from '@/components/CarbonActivityForm';
import RoutePlannerForm from '@/components/RoutePlannerForm';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Define reward interface
interface Reward {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  icon: React.ReactNode;
  category: 'voucher' | 'badge' | 'tier';
  isAvailable: boolean;
}

// Extend UserProfile type to include redeemedRewards
interface ExtendedUserProfile extends UserProfile {
  redeemedRewards?: string[];
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CarbonActivity[]>(MOCK_ACTIVITIES);
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rewards, setRewards] = useState<Reward[]>([]);
  
  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('carbonCompanionUser');
    
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      // Make sure redeemedRewards exists
      if (!userObj.redeemedRewards) {
        userObj.redeemedRewards = [];
      }
      setUser(userObj);
    } else {
      // Default to MOCK_USER if no stored user
      const mockUserWithRedeemed = {
        ...MOCK_USER,
        redeemedRewards: []
      };
      setUser(mockUserWithRedeemed);
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
    
    // Setup rewards data
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
        icon: <Gift className="h-8 w-8 text-green-500" />,
        category: 'badge',
        isAvailable: user.points >= 100,
      },
      {
        id: '3',
        title: 'Carbon Conscious Tier',
        description: 'Unlock advanced features and exclusive rewards',
        pointCost: 500,
        icon: <Gift className="h-8 w-8 text-amber-500" />,
        category: 'tier',
        isAvailable: user.points >= 500,
      },
    ]);
  }, [activities, user?.adoptedHabits]);
  
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
    
    // Get user's redeemed rewards or initialize empty array
    const redeemedRewards = user.redeemedRewards || [];
    
    // Update user points
    const updatedUser = {
      ...user,
      points: user.points - reward.pointCost,
      redeemedRewards: [...redeemedRewards, reward.id],
    };
    
    setUser(updatedUser);
    localStorage.setItem('carbonCompanionUser', JSON.stringify(updatedUser));
    
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b shadow-sm bg-background">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold eco-gradient-text">Carbon Companion</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full hover:shadow-md transition-all">
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
                <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:shadow-md transition-all">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-lg border border-border/50 bg-card">
                <DropdownMenuItem onClick={() => navigate('/account')} className="rounded-lg hover:bg-primary/10">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/rewards')} className="rounded-lg hover:bg-primary/10">
                  <Gift className="h-4 w-4 mr-2 text-primary" />
                  Rewards ({user.points} points)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg hover:bg-destructive/10">
                  <LogOut className="h-4 w-4 mr-2 text-destructive" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="bg-muted/50 border-b">
        <div className="container">
          <div className="flex overflow-x-auto pb-1 pt-1">
            {/* Wrap the TabsList in a Tabs component */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent flex justify-start w-full gap-1">
                <TabsTrigger 
                  value="dashboard"
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="activities"
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger 
                  value="habits"
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Eco-Habits
                </TabsTrigger>
                <TabsTrigger 
                  value="rewards"
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Rewards
                </TabsTrigger>
                <TabsTrigger 
                  value="routeplanner"
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Route Planner
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User progress card */}
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <UserProgress user={user} />
                </CardContent>
              </Card>
              
              {/* Day Tracker */}
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <DayTracker activities={activities} />
                </CardContent>
              </Card>
              
              {/* Quick stats */}
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden bg-gradient-to-br from-secondary to-secondary/60">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Carbon Impact</h3>
                  <p className="text-3xl font-bold eco-gradient-text">{totalCarbon.toFixed(1)} kg CO₂</p>
                  <div className="flex items-center mt-4 text-sm text-muted-foreground">
                    <Leaf className="h-4 w-4 mr-2 text-green-500" />
                    <span>From {activities.length} tracked activities</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Daily Carbon Footprint</CardTitle>
                </CardHeader>
                <CardContent>
                  <CarbonChart 
                    activities={activities} 
                    chartType="daily" 
                    title="" 
                  />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Carbon by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <CarbonChart 
                    activities={activities} 
                    chartType="category" 
                    title="" 
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Suggested habits */}
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Suggested Eco Habits</CardTitle>
                <CardDescription>Small changes that make a big difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {habits.slice(0, 3).map(habit => (
                    <MicroHabitCard 
                      key={habit.id} 
                      habit={habit} 
                      onAdopt={handleAdoptHabit}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  className="ml-auto text-primary hover:text-primary/80"
                  onClick={() => setActiveTab('habits')}
                >
                  View all habits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Your Activities</CardTitle>
                    <CardDescription>Track and monitor your carbon footprint</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <CarbonActivityForm onAddActivity={handleAddActivity} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map(activity => (
                    <CarbonActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Eco Habits</CardTitle>
                <CardDescription>
                  These personalized habits are selected based on your carbon footprint to help you reduce your impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habits.map(habit => (
                    <MicroHabitCard 
                      key={habit.id} 
                      habit={habit} 
                      onAdopt={handleAdoptHabit}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-lg mb-2">You've saved</p>
                <p className="text-4xl font-bold eco-gradient-text mb-4">{user.totalSavedKg} kg CO₂</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  That's like taking {Math.round(user.totalSavedKg / 20)} trees' worth of CO₂ out of the atmosphere!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="col-span-1 md:col-span-3 shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardContent className="pt-6">
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
                        <Gift className="h-3 w-3 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-4">Earn More</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 bg-primary/5 p-2 rounded-lg">
                      <Gift className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Complete 7-day streak</span>
                    </li>
                    <li className="flex items-start gap-2 bg-primary/5 p-2 rounded-lg">
                      <Gift className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span className="text-sm">Adopt 3 more eco-habits</span>
                    </li>
                    <li className="flex items-start gap-2 bg-primary/5 p-2 rounded-lg">
                      <Gift className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Reduce weekly emissions by 5%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Available Rewards</CardTitle>
                <CardDescription>Redeem your points for these eco-friendly rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <Card key={reward.id} className={`shadow-sm border border-border/50 overflow-hidden 
                      ${!reward.isAvailable ? 'opacity-70' : 'hover:shadow-md transition-all'}`}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {reward.icon}
                          </div>
                          <Badge variant={reward.isAvailable ? 'default' : 'outline'} className="rounded-full">
                            {reward.pointCost} points
                          </Badge>
                        </div>
                        
                        <h3 className="font-medium text-lg mb-2">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {reward.description}
                        </p>
                        
                        <Badge className="mb-4 rounded-full" variant="outline">
                          {reward.category === 'voucher' ? 'Discount Voucher' : 
                          reward.category === 'badge' ? 'Achievement Badge' : 'Membership Tier'}
                        </Badge>
                        
                        <Button 
                          className="w-full rounded-full" 
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Route Planner Tab */}
          <TabsContent value="routeplanner" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <span>Eco-Friendly Route Planner</span>
                </h2>
                <p className="text-muted-foreground">Find the most environmentally friendly route for your journey</p>
              </div>
            </div>
            
            <RoutePlannerForm onCalculateRoutes={(routeData) => {
              // In a real app, this would make an API call to your backend
              // The mock data is generated in the RoutePlannerForm component
              
              // Points for using the route planner (a small incentive)
              if (user) {
                const updatedUser = {
                  ...user,
                  points: user.points + 2
                };
                setUser(updatedUser);
                localStorage.setItem('carbonCompanionUser', JSON.stringify(updatedUser));
                
                toast({
                  title: "Route planning complete!",
                  description: "You've earned 2 points for planning an eco-friendly route.",
                });
              }
            }} />
            
            <Card className="shadow-sm hover:shadow-md transition-all border border-border/50 overflow-hidden bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Why Plan Your Route?</h3>
                    <p className="text-sm text-muted-foreground">
                      Different routes can have significantly different carbon footprints. By choosing the most eco-friendly route, 
                      you can reduce your emissions by up to 30% compared to the most carbon-intensive option.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-white/70 dark:bg-background/70 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">↓15%</p>
                        <p className="text-xs text-muted-foreground">Average CO₂ Reduction</p>
                      </div>
                      <div className="text-center p-3 bg-white/70 dark:bg-background/70 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">↓8%</p>
                        <p className="text-xs text-muted-foreground">Avg. Fuel Savings</p>
                      </div>
                      <div className="text-center p-3 bg-white/70 dark:bg-background/70 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">+5min</p>
                        <p className="text-xs text-muted-foreground">Typical Time Trade-off</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;