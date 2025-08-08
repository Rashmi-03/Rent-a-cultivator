import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    companyName: 'Rent a Cultivator',
    contactEmail: 'admin@rentacultivator.com',
    contactPhone: '+91 98765 43210',
    autoApproveBookings: false,
    emailNotifications: true,
    maintenanceAlerts: true,
    maxDailyRate: 9000
  });

  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('admin-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved!",
      description: "Your settings have been updated successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Admin Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input
              value={settings.contactPhone}
              onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Daily Rate (₹)</Label>
            <Input
              type="number"
              value={settings.maxDailyRate}
              onChange={(e) => setSettings(prev => ({ ...prev, maxDailyRate: parseInt(e.target.value) || 9000 }))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-approve bookings</Label>
              <Switch
                checked={settings.autoApproveBookings}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproveBookings: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Email notifications</Label>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Maintenance alerts</Label>
              <Switch
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceAlerts: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
