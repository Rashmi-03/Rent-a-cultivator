import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Feedback {
  id: string;
  customerName: string;
  machineName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'resolved' | 'ignored';
}

const mockFeedback: Feedback[] = [
  { id: '1', customerName: 'John Smith', machineName: 'John Deere 6120M', rating: 5, comment: 'Excellent service! Machine was in perfect condition and delivery was on time.', date: '2024-07-20', status: 'resolved' },
  { id: '2', customerName: 'Sarah Johnson', machineName: 'Case IH Axial-Flow 250', rating: 4, comment: 'Good equipment but could use better instructions for operation.', date: '2024-07-18', status: 'pending' },
  { id: '3', customerName: 'Mike Brown', machineName: 'New Holland T6.180', rating: 3, comment: 'Machine had some minor issues but support team was helpful.', date: '2024-07-15', status: 'resolved' },
  { id: '4', customerName: 'Lisa Davis', machineName: 'Mahindra Round Baler', rating: 5, comment: 'Perfect for our needs. Highly recommend!', date: '2024-07-12', status: 'resolved' },
  { id: '5', customerName: 'David Wilson', machineName: 'Front-End Loader', rating: 2, comment: 'Machine was not as described. Needs maintenance.', date: '2024-07-10', status: 'pending' }
];

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'ignored'>('all');
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: Feedback['status']) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    toast({ title: "Status Updated!", description: "Feedback status has been changed." });
  };

  const filteredFeedback = feedback.filter(f => filter === 'all' || f.status === filter);
  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Customer Feedback</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Average Rating</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {feedback.length} total reviews
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {(['all', 'pending', 'resolved', 'ignored'] as const).map(status => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Feedback List */}
          <div className="space-y-3">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.customerName}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.machineName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <Badge variant={
                    item.status === 'resolved' ? 'default' : 
                    item.status === 'pending' ? 'secondary' : 'outline'
                  }>
                    {item.status}
                  </Badge>
                </div>
                
                <div className="mb-2">
                  {renderStars(item.rating)}
                </div>
                
                <p className="text-sm mb-3">{item.comment}</p>
                
                <div className="flex space-x-2">
                  {item.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleStatusChange(item.id, 'resolved')}>
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(item.id, 'ignored')}>
                        Ignore
                      </Button>
                    </>
                  )}
                  {item.status === 'ignored' && (
                    <Button size="sm" onClick={() => handleStatusChange(item.id, 'pending')}>
                      Reopen
                    </Button>
                  )}
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
