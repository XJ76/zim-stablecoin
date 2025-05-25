"use client"

import {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  MessageSquare,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Feedback {
  id: string
  userId: string
  userName: string
  content: string
  rating: number
  likes: number
  dislikes: number
  timestamp: string
  isAdmin: boolean
}

export function FeedbackSystem() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [newFeedback, setNewFeedback] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Load feedback from localStorage on component mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem("feedback")
    if (savedFeedback) {
      setFeedback(JSON.parse(savedFeedback))
    }
  }, [])

  // Save feedback to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("feedback", JSON.stringify(feedback))
  }, [feedback])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeedback.trim()) return

    setIsSubmitting(true)

    const feedbackItem: Feedback = {
      id: Date.now().toString(),
      userId: "user_" + Math.random().toString(36).substr(2, 9),
      userName: "Anonymous User",
      content: newFeedback,
      rating,
      likes: 0,
      dislikes: 0,
      timestamp: new Date().toISOString(),
      isAdmin: false,
    }

    setFeedback((prev) => [feedbackItem, ...prev])
    setNewFeedback("")
    setRating(5)
    setIsSubmitting(false)

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!",
    })
  }

  const handleLike = (id: string) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    )
  }

  const handleDislike = (id: string) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dislikes: item.dislikes + 1 } : item
      )
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, questions, or concerns..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant={rating >= star ? "default" : "outline"}
                    size="icon"
                    onClick={() => setRating(star)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <AnimatePresence>
              {feedback.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 last:mb-0"
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.userName}</span>
                            {item.isAdmin && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2">{item.content}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(item.id)}
                          className="gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {item.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDislike(item.id)}
                          className="gap-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          {item.dislikes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 