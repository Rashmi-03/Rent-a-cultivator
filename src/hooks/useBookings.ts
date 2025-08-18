import { useState, useEffect } from 'react';

export interface BookingData {
  id: string;
  userId: string;
  machineId: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'completed' | 'cancelled';
  quantity: number;
  createdAt: Date;
}

// For demo purposes, we'll use a simple user ID
// In production, this would come from authentication context
const DEMO_USER_ID = '64d0b6a4c0f1564d5ecbf91e'; // Replace with a valid MongoDB ObjectId from your users collection

export const useBookings = (scope: 'user' | 'all' = 'user', userId?: string) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bookings from database on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint = scope === 'all'
        ? '/api/bookings'
        : `/api/bookings?userId=${userId || DEMO_USER_ID}`;
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const formattedBookings = data.map((booking: any) => ({
          id: booking._id,
          userId: booking.user?._id || booking.user,
          machineId: booking.machine?._id || booking.machine,
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
          quantity: booking.quantity || 1,
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
      console.log('Attempting to save booking to database:', bookingData);
      
      // Add a timeout to the fetch request to prevent hanging indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          userId: userId || DEMO_USER_ID,
          machineId: bookingData.equipmentId,
          quantity: bookingData.quantity || 1
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const savedBooking = await response.json();
        console.log('Booking saved successfully to database:', savedBooking);
        
        const newBooking: BookingData = {
          id: savedBooking._id,
          userId: savedBooking.user?._id || savedBooking.user,
          machineId: savedBooking.machine?._id || savedBooking.machine,
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
          quantity: savedBooking.quantity || 1,
          createdAt: new Date(savedBooking.createdAt)
        };

        setBookings(prev => [newBooking, ...prev]);
        
        // Also save to localStorage as backup
        const existingBookings = JSON.parse(localStorage.getItem('agrifleet-bookings') || '[]');
        existingBookings.unshift(newBooking);
        localStorage.setItem('agrifleet-bookings', JSON.stringify(existingBookings));
        
        return newBooking;
      } else {
        const errorText = await response.text().catch(() => 'Could not read error response');
        console.error('Failed to save booking to database. Status:', response.status, 'Error:', errorText);
        
        // Create a temporary booking for immediate UI feedback
        const tempBooking: BookingData = {
          ...bookingData,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          createdAt: new Date()
        };
        
        // Add to local state for immediate UI update
        setBookings(prev => [tempBooking, ...prev]);
        
        // Save to localStorage as fallback
        const existingBookings = JSON.parse(localStorage.getItem('agrifleet-bookings') || '[]');
        existingBookings.unshift(tempBooking);
        localStorage.setItem('agrifleet-bookings', JSON.stringify(existingBookings));
        
        throw new Error(`Failed to save booking: ${response.status} - ${errorText}. Booking saved locally.`);
      }
    } catch (error) {
      console.error('Error saving booking to database:', error);
      
      // Create a temporary booking for immediate UI feedback
      const tempBooking: BookingData = {
        ...bookingData,
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Add to local state for immediate UI update
      setBookings(prev => [tempBooking, ...prev]);
      
      // Save to localStorage as fallback
      const existingBookings = JSON.parse(localStorage.getItem('agrifleet-bookings') || '[]');
      existingBookings.unshift(tempBooking);
      localStorage.setItem('agrifleet-bookings', JSON.stringify(existingBookings));
      
      // Return the temporary booking with a flag indicating it was saved locally
      tempBooking.id = `local-${tempBooking.id}`;
      
      // Show error toast to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Booking saved locally due to connection issue:', errorMessage);
      return tempBooking;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingData['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
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

  const cancelBooking = async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'cancelled');
  };

  const completeBooking = async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'completed');
  };

  const confirmBooking = async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'confirmed');
  };
  
  // Refresh bookings from database
  const refreshBookings = () => {
    return fetchBookings();
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