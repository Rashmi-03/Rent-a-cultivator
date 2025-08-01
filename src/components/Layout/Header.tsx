import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tractor, Menu, X, LogOut, User } from "lucide-react";

interface HeaderProps {
  userType: 'admin' | 'user' | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export const Header = ({ userType, onAuthClick, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-soft border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tractor className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">AgriFleet</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {userType === 'admin' && (
              <>
                <Button variant="ghost">Dashboard</Button>
                <Button variant="ghost">Machines</Button>
                <Button variant="ghost">Customers</Button>
                <Button variant="ghost">Orders</Button>
                <Button variant="ghost">Feedback</Button>
              </>
            )}
            {userType === 'user' && (
              <>
                <Button variant="ghost">Machines</Button>
                <Button variant="ghost">My Bookings</Button>
                <Button variant="ghost">Responses</Button>
                <Button variant="ghost">Feedback</Button>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {userType ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{userType}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={onAuthClick}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-2">
              {userType === 'admin' && (
                <>
                  <Button variant="ghost" className="justify-start">Dashboard</Button>
                  <Button variant="ghost" className="justify-start">Machines</Button>
                  <Button variant="ghost" className="justify-start">Customers</Button>
                  <Button variant="ghost" className="justify-start">Orders</Button>
                  <Button variant="ghost" className="justify-start">Feedback</Button>
                </>
              )}
              {userType === 'user' && (
                <>
                  <Button variant="ghost" className="justify-start">Machines</Button>
                  <Button variant="ghost" className="justify-start">My Bookings</Button>
                  <Button variant="ghost" className="justify-start">Responses</Button>
                  <Button variant="ghost" className="justify-start">Feedback</Button>
                </>
              )}
              <div className="pt-2 border-t border-border">
                {userType ? (
                  <Button 
                    variant="outline" 
                    onClick={onLogout}
                    className="justify-start w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout ({userType})
                  </Button>
                ) : (
                  <Button variant="primary" onClick={onAuthClick} className="w-full">
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};