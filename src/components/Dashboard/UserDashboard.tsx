import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, Tractor, Wrench, Users } from "lucide-react";

// Import all machinery images
import tractorStock from "@/assets/tractor-stock.jpg";
import harvesterStock from "@/assets/harvester-stock.jpg";
import harvestmasterH12 from "@/assets/harvestmaster-h12-4wd-1649325881.jpg";
import standardTractorHarvester from "@/assets/standard-tractor-mounted-combine-harvester.jpg";
import loadersDesktop from "@/assets/Loaders_desktop 1.png";
import mahindraRoundBaler from "@/assets/Mahindra Round baler 1.png";
import mahindraStrawBaler from "@/assets/mahindra-round-straw-baler.jpg";
import productJpeg from "@/assets/product-jpeg-500x500.webp";
import mahindraStrawReaper from "@/assets/Mahindra Straw Reaper 2.png";
import mahindraBasketThresher from "@/assets/Mahindra Basket Thresher P-990 1.png";
import mahindraPaddyThresher from "@/assets/Mahindra Paddy - Multi Thresher P-80 1.png";
import istockTractor from "@/assets/istockphoto-1096903098-612x612.jpg";
import mildSteelPlough from "@/assets/mild-steel-blue-painted-highly-durable-5-teeth-tractor-driven-plough-cultivator-for-agriculture-248.jpg";
import rigidCultivator from "@/assets/9-tynes-rigid-type-agriculture-tractor-cultivator-2216967740-dznbdtyp.avif";
import discHarrow from "@/assets/agricultural-machinery-agriculture-disc-harrow-cultivator-png-favpng-vqU6Yp8dKD5RFEYF3gMPtQ628.jpg";
import ag400PaddyThresher from "@/assets/AG400_Paddy_tresher.webp";
import tractorRotavator from "@/assets/tractor-rotavator-power-18-hp-2216880342-7ln43l72.avif";
import additionalImage from "@/assets/A3f142b0374814f3e95c4ad4d5ecbf91eY.avif";

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
    image: tractorStock,
    hourlyRate: 3750,
    available: true,
    rating: 4.8,
    location: 'Downtown Farm Equipment'
  },
  {
    id: '2',
    name: 'Case IH Axial-Flow 250',
    category: 'Harvester',
    image: harvesterStock,
    hourlyRate: 7000,
    available: true,
    rating: 4.6,
    location: 'North Valley Equipment'
  },
  {
    id: '3',
    name: 'Harvestmaster H12 4WD',
    category: 'Harvester',
    image: harvestmasterH12,
    hourlyRate: 6000,
    available: true,
    rating: 4.7,
    location: 'Central Farm Services'
  },
  {
    id: '4',
    name: 'Standard Tractor-Mounted Combine',
    category: 'Harvester',
    image: standardTractorHarvester,
    hourlyRate: 5200,
    available: false,
    rating: 4.5,
    location: 'South Field Equipment'
  },
  {
    id: '5',
    name: 'Front-End Loader',
    category: 'Loader',
    image: loadersDesktop,
    hourlyRate: 2800,
    available: true,
    rating: 4.4,
    location: 'West Construction Equipment'
  },
  {
    id: '6',
    name: 'Mahindra Round Baler',
    category: 'Baler',
    image: mahindraRoundBaler,
    hourlyRate: 3200,
    available: true,
    rating: 4.3,
    location: 'East Farm Machinery'
  },
  {
    id: '7',
    name: 'Mahindra Straw Baler',
    category: 'Baler',
    image: mahindraStrawBaler,
    hourlyRate: 3000,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services'
  },
  {
    id: '8',
    name: 'Premium Tractor Unit',
    category: 'Tractor',
    image: productJpeg,
    hourlyRate: 4000,
    available: false,
    rating: 4.9,
    location: 'Premium Equipment Co.'
  },
  {
    id: '9',
    name: 'Mahindra Straw Reaper',
    category: 'Reaper',
    image: mahindraStrawReaper,
    hourlyRate: 2400,
    available: true,
    rating: 4.1,
    location: 'South Field Equipment'
  },
  {
    id: '10',
    name: 'Mahindra Basket Thresher P-990',
    category: 'Thresher',
    image: mahindraBasketThresher,
    hourlyRate: 2000,
    available: true,
    rating: 4.0,
    location: 'North Valley Equipment'
  },
  {
    id: '11',
    name: 'Mahindra Paddy Multi-Thresher P-80',
    category: 'Thresher',
    image: mahindraPaddyThresher,
    hourlyRate: 2200,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services'
  },
  {
    id: '12',
    name: 'Premium Farm Tractor',
    category: 'Tractor',
    image: istockTractor,
    hourlyRate: 4400,
    available: true,
    rating: 4.7,
    location: 'Premium Equipment Co.'
  },
  {
    id: '13',
    name: 'Mild Steel Plough Cultivator',
    category: 'Cultivator',
    image: mildSteelPlough,
    hourlyRate: 1600,
    available: true,
    rating: 4.3,
    location: 'East Farm Machinery'
  },
  {
    id: '14',
    name: 'Rigid Type Cultivator',
    category: 'Cultivator',
    image: rigidCultivator,
    hourlyRate: 1800,
    available: true,
    rating: 4.4,
    location: 'West Construction Equipment'
  },
  {
    id: '15',
    name: 'Disc Harrow Cultivator',
    category: 'Cultivator',
    image: discHarrow,
    hourlyRate: 2000,
    available: false,
    rating: 4.1,
    location: 'South Field Equipment'
  },
  {
    id: '16',
    name: 'AG400 Paddy Thresher',
    category: 'Thresher',
    image: ag400PaddyThresher,
    hourlyRate: 2100,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services'
  },
  {
    id: '17',
    name: 'Tractor Rotavator 18 HP',
    category: 'Rotavator',
    image: tractorRotavator,
    hourlyRate: 2400,
    available: true,
    rating: 4.5,
    location: 'North Valley Equipment'
  },
  {
    id: '18',
    name: 'Additional Agricultural Equipment',
    category: 'Specialty',
    image: additionalImage,
    hourlyRate: 2800,
    available: true,
    rating: 4.3,
    location: 'Central Farm Services'
  }
];

const recentBookings: Booking[] = [
  {
    id: '1',
    machineName: 'John Deere 6120M',
    date: '2024-07-20',
    duration: '8 hours',
    status: 'completed',
    cost: 30000
  },
  {
    id: '2',
    machineName: 'Case IH Axial-Flow 250',
    date: '2024-07-25',
    duration: '6 hours',
    status: 'confirmed',
    cost: 42500
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
            <div className="text-2xl font-bold text-primary">₹1,95,000</div>
            <p className="text-xs text-muted-foreground">vs buying equipment</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Machines */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Equipment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="text-lg font-bold text-primary">₹{machine.hourlyRate}/hr</div>
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
                    <div className="font-semibold">₹{booking.cost}</div>
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