import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Calculator, Truck } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

interface BookingModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
}

interface BookingData {
  equipmentId: string;
  equipmentName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  distance: number;
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
  deliveryAddress: string;
  contactNumber: string;
  specialRequirements: string;
}

const distanceRates = {
  local: { rate: 50, maxDistance: 50 }, // ₹50/km for local delivery (0-50km)
  regional: { rate: 75, maxDistance: 200 }, // ₹75/km for regional delivery (51-200km)
  longDistance: { rate: 100, maxDistance: 500 } // ₹100/km for long distance (201-500km)
};

export const BookingModal = ({ equipment, isOpen, onClose, onConfirm }: BookingModalProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState<number>(1);
  const [durationType, setDurationType] = useState<'hours' | 'days'>('hours');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [distance, setDistance] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate distance based on delivery address (simplified calculation)
  const calculateDistance = async (address: string) => {
    if (!address.trim()) return 0;
    
    setIsCalculating(true);
    
    // Simulate distance calculation based on address
    // In a real app, you would use Google Maps API or similar
    const mockDistance = Math.floor(Math.random() * 150) + 10; // 10-160 km
    
    setTimeout(() => {
      setDistance(mockDistance);
      setIsCalculating(false);
    }, 1000);
  };

  // Calculate pricing based on distance and duration
  const calculatePricing = () => {
    if (!equipment || !startDate || !endDate || distance === 0) return null;

    const basePrice = durationType === 'hours' 
      ? equipment.hourlyRate * duration 
      : equipment.dailyRate * duration;

    let distancePrice = 0;
    if (distance <= distanceRates.local.maxDistance) {
      distancePrice = distance * distanceRates.local.rate;
    } else if (distance <= distanceRates.regional.maxDistance) {
      distancePrice = (distanceRates.local.maxDistance * distanceRates.local.rate) +
                     ((distance - distanceRates.local.maxDistance) * distanceRates.regional.rate);
    } else {
      distancePrice = (distanceRates.local.maxDistance * distanceRates.local.rate) +
                     ((distanceRates.regional.maxDistance - distanceRates.local.maxDistance) * distanceRates.regional.rate) +
                     ((distance - distanceRates.regional.maxDistance) * distanceRates.longDistance.rate);
    }

    const totalPrice = basePrice + distancePrice;

    return {
      basePrice,
      distancePrice,
      totalPrice
    };
  };

  const pricing = calculatePricing();

  const handleConfirmBooking = () => {
    if (!equipment || !startDate || !endDate || !pricing) return;

    const bookingData: BookingData = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      startDate,
      endDate,
      duration,
      distance,
      basePrice: pricing.basePrice,
      distancePrice: pricing.distancePrice,
      totalPrice: pricing.totalPrice,
      deliveryAddress,
      contactNumber,
      specialRequirements
    };

    onConfirm(bookingData);
    onClose();
  };

  const isFormValid = equipment && startDate && endDate && duration > 0 && 
                     deliveryAddress.trim() && contactNumber.trim() && pricing;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Equipment</DialogTitle>
        </DialogHeader>

        {equipment && (
          <div className="space-y-6">
            {/* Equipment Details */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={equipment.image} 
                    alt={equipment.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{equipment.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{equipment.category}</Badge>
                      <span>•</span>
                      <span>₹{equipment.hourlyRate}/hr</span>
                      <span>•</span>
                      <span>₹{equipment.dailyRate}/day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="duration-type">Duration Type</Label>
                  <Select value={durationType} onValueChange={(value: 'hours' | 'days') => setDurationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration ({durationType})</Label>
                  <Input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery Information</h3>
              
              <div>
                <Label htmlFor="delivery-address">Delivery Address</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => calculateDistance(deliveryAddress)}
                    disabled={!deliveryAddress.trim() || isCalculating}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate Distance'}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input
                  placeholder="Enter your contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="special-requirements">Special Requirements (Optional)</Label>
                <Input
                  placeholder="Any special requirements or instructions"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                />
              </div>
            </div>

            {/* Distance and Pricing */}
            {distance > 0 && pricing && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Distance</span>
                      </div>
                      <span className="font-semibold">{distance} km</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Base Price ({duration} {durationType})</span>
                      <span>₹{pricing.basePrice.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Delivery Cost</span>
                      <span>₹{pricing.distancePrice.toLocaleString()}</span>
                    </div>

                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total Price</span>
                        <span className="text-primary">₹{pricing.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmBooking}
                disabled={!isFormValid}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 