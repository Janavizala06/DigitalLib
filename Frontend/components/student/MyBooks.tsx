import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Calendar, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MyBooksProps {
    borrowedBooks: any[];
    handleReturnBook: (borrowId: string) => void;
    calculateFine: (dueDate: string) => number;
}

export function MyBooks({ borrowedBooks, handleReturnBook, calculateFine }: MyBooksProps) {
    if (borrowedBooks.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No borrowed books</h3>
                    <p className="text-gray-600">Start exploring our catalog to borrow your first book!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((book) => {
                const isOverdue = new Date(book.dueDate) < new Date()
                const daysUntilDue = Math.ceil(
                    (new Date(book.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )
                const bookFine = calculateFine(book.dueDate)

                return (
                    <Card
                        key={book._id || book.id}
                        className={`${isOverdue ? "border-red-200 bg-red-50" : daysUntilDue <= 3 ? "border-yellow-200 bg-yellow-50" : ""} shadow-lg`}
                    >
                        <CardContent className="p-4">
                            <div className="flex space-x-4">
                                <Image
                                    src={book.coverUrl || "/placeholder.svg"}
                                    alt={book.title}
                                    width={80}
                                    height={120}
                                    className="rounded-lg object-cover"
                                />
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-semibold">{book.title}</h3>
                                    <p className="text-sm text-gray-600">{book.author}</p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        {isOverdue && (
                                            <div className="flex items-center space-x-2 text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>Overdue by {Math.abs(daysUntilDue)} days</span>
                                            </div>
                                        )}
                                        {!isOverdue && daysUntilDue <= 3 && (
                                            <div className="flex items-center space-x-2 text-yellow-600">
                                                <Clock className="h-4 w-4" />
                                                <span>Due in {daysUntilDue} days</span>
                                            </div>
                                        )}
                                        {bookFine > 0 && (
                                            <div className="text-red-600 font-semibold">Fine: ₹{bookFine.toFixed(2)}</div>
                                        )}
                                    </div>
                                    <Button onClick={() => handleReturnBook(book._id || book.id)} size="sm" className="w-full">
                                        Return Book
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
