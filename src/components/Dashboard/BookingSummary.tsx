import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Truck, TrendingUp, DollarSign } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

export const BookingSummary = () => {
  const { 
    bookings, 
    getBookingsByStatus, 
    getTotalSpent, 
    getUpcomingBookings 
  } = useBookings();

  const pendingBookings = getBookingsByStatus('pending');
  const confirmedBookings = getBookingsByStatus('confirmed');
  const completedBookings = getBookingsByStatus('completed');
  const cancelledBookings = getBookingsByStatus('cancelled');
  const totalSpent = getTotalSpent();
  const upcomingBookings = getUpcomingBookings();

  const totalDistance = bookings.reduce((sum, booking) => sum + booking.distance, 0);
  const averageDistance = bookings.length > 0 ? Math.round(totalDistance / bookings.length) : 0;

  const totalDeliveryCost = bookings.reduce((sum, booking) => sum + booking.distancePrice, 0);
  const averageDeliveryCost = bookings.length > 0 ? Math.round(totalDeliveryCost / bookings.length) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Booking Summary</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">On equipment rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance} km</div>
            <p className="text-xs text-muted-foreground">Average: {averageDistance} km</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Costs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDeliveryCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average: ₹{averageDeliveryCost}</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{confirmedBookings.length}</div>
            <p className="text-xs text-muted-foreground">Ready for delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedBookings.length}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cancelledBookings.length}</div>
            <p className="text-xs text-muted-foreground">Cancelled bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your confirmed bookings for the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.equipmentName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{format(booking.startDate, 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{booking.duration} {booking.durationType}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Truck className="h-3 w-3" />
                          <span>{booking.distance} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{booking.totalPrice.toLocaleString()}</div>
                    <Badge variant="default" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Distance Analysis</CardTitle>
          <CardDescription>Delivery distance statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageDistance} km</div>
              <div className="text-sm text-blue-600">Average Distance</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.distance <= 50).length}
              </div>
              <div className="text-sm text-green-600">Local Deliveries (≤50km)</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {bookings.filter(b => b.distance > 50).length}
              </div>
              <div className="text-sm text-orange-600">Long Distance (>50km)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 