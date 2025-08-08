import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCategories = ['Tractor', 'Harvester', 'Loader', 'Baler', 'Reaper', 'Thresher', 'Cultivator', 'Rotavator', 'Specialty'];

export const CategoriesModal = ({ isOpen, onClose }: CategoriesModalProps) => {
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('machine-categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem('machine-categories', JSON.stringify(newCategories));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      saveCategories(updated);
      setNewCategory('');
      toast({ title: "Category Added!", description: `${newCategory.trim()} has been added.` });
    }
  };

  const handleDeleteCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    saveCategories(updated);
    toast({ title: "Category Deleted!", description: "Category has been removed." });
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[index]);
  };

  const handleEditSave = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...categories];
      updated[editingIndex] = editValue.trim();
      saveCategories(updated);
      setEditingIndex(null);
      setEditValue('');
      toast({ title: "Category Updated!", description: "Category has been modified." });
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Machine Categories</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Category */}
          <div className="flex space-x-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                {editingIndex === index ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                    />
                    <Button size="sm" onClick={handleEditSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleEditCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge variant="secondary">{category}</Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditStart(index)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
