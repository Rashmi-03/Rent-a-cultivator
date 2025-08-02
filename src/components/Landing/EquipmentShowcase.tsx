import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";

// Import all machinery images
import tractorStock from "@/assets/tractor-stock.jpg";
import harvesterStock from "@/assets/harvester-stock.jpg";
import machinesCollection from "@/assets/machines-collection.jpg";
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

interface Equipment {
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
}

const equipmentData: Equipment[] = [
  {
    id: '1',
    name: 'John Deere 6120M Tractor',
    category: 'Tractor',
    image: tractorStock,
    hourlyRate: 3750,
    dailyRate: 25000,
    available: true,
    rating: 4.8,
    location: 'Downtown Farm Equipment',
    description: 'High-performance tractor with advanced GPS guidance system',
    features: ['GPS Navigation', 'Climate Control', 'Premium Sound System']
  },
  {
    id: '2',
    name: 'Case IH Axial-Flow 250 Harvester',
    category: 'Harvester',
    image: harvesterStock,
    hourlyRate: 7000,
    dailyRate: 55000,
    available: true,
    rating: 4.6,
    location: 'North Valley Equipment',
    description: 'Advanced combine harvester with grain loss monitoring',
    features: ['Grain Loss Monitor', 'Auto Height Control', 'Yield Mapping']
  },
  {
    id: '3',
    name: 'Harvestmaster H12 4WD',
    category: 'Harvester',
    image: harvestmasterH12,
    hourlyRate: 6000,
    dailyRate: 48000,
    available: true,
    rating: 4.7,
    location: 'Central Farm Services',
    description: 'Compact harvester perfect for small to medium farms',
    features: ['4WD Drive', 'Compact Design', 'Easy Maneuverability']
  },
  {
    id: '4',
    name: 'Standard Tractor-Mounted Combine',
    category: 'Harvester',
    image: standardTractorHarvester,
    hourlyRate: 5200,
    dailyRate: 40000,
    available: false,
    rating: 4.5,
    location: 'South Field Equipment',
    description: 'Versatile tractor-mounted harvester for multiple crops',
    features: ['Tractor Mounted', 'Multi-Crop', 'Adjustable Header']
  },
  {
    id: '5',
    name: 'Front-End Loader',
    category: 'Loader',
    image: loadersDesktop,
    hourlyRate: 2800,
    dailyRate: 22000,
    available: true,
    rating: 4.4,
    location: 'West Construction Equipment',
    description: 'Heavy-duty front-end loader for material handling',
    features: ['Heavy Duty', 'Quick Attach', 'High Lift Capacity']
  },
  {
    id: '6',
    name: 'Mahindra Round Baler',
    category: 'Baler',
    image: mahindraRoundBaler,
    hourlyRate: 3200,
    dailyRate: 25000,
    available: true,
    rating: 4.3,
    location: 'East Farm Machinery',
    description: 'Efficient round baler for hay and straw baling',
    features: ['Round Baling', 'Auto Tie', 'Adjustable Density']
  },
  {
    id: '7',
    name: 'Mahindra Straw Baler',
    category: 'Baler',
    image: mahindraStrawBaler,
    hourlyRate: 3000,
    dailyRate: 24000,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services',
    description: 'Specialized baler for straw and crop residue',
    features: ['Straw Specific', 'High Capacity', 'Durable Construction']
  },
  {
    id: '8',
    name: 'Premium Tractor Unit',
    category: 'Tractor',
    image: productJpeg,
    hourlyRate: 4000,
    dailyRate: 32000,
    available: false,
    rating: 4.9,
    location: 'Premium Equipment Co.',
    description: 'Top-of-the-line tractor with luxury features',
    features: ['Luxury Interior', 'Advanced Tech', 'Premium Warranty']
  },
  {
    id: '9',
    name: 'Mahindra Straw Reaper',
    category: 'Reaper',
    image: mahindraStrawReaper,
    hourlyRate: 2400,
    dailyRate: 18000,
    available: true,
    rating: 4.1,
    location: 'South Field Equipment',
    description: 'Efficient straw reaper for crop residue management',
    features: ['Straw Cutting', 'Adjustable Height', 'Easy Operation']
  },
  {
    id: '10',
    name: 'Mahindra Basket Thresher P-990',
    category: 'Thresher',
    image: mahindraBasketThresher,
    hourlyRate: 2000,
    dailyRate: 15000,
    available: true,
    rating: 4.0,
    location: 'North Valley Equipment',
    description: 'Traditional basket thresher for grain processing',
    features: ['Basket Design', 'Manual Operation', 'Versatile Use']
  },
  {
    id: '11',
    name: 'Mahindra Paddy Multi-Thresher P-80',
    category: 'Thresher',
    image: mahindraPaddyThresher,
    hourlyRate: 2200,
    dailyRate: 17000,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services',
    description: 'Specialized thresher for paddy and rice crops',
    features: ['Paddy Specific', 'Multi-Crop', 'High Efficiency']
  },
  {
    id: '12',
    name: 'Premium Farm Tractor',
    category: 'Tractor',
    image: istockTractor,
    hourlyRate: 4400,
    dailyRate: 35000,
    available: true,
    rating: 4.7,
    location: 'Premium Equipment Co.',
    description: 'Professional grade tractor for commercial farming',
    features: ['Commercial Grade', 'High Horsepower', 'Advanced Controls']
  },
  {
    id: '13',
    name: 'Mild Steel Plough Cultivator',
    category: 'Cultivator',
    image: mildSteelPlough,
    hourlyRate: 1600,
    dailyRate: 12000,
    available: true,
    rating: 4.3,
    location: 'East Farm Machinery',
    description: 'Durable 5-teeth plough for soil preparation',
    features: ['5 Teeth Design', 'Mild Steel', 'Tractor Driven']
  },
  {
    id: '14',
    name: 'Rigid Type Cultivator',
    category: 'Cultivator',
    image: rigidCultivator,
    hourlyRate: 1800,
    dailyRate: 14000,
    available: true,
    rating: 4.4,
    location: 'West Construction Equipment',
    description: '9-tynes rigid cultivator for intensive farming',
    features: ['9 Tynes', 'Rigid Design', 'High Durability']
  },
  {
    id: '15',
    name: 'Disc Harrow Cultivator',
    category: 'Cultivator',
    image: discHarrow,
    hourlyRate: 2000,
    dailyRate: 15000,
    available: false,
    rating: 4.1,
    location: 'South Field Equipment',
    description: 'Disc harrow for soil breaking and leveling',
    features: ['Disc Design', 'Soil Breaking', 'Leveling Capability']
  },
  {
    id: '16',
    name: 'AG400 Paddy Thresher',
    category: 'Thresher',
    image: ag400PaddyThresher,
    hourlyRate: 2100,
    dailyRate: 16000,
    available: true,
    rating: 4.2,
    location: 'Central Farm Services',
    description: 'AG400 series paddy thresher with enhanced efficiency',
    features: ['AG400 Series', 'Paddy Specific', 'Enhanced Efficiency']
  },
  {
    id: '17',
    name: 'Tractor Rotavator 18 HP',
    category: 'Rotavator',
    image: tractorRotavator,
    hourlyRate: 2400,
    dailyRate: 18000,
    available: true,
    rating: 4.5,
    location: 'North Valley Equipment',
    description: '18 HP tractor rotavator for soil cultivation',
    features: ['18 HP Power', 'Soil Cultivation', 'Tractor Mounted']
  },
  {
    id: '18',
    name: 'Additional Agricultural Equipment',
    category: 'Specialty',
    image: additionalImage,
    hourlyRate: 2800,
    dailyRate: 22000,
    available: true,
    rating: 4.3,
    location: 'Central Farm Services',
    description: 'Specialized agricultural equipment for unique farming needs',
    features: ['Specialty Equipment', 'Versatile Use', 'High Efficiency']
  }
];

interface EquipmentShowcaseProps {
  onBookEquipment?: (equipment: Equipment) => void;
}

export const EquipmentShowcase = ({ onBookEquipment }: EquipmentShowcaseProps) => {
  const categories = [...new Set(equipmentData.map(item => item.category))];
  
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Equipment Fleet
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our extensive collection of premium agricultural machinery. 
            All equipment is regularly maintained and operated by certified professionals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="default" className="rounded-full">
            All Equipment
          </Button>
          {categories.map((category) => (
            <Button key={category} variant="outline" className="rounded-full">
              {category}s
            </Button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipmentData.map((equipment) => (
            <Card key={equipment.id} className="overflow-hidden hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={equipment.image} 
                  alt={equipment.name}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${
                    equipment.available 
                      ? 'bg-agriculture-crop text-white' 
                      : 'bg-destructive text-white'
                  }`}
                >
                  {equipment.available ? 'Available' : 'Rented'}
                </Badge>
                <Badge className="absolute top-2 left-2 bg-primary/80 text-white">
                  {equipment.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{equipment.name}</CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{equipment.location}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-agriculture-gold text-agriculture-gold" />
                    <span className="text-sm font-medium">{equipment.rating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">₹{equipment.hourlyRate}/hr</div>
                    <div className="text-sm text-muted-foreground">₹{equipment.dailyRate}/day</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {equipment.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {equipment.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {equipment.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{equipment.features.length - 2} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    disabled={!equipment.available}
                    onClick={() => onBookEquipment?.(equipment)}
                  >
                    {equipment.available ? 'Book Now' : 'Currently Rented'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-agriculture-gold/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Need Custom Equipment?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Contact us for custom equipment solutions.
            </p>
            <Button variant="agriculture" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}; 