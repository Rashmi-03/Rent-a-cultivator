import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'rent-a-cultivator-machines';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);

  // Load machines from localStorage on component mount
  useEffect(() => {
    const storedMachines = localStorage.getItem(STORAGE_KEY);
    if (storedMachines) {
      try {
        setMachines(JSON.parse(storedMachines));
      } catch (error) {
        console.error('Error loading machines from localStorage:', error);
        setMachines([]);
      }
    }
  }, []);

  // Save machines to localStorage whenever machines state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
  }, [machines]);

  const addMachine = (machine: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
      ...machine,
      id: `machine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setMachines(prev => [...prev, newMachine]);
    return newMachine;
  };

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    setMachines(prev => 
      prev.map(machine => 
        machine.id === id ? { ...machine, ...updates } : machine
      )
    );
  };

  const deleteMachine = (id: string) => {
    setMachines(prev => prev.filter(machine => machine.id !== id));
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
    getTotalRevenue
  };
};
