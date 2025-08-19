import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { AuthModal } from "@/components/Auth/AuthModal";
import { HeroSection } from "@/components/Landing/HeroSection";
import { EquipmentShowcase } from "@/components/Landing/EquipmentShowcase";
import { ImageGallery } from "@/components/Landing/ImageGallery";
import { UserDashboard } from "@/components/Dashboard/UserDashboard";
import { AdminDashboard } from "@/components/Dashboard/AdminDashboard";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { user, logout } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuth = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userType={user?.role || null}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main>
        {!user && (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <EquipmentShowcase onBookEquipment={(equipment) => {
              console.log('Booking equipment:', equipment);
              // Show auth modal when user tries to book without being logged in
              setIsAuthModalOpen(true);
            }} />
            <ImageGallery />
          </>
        )}
        
        {user?.role === 'user' && <UserDashboard />}
        {user?.role === 'admin' && <AdminDashboard />}
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
