import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Upload, X, Image as ImageIcon } from "lucide-react";
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
  stock?: number;
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
    rating: 4.0,
    stock: 1
  });

  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsImageUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, image: result }));
      setImagePreview(result);
      setIsImageUploading(false);
      
      toast({
        title: "Image Uploaded!",
        description: "Image has been successfully uploaded and converted.",
      });
    };

    reader.onerror = () => {
      setIsImageUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
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
    
    if (!formData.name || !formData.category || !formData.location || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including an image.",
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

    onAddMachine(formData);
    onClose();
    
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
      rating: 4.0,
      stock: 1
    });
    setImagePreview('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Machine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="image">Machine Image *</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isImageUploading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: JPEG, PNG, GIF. Max size: 5MB
                </p>
              </div>
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Machine preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                {isImageUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white">Uploading...</div>
                  </div>
                )}
              </div>
            )}
            
            {!imagePreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Click to upload machine image</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
              </div>
            )}
          </div>

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

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
                placeholder="800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate (₹) *</Label>
              <Input
                id="dailyRate"
                type="number"
                min="0"
                value={formData.dailyRate}
                onChange={(e) => handleInputChange('dailyRate', parseInt(e.target.value) || 0)}
                placeholder="6000"
                required
              />
            </div>
          </div>

          {/* Location and Description */}
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the machine's features and capabilities..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., GPS Navigation)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <Button type="button" onClick={handleAddFeature} variant="outline">
                Add
              </Button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-secondary px-3 py-1 rounded-full">
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

          {/* Rating, Availability, and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={formData.rating.toString()} onValueChange={(value) => handleInputChange('rating', parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available">Availability</Label>
              <Select value={formData.available.toString()} onValueChange={(value) => handleInputChange('available', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                min="1"
                value={formData.stock || 1}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isImageUploading}>
              {isImageUploading ? 'Uploading...' : 'Add Machine'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
