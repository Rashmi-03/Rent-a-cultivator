import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMachines } from "@/hooks/useMachines";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateStockModal = ({ isOpen, onClose }: UpdateStockModalProps) => {
  const { machines, updateMachine } = useMachines();
  const { toast } = useToast();

  const handleToggleAvailability = (machineId: string, currentStatus: boolean) => {
    updateMachine(machineId, { available: !currentStatus });
    toast({
      title: "Stock Updated!",
      description: "Machine availability has been updated successfully.",
    });
  };

  const handleBulkUpdate = (makeAvailable: boolean) => {
    machines.forEach(machine => {
      updateMachine(machine.id, { available: makeAvailable });
    });
    toast({
      title: "Bulk Update Complete!",
      description: `All machines are now ${makeAvailable ? 'available' : 'unavailable'} for booking.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Update Stock</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bulk Actions */}
          <div className="flex space-x-2">
            <Button onClick={() => handleBulkUpdate(true)} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Make All Available
            </Button>
            <Button onClick={() => handleBulkUpdate(false)} variant="outline" size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Make All Unavailable
            </Button>
          </div>

          {/* Machine List */}
          <div className="space-y-2">
            {machines.map((machine) => (
              <div key={machine.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{machine.name}</div>
                  <div className="text-sm text-muted-foreground">{machine.category} • {machine.location}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={machine.available ? "default" : "secondary"}>
                    {machine.available ? "Available" : "Unavailable"}
                  </Badge>
                  <Switch
                    checked={machine.available}
                    onCheckedChange={() => handleToggleAvailability(machine.id, machine.available)}
                  />
                </div>
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
