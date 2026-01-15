import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/context/StoreContext';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { state } = useStore();
  const { isAuthenticated } = state;
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: 'Please log in', description: 'You need to be logged in to submit a review.', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Rating required', description: 'Please select a star rating.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createReview(productId, rating, comment || undefined);
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      setRating(0);
      setComment('');
      onReviewSubmitted?.();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to submit review', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-secondary/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Please <a href="/login" className="text-primary hover:underline">log in</a> to write a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-semibold">Write a Review</h4>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-warning text-warning"
                    : "fill-muted text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Textarea
          placeholder="Share your experience with this product (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
