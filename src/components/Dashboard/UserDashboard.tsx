import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import tractorImage from "@/assets/tractor-stock.jpg";
import harvesterImage from "@/assets/harvester-stock.jpg";

interface Machine {
  id: string;
  name: string;
  category: string;
  image: string;
  hourlyRate: number;
  available: boolean;
  rating: number;
  location: string;
}

interface Booking {
  id: string;
  machineName: string;
  date: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
  cost: number;
}

const machines: Machine[] = [
  {
    id: '1',
    name: 'John Deere 6120M',
    category: 'Tractor',
    image: tractorImage,
    hourlyRate: 45,
    available: true,
    rating: 4.8,
    location: 'Downtown Farm Equipment'
  },
  {
    id: '2',
    name: 'Case IH Axial-Flow 250',
    category: 'Harvester',
    image: harvesterImage,
    hourlyRate: 85,
    available: true,
    rating: 4.6,
    location: 'North Valley Equipment'
  }
];

const recentBookings: Booking[] = [
  {
    id: '1',
    machineName: 'John Deere 6120M',
    date: '2024-07-20',
    duration: '8 hours',
    status: 'completed',
    cost: 360
  },
  {
    id: '2',
    machineName: 'Case IH Axial-Flow 250',
    date: '2024-07-25',
    duration: '6 hours',
    status: 'confirmed',
    cost: 510
  }
];

export const UserDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome to AgriFleet</h1>
        <p className="text-muted-foreground">Rent quality agricultural equipment for your farming needs</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Machines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agriculture-crop">24</div>
            <p className="text-xs text-muted-foreground">Ready to rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agriculture-gold">3</div>
            <p className="text-xs text-muted-foreground">Active rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">$2,340</div>
            <p className="text-xs text-muted-foreground">vs buying equipment</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Machines */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {machines.map((machine) => (
            <Card key={machine.id} className="overflow-hidden hover:shadow-strong transition-shadow">
              <div className="relative">
                <img 
                  src={machine.image} 
                  alt={machine.name}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${machine.available ? 'bg-agriculture-crop' : 'bg-destructive'}`}
                >
                  {machine.available ? 'Available' : 'Rented'}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{machine.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{machine.location}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${machine.hourlyRate}/hr</div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-agriculture-gold text-agriculture-gold" />
                      <span className="text-sm">{machine.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="primary" className="flex-1">
                    Book Now
                  </Button>
                  <Button variant="outline">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Recent Bookings</h2>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{booking.machineName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={booking.status === 'completed' ? 'secondary' : 
                            booking.status === 'confirmed' ? 'default' : 'outline'}
                  >
                    {booking.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-semibold">${booking.cost}</div>
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