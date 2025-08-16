import { useState, useEffect } from 'react';

export interface BookingData {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  durationType: 'hours' | 'days';
  distance: number;
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
  deliveryAddress: string;
  contactNumber: string;
  specialRequirements: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

// For demo purposes, we'll use a simple user ID
// In production, this would come from authentication context
const DEMO_USER_ID = 'demo-user-123';

export const useBookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bookings from database on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/bookings/${DEMO_USER_ID}`);
      if (response.ok) {
        const data = await response.json();
        const formattedBookings = data.map((booking: any) => ({
          id: booking._id,
          equipmentId: booking.equipmentId,
          equipmentName: booking.equipmentName,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          duration: booking.duration,
          durationType: booking.durationType,
          distance: booking.distance,
          basePrice: booking.basePrice,
          distancePrice: booking.distancePrice,
          totalPrice: booking.totalPrice,
          deliveryAddress: booking.deliveryAddress,
          contactNumber: booking.contactNumber,
          specialRequirements: booking.specialRequirements,
          status: booking.status,
          createdAt: new Date(booking.createdAt)
        }));
        setBookings(formattedBookings);
      } else {
        console.error('Failed to fetch bookings');
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to localStorage if API fails
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedBookings = localStorage.getItem('agrifleet-bookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          createdAt: new Date(booking.createdAt)
        }));
        setBookings(parsedBookings);
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    }
  };

  const addBooking = async (bookingData: Omit<BookingData, 'id' | 'status' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/auth/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          userId: DEMO_USER_ID
        }),
      });

      if (response.ok) {
        const savedBooking = await response.json();
        const newBooking: BookingData = {
          id: savedBooking._id,
          equipmentId: savedBooking.equipmentId,
          equipmentName: savedBooking.equipmentName,
          startDate: new Date(savedBooking.startDate),
          endDate: new Date(savedBooking.endDate),
          duration: savedBooking.duration,
          durationType: savedBooking.durationType,
          distance: savedBooking.distance,
          basePrice: savedBooking.basePrice,
          distancePrice: savedBooking.distancePrice,
          totalPrice: savedBooking.totalPrice,
          deliveryAddress: savedBooking.deliveryAddress,
          contactNumber: savedBooking.contactNumber,
          specialRequirements: savedBooking.specialRequirements,
          status: savedBooking.status,
          createdAt: new Date(savedBooking.createdAt)
        };

        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
      } else {
        throw new Error('Failed to save booking to database');
      }
    } catch (error) {
      console.error('Error saving booking to database:', error);
      // Fallback to localStorage if database save fails
      const newBooking: BookingData = {
        ...bookingData,
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date()
      };
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingData['status']) => {
    try {
      const response = await fetch(`/api/auth/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status } 
              : booking
          )
        );
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      // Fallback to local state update if API fails
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status } 
            : booking
        )
      );
    }
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const completeBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  const confirmBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
  };

  const getBookingsByStatus = (status: BookingData['status']) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getActiveBookings = () => {
    return bookings.filter(booking => 
      booking.status === 'pending' || booking.status === 'confirmed'
    );
  };

  const getBookingById = (bookingId: string) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getTotalSpent = () => {
    return bookings
      .filter(booking => booking.status === 'completed')
      .reduce((total, booking) => total + booking.totalPrice, 0);
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.status === 'confirmed' && 
      new Date(booking.startDate) > now
    );
  };

  return {
    bookings,
    loading,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    completeBooking,
    confirmBooking,
    getBookingsByStatus,
    getActiveBookings,
    getBookingById,
    getTotalSpent,
    getUpcomingBookings,
    refreshBookings: fetchBookings
  };
}; 