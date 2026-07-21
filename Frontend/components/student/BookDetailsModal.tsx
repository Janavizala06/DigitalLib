import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, MapPin, BookOpen, Calendar, FileText, Share, Download, Eye } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"
import type { User } from "@/types"

interface BookDetailsModalProps {
    showBookDetail: boolean;
    setShowBookDetail: (show: boolean) => void;
    selectedBook: any;
    handleBorrowBook: (bookId: string) => void;
    user: User | null;
}

export function BookDetailsModal({
    showBookDetail,
    setShowBookDetail,
    selectedBook,
    handleBorrowBook,
    user
}: BookDetailsModalProps) {
    const [reviews, setReviews] = useState<any[]>([])
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
    const [showReviewForm, setShowReviewForm] = useState(false)

    useEffect(() => {
        if (selectedBook && showBookDetail) {
            api.getReviews(selectedBook._id || selectedBook.id)
                .then((data) => setReviews(data))
                .catch(() => setReviews([]))
        }
    }, [selectedBook, showBookDetail])

    const handleSubmitReview = async () => {
        if (newReview.comment.trim() && selectedBook && user) {
            try {
                const savedReview = await api.addReview(selectedBook._id || selectedBook.id, newReview.rating, newReview.comment)
                setReviews([savedReview, ...reviews])
                setNewReview({ rating: 5, comment: '' })
                setShowReviewForm(false)
            } catch (err) {
                alert('Error submitting review. Please try again.')
            }
        }
    }

    const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        )
    }

    if (!selectedBook) return null;

    return (
        <Dialog open={showBookDetail} onOpenChange={setShowBookDetail}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">Book Details</DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Book Info */}
                    <div className="space-y-6">
                        <div className="relative">
                            <Image
                                src={selectedBook.coverUrl || "/placeholder.svg"}
                                alt={selectedBook.title}
                                width={300}
                                height={400}
                                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                            />
                        </div>

                        <div className="text-center space-y-4">
                            <div className="flex justify-center">{renderStars(selectedBook.rating || 0, "lg")}</div>
                            <p className="text-gray-600">({selectedBook.reviews || 0} reviews)</p>

                            <Badge
                                className={`${selectedBook.category === "Fiction" ? "bg-purple-500" : selectedBook.category === "Non-Fiction" ? "bg-gray-600" : selectedBook.category === "Science" ? "bg-green-500" : selectedBook.category === "Technology" ? "bg-blue-500" : selectedBook.category === "Business" ? "bg-orange-500" : selectedBook.category === "History" ? "bg-red-500" : selectedBook.category === "Biography" ? "bg-yellow-600" : selectedBook.category === "Self-Help" ? "bg-pink-500" : selectedBook.category === "Finance" ? "bg-indigo-500" : selectedBook.category === "Literature" ? "bg-teal-500" : "bg-gray-500"} text-white text-lg px-4 py-2`}
                            >
                                {selectedBook.category}
                            </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Shelf:</span>
                                <span>{selectedBook.shelfNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Available:</span>
                                <span>
                                    {selectedBook.availableCopies}/{selectedBook.totalCopies}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Published:</span>
                                <span>{selectedBook.publishedYear || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Pages:</span>
                                <span>{selectedBook.pages || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                                onClick={() => handleBorrowBook(selectedBook._id || selectedBook.id)}
                                disabled={!selectedBook.available}
                            >
                                {selectedBook.available ? "Borrow Book" : "Not Available"}
                            </Button>

                            <Button variant="outline" className="w-full h-12 bg-transparent">
                                <Eye className="h-4 w-4 mr-2" />
                                Read Online
                            </Button>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details & Reviews */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
                            <p className="text-xl text-gray-600 mb-4">by {selectedBook.author}</p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{selectedBook.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">ISBN:</span> {selectedBook.isbn}
                                    </div>
                                    <div>
                                        <span className="font-medium">Publisher:</span> {selectedBook.publisher}
                                    </div>
                                    <div>
                                        <span className="font-medium">Language:</span> {selectedBook.language || 'English'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Format:</span> {selectedBook.format || 'Digital/Physical'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-bold">Reviews & Ratings</h3>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    All Reviews
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                >
                                    Write Review
                                </Button>
                            </div>

                            {/* Review Form */}
                            {showReviewForm && (
                                <Card className="border-2 border-blue-200">
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Your Rating</label>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setNewReview({ ...newReview, rating })}
                                                        className="p-1"
                                                    >
                                                        <Star
                                                            className={`h-6 w-6 ${rating <= newReview.rating
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
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {reviews.map((review) => (
                                    <Card key={review._id || review.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                                                    {(review.studentName || review.userName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold">{review.studentName || review.userName}</p>
                                                            <div className="flex items-center space-x-2">
                                                                {renderStars(review.rating)}
                                                                <span className="text-sm text-gray-500">
                                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : (review.date ? new Date(review.date).toLocaleDateString() : '')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700">{review.review || review.comment}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
