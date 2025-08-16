import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (userType: 'admin' | 'user') => void;
}

export const AuthModal = ({ isOpen, onClose, onAuth }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'admin' | 'user'>('user');
  const [formData, setFormData] = useState({
    email: 'ranji431252@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    name: 'Ranji',
    phone: '6362133299'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
      if (authMode === 'register') {
        const resp = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: userType,
          })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.message || 'Registration failed');
        }
        onAuth(userType);
      } else {
        const resp = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.message || 'Login failed');
        }
        const data = await resp.json();
        onAuth(data.role);
      }
      onClose();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
      });
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Rent a Cultivator
          </DialogTitle>
        </DialogHeader>

        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription>
                  Choose your account type and login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={userType === 'user' ? 'primary' : 'outline'}
                      onClick={() => setUserType('user')}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>User</span>
                    </Button>
                    <Button
                      type="button"
                      variant={userType === 'admin' ? 'primary' : 'outline'}
                      onClick={() => setUserType('admin')}
                      className="flex items-center space-x-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full">
                    Sign In as {userType === 'admin' ? 'Admin' : 'User'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Create Account</CardTitle>
                <CardDescription>
                  Register as a new user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};