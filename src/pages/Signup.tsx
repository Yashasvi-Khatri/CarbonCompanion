
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER } from '@/lib/carbon-utils';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure your passwords match.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    // Simulating signup process
    setTimeout(() => {
      setIsLoading(false);
      
      // Store user in local storage
      localStorage.setItem('carbonCompanionUser', JSON.stringify({
        ...MOCK_USER,
        email,
        name: name || email.split('@')[0],
      }));
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
      });
      
      navigate('/');
    }, 1000);
  };

  const handleGoogleSignup = () => {
    toast({
      title: 'Google sign up',
      description: 'Google sign up would be integrated here in a production app.',
    });
    
    // For demo purposes, navigate to the dashboard
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold">Carbon Companion</h1>
          <p className="text-gray-600 mt-2">Join us in tracking and reducing carbon emissions</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Button variant="outline" onClick={handleGoogleSignup} className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                onClick={() => navigate('/login')} 
                className="text-green-600 hover:text-green-800 cursor-pointer font-medium"
              >
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
