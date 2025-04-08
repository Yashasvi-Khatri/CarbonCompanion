
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER } from '@/lib/carbon-utils';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating login process
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any well-formed email/password will work
      if (email && password.length >= 6) {
        // Store user in local storage
        localStorage.setItem('carbonCompanionUser', JSON.stringify({
          ...MOCK_USER,
          email,
          name: email.split('@')[0],
        }));
        
        toast({
          title: 'Login successful',
          description: `Welcome back, ${email.split('@')[0]}!`,
        });
        
        navigate('/');
      } else {
        toast({
          title: 'Login failed',
          description: 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Store demo user in local storage
      localStorage.setItem('carbonCompanionUser', JSON.stringify({
        ...MOCK_USER,
        email: 'demo@carboncompanion.com',
        name: 'Demo User',
        isDemoAccount: true,
      }));
      
      toast({
        title: 'Demo mode activated',
        description: 'You are now using a demo account with sample data.',
      });
      
      navigate('/');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    toast({
      title: 'Google login',
      description: 'Google login would be integrated here in a production app.',
    });
    
    // For demo purposes, simulate a successful login
    handleDemoLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold">Carbon Companion</h1>
          <p className="text-gray-600 mt-2">Track, reduce, and improve your carbon footprint</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-green-600 hover:text-green-800">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
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
              <Button variant="outline" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Google
              </Button>
              <Button variant="secondary" onClick={handleDemoLogin}>
                Try Demo Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                onClick={() => navigate('/signup')} 
                className="text-green-600 hover:text-green-800 cursor-pointer font-medium"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
