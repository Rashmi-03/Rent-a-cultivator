import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Truck, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { useBookings } from "@/hooks/useBookings";
import { BookingData } from "@/hooks/useBookings";

interface BookedMachinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookedMachinesModal = ({ isOpen, onClose }: BookedMachinesModalProps) => {
  const { bookings, updateBookingStatus } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BookingData['status']) => {
    switch(status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingData['status']) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (error) {
      console.error(`Error changing booking status:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Booked Machines</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by machine name or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                <p className="text-muted-foreground">There are no bookings matching your search criteria.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{booking.equipmentName}</h3>
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>User ID: {booking.userId?.substring(0, 8) || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Booked: {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>₹{booking.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Qty: {booking.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Duration: {booking.duration} {booking.durationType}</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span>{booking.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{booking.contactNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(booking.id, 'confirm')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusChange(booking.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {['pending', 'accepted', 'confirmed'].includes(booking.status) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};