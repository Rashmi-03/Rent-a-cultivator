import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { AuthModal } from "@/components/Auth/AuthModal";
import { HeroSection } from "@/components/Landing/HeroSection";
import { UserDashboard } from "@/components/Dashboard/UserDashboard";
import { AdminDashboard } from "@/components/Dashboard/AdminDashboard";

type UserType = 'admin' | 'user' | null;

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuth = (userType: UserType) => {
    setCurrentUser(userType);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userType={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main>
        {!currentUser && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}
        
        {currentUser === 'user' && <UserDashboard />}
        {currentUser === 'admin' && <AdminDashboard />}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
