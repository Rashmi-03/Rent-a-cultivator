import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, TrendingUp, Plus, Settings, MessageSquare, Star, Trash2, BookOpen } from "lucide-react";
import { useState } from "react";
import { AddMachineModal } from "./AddMachineModal";
import { SettingsModal } from "./SettingsModal";
import { UpdateStockModal } from "./UpdateStockModal";
import { CategoriesModal } from "./CategoriesModal";
import { FeedbackModal } from "./FeedbackModal";
import { BookedMachinesModal } from "./BookedMachinesModal";
import { useMachines } from "@/hooks/useMachines";
import { useBookings } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";

interface RecentOrder {
  id: string;
  customerName: string;
  machineName: string;
  date: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount: number;
}

interface Machine {
  id: string;
  name: string;
  category: string;
  image: string;
  hourlyRate: number;
  dailyRate: number;
  available: boolean;
  rating: number;
  location: string;
  description: string;
  features: string[];
  stock: number;
}

const recentOrders: RecentOrder[] = [
  { id: '1', customerName: 'John Smith', machineName: 'John Deere 6120M', date: '2024-07-24', duration: '8 hours', status: 'pending', amount: 360 },
  { id: '2', customerName: 'Sarah Johnson', machineName: 'Case IH Axial-Flow 250', date: '2024-07-23', duration: '12 hours', status: 'confirmed', amount: 1020 },
  { id: '3', customerName: 'Mike Brown', machineName: 'New Holland T6.180', date: '2024-07-22', duration: '6 hours', status: 'completed', amount: 270 }
];

export const AdminDashboard = () => {
  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBookedMachinesModalOpen, setIsBookedMachinesModalOpen] = useState(false);
  const { machines, addMachine, deleteMachine, getTotalMachines, getAvailableMachinesCount, getAverageRating, getTotalRevenue, refreshMachines } = useMachines();
  const { bookings, getActiveBookings, getTotalSpent } = useBookings('all');
  const { toast } = useToast();

  // Calculate real stats from actual data
  const totalMachines = getTotalMachines();
  const availableMachines = getAvailableMachinesCount();
  const activeBookings = getActiveBookings().length;
  const totalSpent = getTotalSpent();
  
  // Calculate monthly revenue (simplified - in production this would come from actual financial data)
  const monthlyRevenue = totalSpent > 0 ? totalSpent : getTotalRevenue();
  
  // Calculate customer count (simplified - in production this would come from user database)
  const totalCustomers = bookings.length > 0 ? Math.max(187, bookings.length * 2) : 187;

  const stats = {
    totalMachines,
    availableMachines,
    totalCustomers,
    activeBookings,
    monthlyRevenue: Math.round(monthlyRevenue),
    customerSatisfaction: getAverageRating()
  };

  const machineUtilization = stats.totalMachines > 0 ? ((stats.totalMachines - stats.availableMachines) / stats.totalMachines) * 100 : 0;

  const handleAddMachine = async (machineData: Omit<Machine, 'id'>) => {
    try {
      console.log('AdminDashboard: Adding machine with data:', machineData);
      const newMachine = await addMachine(machineData) as Machine;
      console.log('AdminDashboard: Machine added successfully:', newMachine);
      toast({ title: "Machine Added Successfully!", description: `${newMachine.name} has been added to your inventory.` });
      // Refresh machines from database to ensure consistency
      await refreshMachines();
    } catch (error) {
      console.error('AdminDashboard: Error adding machine:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({ 
        title: "Error Adding Machine", 
        description: `Error: ${errorMessage}. Please check the console for more details.`, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your agricultural equipment fleet</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" onClick={() => setIsBookedMachinesModalOpen(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Bookings
          </Button>
          <Button variant="agriculture" onClick={() => setIsAddMachineModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Machine
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalMachines}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={machineUtilization} className="flex-1" />
              <span className="text-xs text-muted-foreground">{machineUtilization.toFixed(0)}% in use</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.availableMachines} available, {stats.totalMachines - stats.availableMachines} rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agriculture-crop">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
            <p className="text-xs text-muted-foreground mt-1">
              {bookings.length} total bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agriculture-gold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Currently rented</p>
            <p className="text-xs text-muted-foreground mt-1">
              {bookings.filter(b => b.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-agriculture-crop">
              <TrendingUp className="h-3 w-3" />
              <span>+18% from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {stats.activeBookings} active rentals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-soft transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-agriculture-crop" />
              <span>Machine Categories</span>
            </CardTitle>
            <CardDescription>Add or manage machine types</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsCategoriesModalOpen(true)}>Manage Categories</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-agriculture-gold" />
              <span>Update Stock</span>
            </CardTitle>
            <CardDescription>Modify machine availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsUpdateStockModalOpen(true)}>Update Inventory</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Customer Feedback</span>
            </CardTitle>
            <CardDescription>Review ratings and comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Avg Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-agriculture-gold text-agriculture-gold" />
                <span className="font-semibold">{stats.customerSatisfaction.toFixed(1)}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsFeedbackModalOpen(true)}>View Feedback</Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Machines Overview */}
      {machines.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Current Machines</h2>
            <Button variant="outline" onClick={() => setIsUpdateStockModalOpen(true)}>Manage Machines</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.slice(0, 6).map((machine) => (
              <Card key={machine.id} className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{machine.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={machine.available ? "default" : "secondary"}>
                        {machine.available ? "Available" : "Rented"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete ${machine.name}?`)) {
                            deleteMachine(machine.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{machine.category} • {machine.location}</p>
                    <p>₹{machine.hourlyRate}/hr • ₹{machine.dailyRate}/day</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-agriculture-gold text-agriculture-gold" />
                      <span>{machine.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {machines.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setIsUpdateStockModalOpen(true)}>
                View All {machines.length} Machines
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Recent Orders */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Orders</h2>
          <Button variant="outline">View All Orders</Button>
        </div>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-soft transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold">{order.customerName}</h3>
                  <p className="text-sm text-muted-foreground">{order.machineName}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <span>{order.date}</span>
                    <span>•</span>
                    <span>{order.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">₹{order.amount}</div>
                  <Badge 
                    variant={
                      order.status === 'completed' ? 'secondary' : 
                      order.status === 'confirmed' ? 'default' : 'outline'
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modals */}
      <AddMachineModal
        isOpen={isAddMachineModalOpen}
        onClose={() => setIsAddMachineModalOpen(false)}
        onAddMachine={handleAddMachine}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <UpdateStockModal
        isOpen={isUpdateStockModalOpen}
        onClose={() => setIsUpdateStockModalOpen(false)}
      />
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <BookedMachinesModal
        isOpen={isBookedMachinesModalOpen}
        onClose={() => setIsBookedMachinesModalOpen(false)}
      />

    </div>
  );
};