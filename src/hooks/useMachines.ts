import { useState, useEffect } from 'react';
import { machinesAPI } from '@/lib/api';

interface Machine {
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

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load machines from backend on component mount
  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await machinesAPI.getAll();
      // Transform MongoDB _id to id for frontend compatibility
      const transformedMachines = data.map((machine: any) => ({
        ...machine,
        id: machine._id || machine.id
      }));
      setMachines(transformedMachines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch machines');
      console.error('Error fetching machines:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMachine = async (machine: Omit<Machine, 'id'>) => {
    try {
      setError(null);
      console.log('Attempting to add machine:', machine);
      const newMachine = await machinesAPI.create(machine);
      console.log('Machine added successfully:', newMachine);
      // Transform MongoDB _id to id for frontend compatibility
      const transformedMachine = {
        ...newMachine,
        id: newMachine._id || newMachine.id
      };
      setMachines(prev => [...prev, transformedMachine]);
      return transformedMachine;
    } catch (err) {
      console.error('Error adding machine:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add machine';
      setError(errorMessage);
      throw err;
    }
  };

  const updateMachine = async (id: string, updates: Partial<Machine>) => {
    try {
      setError(null);
      const updatedMachine = await machinesAPI.update(id, updates);
      // Transform MongoDB _id to id for frontend compatibility
      const transformedMachine = {
        ...updatedMachine,
        id: updatedMachine._id || updatedMachine.id
      };
      setMachines(prev => 
        prev.map(machine => 
          machine.id === id ? transformedMachine : machine
        )
      );
      return transformedMachine;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update machine');
      throw err;
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      setError(null);
      await machinesAPI.delete(id);
      setMachines(prev => prev.filter(machine => machine.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete machine');
      throw err;
    }
  };

  // Refresh machines from database
  const refreshMachines = async () => {
    await fetchMachines();
  };

  const getMachineById = (id: string) => {
    return machines.find(machine => machine.id === id);
  };

  const getMachinesByCategory = (category: string) => {
    return machines.filter(machine => machine.category === category);
  };

  const getAvailableMachines = () => {
    return machines.filter(machine => machine.available);
  };

  const getTotalMachines = () => machines.length;

  const getAvailableMachinesCount = () => {
    return machines.filter(machine => machine.available).length;
  };

  const getMachinesByLocation = (location: string) => {
    return machines.filter(machine => machine.location === location);
  };

  const getAverageRating = () => {
    if (machines.length === 0) return 0;
    const totalRating = machines.reduce((sum, machine) => sum + machine.rating, 0);
    return totalRating / machines.length;
  };

  const getTotalRevenue = () => {
    // This would typically come from bookings, but for demo purposes
    // we'll calculate based on machine rates
    return machines.reduce((sum, machine) => {
      // Simulate some revenue based on machine availability and rates
      const dailyRevenue = machine.available ? machine.dailyRate * 0.3 : 0; // 30% utilization
      return sum + dailyRevenue;
    }, 0);
  };

  return {
    machines,
    loading,
    error,
    addMachine,
    updateMachine,
    deleteMachine,
    getMachineById,
    getMachinesByCategory,
    getAvailableMachines,
    getTotalMachines,
    getAvailableMachinesCount,
    getMachinesByLocation,
    getAverageRating,
    getTotalRevenue,
    refreshMachines: refreshMachines,
  };
};
