
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/lib/carbon-utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, UserCircle, Settings, Shield, LogOut } from 'lucide-react';

interface ExtendedUserProfile extends Omit<UserProfile, 'name'> {
  email?: string;
  name: string;
}

const MyAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('carbonCompanionUser');
    
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userObj = JSON.parse(storedUser);
    setUser(userObj);
    setName(userObj.name || '');
    setEmail(userObj.email || '');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('carbonCompanionUser');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name,
      email,
    };
    
    localStorage.setItem('carbonCompanionUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <UserCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">{user.name || 'User'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{user.email || 'user@example.com'}</p>
                
                <div className="bg-muted p-2 rounded-md w-full mb-4">
                  <p className="text-sm font-medium">Carbon Points</p>
                  <p className="text-xl font-bold text-green-600">{user.points}</p>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your public profile and account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your carbon tracking experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Preference settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Privacy settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
