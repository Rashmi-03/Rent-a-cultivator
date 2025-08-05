import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  Settings,
  MessageSquare,
  Star
} from "lucide-react";

interface DashboardStats {
  totalMachines: number;
  availableMachines: number;
  totalCustomers: number;
  activeBookings: number;
  monthlyRevenue: number;
  customerSatisfaction: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  machineName: string;
  date: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount: number;
}

const stats: DashboardStats = {
  totalMachines: 45,
  availableMachines: 32,
  totalCustomers: 187,
  activeBookings: 23,
  monthlyRevenue: 34500,
  customerSatisfaction: 4.7
};

const recentOrders: RecentOrder[] = [
  {
    id: '1',
    customerName: 'John Smith',
    machineName: 'John Deere 6120M',
    date: '2024-07-24',
    duration: '8 hours',
    status: 'pending',
    amount: 360
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    machineName: 'Case IH Axial-Flow 250',
    date: '2024-07-23',
    duration: '12 hours',
    status: 'confirmed',
    amount: 1020
  },
  {
    id: '3',
    customerName: 'Mike Brown',
    machineName: 'New Holland T6.180',
    date: '2024-07-22',
    duration: '6 hours',
    status: 'completed',
    amount: 270
  }
];

export const AdminDashboard = () => {
  const machineUtilization = (stats.totalMachines - stats.availableMachines) / stats.totalMachines * 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your agricultural equipment fleet</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="agriculture">
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
            <Button variant="outline" className="w-full">
              Manage Categories
            </Button>
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
            <Button variant="outline" className="w-full">
              Update Inventory
            </Button>
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
                <span className="font-semibold">{stats.customerSatisfaction}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Feedback
            </Button>
          </CardContent>
        </Card>
      </div>

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
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{order.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{order.machineName}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>{order.date}</span>
                      <span>•</span>
                      <span>{order.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={order.status === 'completed' ? 'secondary' : 
                            order.status === 'confirmed' ? 'default' : 'outline'}
                  >
                    {order.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.amount}</div>
                  </div>
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <Button variant="primary" size="sm">Approve</Button>
                        <Button variant="outline" size="sm">Decline</Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button variant="outline" size="sm">Contact</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};