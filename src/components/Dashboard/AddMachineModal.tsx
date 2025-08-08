import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMachine: (machine: MachineData) => void;
}

interface MachineData {
  name: string;
  category: string;
  hourlyRate: number;
  dailyRate: number;
  location: string;
  description: string;
  features: string[];
  image: string;
  available: boolean;
  rating: number;
}

const machineCategories = [
  'Tractor',
  'Harvester',
  'Loader',
  'Baler',
  'Reaper',
  'Thresher',
  'Cultivator',
  'Rotavator',
  'Specialty'
];

export const AddMachineModal = ({ isOpen, onClose, onAddMachine }: AddMachineModalProps) => {
  const [formData, setFormData] = useState<MachineData>({
    name: '',
    category: '',
    hourlyRate: 0,
    dailyRate: 0,
    location: '',
    description: '',
    features: [],
    image: '',
    available: true,
    rating: 4.0
  });

  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.hourlyRate <= 0 || formData.dailyRate <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid pricing information.",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID for the new machine
    const newMachine = {
      ...formData,
      id: `machine-${Date.now()}`,
      image: formData.image || '/placeholder.svg' // Use placeholder if no image provided
    };

    onAddMachine(newMachine);
    
    toast({
      title: "Machine Added Successfully!",
      description: `${formData.name} has been added to your inventory.`,
    });

    // Reset form
    setFormData({
      name: '',
      category: '',
      hourlyRate: 0,
      dailyRate: 0,
      location: '',
      description: '',
      features: [],
      image: '',
      available: true,
      rating: 4.0
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Tractor className="h-5 w-5 text-agriculture-crop" />
            <span>Add New Machine</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Machine Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., John Deere 6120M"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {machineCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                placeholder="800"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate (₹) *</Label>
              <Input
                id="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={(e) => handleInputChange('dailyRate', parseFloat(e.target.value) || 0)}
                placeholder="6000"
                min="0"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Downtown Farm Equipment"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the machine's features and capabilities..."
              rows={3}
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <Button type="button" onClick={handleAddFeature} variant="outline">
                Add
              </Button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-md">
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => handleInputChange('available', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="available">Available for booking</Label>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Initial Rating</Label>
            <Input
              id="rating"
              type="number"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
              placeholder="4.0"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="agriculture">
              Add Machine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
