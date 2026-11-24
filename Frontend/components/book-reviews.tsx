"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, User, ThumbsUp } from "lucide-react"

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
}

interface BookReviewsProps {
  bookId: number
  bookTitle: string
}

const mockReviews: Review[] = [
  {
    id: 1,
    userName: "John Doe",
    rating: 5,
    comment:
      "Excellent book! Really changed my perspective on money and investing. The author explains complex concepts in a very accessible way.",
    date: "2024-01-15",
    helpful: 12,
  },
  {
    id: 2,
    userName: "Jane Smith",
    rating: 4,
    comment: "Good read with practical insights. Some chapters were a bit repetitive, but overall worth the time.",
    date: "2024-01-10",
    helpful: 8,
  },
  {
    id: 3,
    userName: "Mike Johnson",
    rating: 5,
    comment:
      "One of the best books on personal finance I've ever read. Highly recommend to anyone looking to improve their financial literacy.",
    date: "2024-01-05",
    helpful: 15,
  },
]

export default function BookReviews({ bookId, bookTitle }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      const review: Review = {
        id: reviews.length + 1,
        userName: "Current User", // In real app, get from auth
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
      }
      setReviews([review, ...reviews])
      setNewReview({ rating: 5, comment: "" })
      setShowReviewForm(false)
    }
  }

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews for {bookTitle}</span>
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>Write Review</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating), "lg")}
              <p className="text-sm text-gray-600 mt-2">{reviews.length} reviews</p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <Card className="border-2 border-blue-200">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} onClick={() => setNewReview({ ...newReview, rating })} className="p-1">
                        <Star
                          className={`h-6 w-6 ${
                            rating <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    placeholder="Share your thoughts about this book..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview}>Submit Review</Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 rounded-full p-2">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Badge variant="outline">Verified Reader</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
