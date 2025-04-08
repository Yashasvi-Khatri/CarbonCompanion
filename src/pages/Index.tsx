
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, AlertTriangle, Plus, User, LogOut, Gift } from 'lucide-react';
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

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CarbonActivity[]>(MOCK_ACTIVITIES);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('carbonCompanionUser');
    
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
    } else {
      // Default to MOCK_USER if no stored user
      setUser(MOCK_USER);
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
                <DropdownMenuItem onClick={() => navigate('/rewards')}>
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
              onClick={() => navigate('/rewards')}
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
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
