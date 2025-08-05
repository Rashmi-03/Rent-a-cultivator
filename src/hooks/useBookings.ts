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

export const useBookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bookings from localStorage on mount
  useEffect(() => {
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
        console.error('Error loading bookings:', error);
      }
    }
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('agrifleet-bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData: Omit<BookingData, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: BookingData = {
      ...bookingData,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date()
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingData['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status } 
          : booking
      )
    );
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
    getUpcomingBookings
  };
}; 