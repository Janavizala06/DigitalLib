"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Clock, Eye, Star, Camera, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

import { StudentHeader } from "@/components/student/StudentHeader"
import { DashboardOverview } from "@/components/student/DashboardOverview"
import { BookCatalog } from "@/components/student/BookCatalog"
import { MyBooks } from "@/components/student/MyBooks"
import { BookDetailsModal } from "@/components/student/BookDetailsModal"

// Add the calculateFine function at the top of the file, before the default export.
const calculateFine = (dueDate: string): number => {
    const due = new Date(dueDate)
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Normalize current date to start of day
    due.setHours(0, 0, 0, 0) // Normalize due date to start of day

    if (now > due) {
        const diffTime = Math.abs(now.getTime() - due.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays * 5 // ₹5 per day
    }
    return 0
}

const mockReservations: any[] = []
const initialNotifications = [
    {
        id: 1,
        type: "book_overdue",
        message: "The Psychology of Money is 15 days overdue.",
        date: "2025-02-15",
        read: false,
    },
    {
        id: 2,
        type: "due_reminder",
        message: "Atomic Habits is due in 2 days (Feb 25th)",
        date: "2025-07-19",
        read: false,
    },
    {
        id: 3,
        type: "reservation_available",
        message: "Atomic Habits is now available for pickup",
        date: "2025-07-05",
        read: true,
    },
]

const categories = [
    "all", "Fiction", "Non-Fiction", "Science", "Technology", "Business",
    "History", "Biography", "Self-Help", "Finance", "Literature",
]

export default function StudentDashboard() {
    const { user, logout } = useAuth()
    const router = useRouter()
    
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [books, setBooks] = useState<any[]>([])
    const [borrowedBooks, setBorrowedBooks] = useState<any[]>([])
    const [reservations, setReservations] = useState(mockReservations)
    const [notifications, setNotifications] = useState<any[]>(initialNotifications)
    const [selectedBook, setSelectedBook] = useState<any>(null)
    const [showScanner, setShowScanner] = useState(false)
    const [showBookDetail, setShowBookDetail] = useState(false)
    const [activeTab, setActiveTab] = useState("browse")

    useEffect(() => {
        // Fetch real data using api.ts
        api.getBooks()
            .then((data) => setBooks(data.books || (Array.isArray(data) ? data : [])))
            .catch((error) => console.error('Error fetching books:', error))

        api.getMyBorrowedBooks()
            .then((data) => {
                const mappedBorrowedBooks = data.map((item: any) => ({
                    id: item._id, // BorrowedBook ID
                    bookId: item.bookId?._id || item.bookId,
                    title: item.bookId?.title || 'Unknown Title',
                    author: item.bookId?.author || 'Unknown Author',
                    borrowDate: item.borrowDate ? new Date(item.borrowDate).toISOString().split("T")[0] : '',
                    dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : '',
                    coverUrl: item.bookId?.coverUrl || '',
                }))
                setBorrowedBooks(mappedBorrowedBooks)
            })
            .catch((error) => console.error('Error fetching borrowed books:', error))
    }, [])

    const handleBorrowBook = async (bookId: string) => {
        const book = books.find((b) => (b._id || b.id) === bookId)
        if (book && book.available) {
            try {
                const data = await api.borrowBook(book._id || book.id)
                const borrowedBook = {
                    id: data._id,
                    bookId: book._id || book.id,
                    title: book.title,
                    author: book.author,
                    borrowDate: new Date(data.borrowDate).toISOString().split("T")[0],
                    dueDate: new Date(data.dueDate).toISOString().split("T")[0],
                    coverUrl: book.coverUrl,
                }
                setBorrowedBooks([...borrowedBooks, borrowedBook])
                setBooks(
                    books.map((b) =>
                        (b._id || b.id) === bookId ? { ...b, available: false, availableCopies: b.availableCopies - 1 } : b,
                    ),
                )
                setShowBookDetail(false)
            } catch (error) {
                console.error('Error borrowing book:', error)
                alert('Failed to borrow book. Please try again.')
            }
        }
    }

    const handleReserveBook = (bookId: string) => {
        const book = books.find((b) => (b._id || b.id) === bookId)
        if (book && !book.available) {
            const reservation = {
                id: book._id || book.id,
                title: book.title,
                author: book.author,
                position: Math.floor(Math.random() * 3) + 1,
                estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                coverUrl: book.coverUrl,
            }
            setReservations([...reservations, reservation])
            setShowBookDetail(false)
        }
    }

    const handleReturnBook = async (borrowId: string) => {
        try {
            await api.returnBook(borrowId)
            const returnedBorrow = borrowedBooks.find(b => b.id === borrowId);
            setBorrowedBooks(borrowedBooks.filter((b) => b.id !== borrowId))
            if (returnedBorrow) {
                setBooks(
                    books.map((b) => (b._id || b.id) === returnedBorrow.bookId ? { ...b, available: true, availableCopies: b.availableCopies + 1 } : b),
                )
            }
        } catch (error) {
            console.error('Error returning book:', error)
            alert('Failed to return book. Please try again.')
        }
    }

    const handleViewBook = (book: any) => {
        setSelectedBook(book)
        setShowBookDetail(true)
    }

    const handleMarkAllAsRead = () => setNotifications(notifications.map((n: any) => ({ ...n, read: true })))

    const handleNotificationClick = (notificationId: number) => {
        setNotifications(notifications.map((n: any) => (n.id === notificationId ? { ...n, read: true } : n)))
    }

    const unreadNotifications = notifications.filter((n: any) => !n.read).length
    const readingProgress = 10
    const totalFines = borrowedBooks.reduce((sum, book) => sum + calculateFine(book.dueDate), 0)
    const readingScore = 4.2

    return (
        <AuthGuard requiredRole="student">
            <div className="min-h-screen bg-gray-50">
                <StudentHeader
                    userName={user?.name || "Student"}
                    studentId={user?.studentId || "N/A"}
                    readingProgress={readingProgress}
                    unreadNotifications={unreadNotifications}
                    notifications={notifications}
                    setShowScanner={setShowScanner}
                    handleNotificationClick={handleNotificationClick}
                    handleMarkAllAsRead={handleMarkAllAsRead}
                    setActiveTab={setActiveTab}
                    handleLogout={logout}
                />

                <div className="container mx-auto px-4 py-8">
                    <DashboardOverview
                        borrowedBooksCount={borrowedBooks.length}
                        reservationsCount={reservations.length}
                        totalFines={totalFines}
                        readingScore={readingScore}
                    />

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <div className="mb-8">
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                {[
                                    { id: "browse", label: "Browse Books" },
                                    { id: "mybooks", label: "My Books" },
                                    { id: "reservations", label: "Reservations" },
                                    { id: "recommended", label: "Recommended" },
                                    { id: "notifications", label: "Alerts", badge: unreadNotifications > 0 ? unreadNotifications : null },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${activeTab === tab.id
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                            } flex items-center justify-center`}
                                    >
                                        {tab.label}
                                        {tab.id === "notifications" && tab.badge !== null && (
                                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                                                {tab.badge}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === "browse" && (
                            <BookCatalog
                                books={books}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                categories={categories}
                                handleViewBook={handleViewBook}
                                handleBorrowBook={handleBorrowBook}
                                handleReserveBook={handleReserveBook}
                            />
                        )}

                        <TabsContent value="mybooks" className="space-y-6">
                            <h2 className="text-2xl font-bold">My Borrowed Books</h2>
                            <MyBooks
                                borrowedBooks={borrowedBooks}
                                handleReturnBook={handleReturnBook}
                                calculateFine={calculateFine}
                            />
                        </TabsContent>

                        <TabsContent value="reservations" className="space-y-6">
                            <h2 className="text-2xl font-bold">My Reservations</h2>
                            {reservations.length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No reservations</h3>
                                        <p className="text-gray-600">
                                            Reserve books that are currently borrowed to get notified when they become available.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {reservations.map((reservation) => (
                                        <Card key={reservation.id} className="shadow-lg">
                                            <CardContent className="p-4">
                                                <div className="flex space-x-4">
                                                    <Image
                                                        src={reservation.coverUrl || "/placeholder.svg"}
                                                        alt={reservation.title}
                                                        width={80}
                                                        height={120}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 space-y-2">
                                                        <h3 className="font-semibold">{reservation.title}</h3>
                                                        <p className="text-sm text-gray-600">{reservation.author}</p>
                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <Badge variant="outline">Position #{reservation.position} in queue</Badge>
                                                            <span className="text-gray-600">
                                                                Est. available: {new Date(reservation.estimatedDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <Button variant="outline" size="sm">
                                                            Cancel Reservation
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="recommended" className="space-y-6">
                            <h2 className="text-2xl font-bold">Recommended for You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {books.slice(0, 12).map((book) => (
                                    <Card
                                        key={book._id || book.id}
                                        className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                                    >
                                        <div className="relative">
                                            <Image
                                                src={book.coverUrl || "/placeholder.svg"}
                                                alt={book.title}
                                                width={300}
                                                height={400}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-green-500 text-white">Recommended</Badge>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md flex items-center space-x-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{book.rating || "N/A"}</span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                                                    <p className="text-gray-600 text-sm">{book.author}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 bg-transparent"
                                                        onClick={() => handleViewBook(book)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleBorrowBook(book._id || book.id)}
                                                        size="sm"
                                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                                        disabled={!book.available}
                                                    >
                                                        Borrow
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Notifications</h2>
                                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <Card key={notification.id} className={`${!notification.read ? "border-blue-200 bg-blue-50" : ""}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-4">
                                                <div
                                                    className={`p-2 rounded-full ${notification.type === "due_reminder"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : notification.type === "reservation_available"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                        }`}
                                                >
                                                    {notification.type === "due_reminder" && <Clock className="h-4 w-4" />}
                                                    {notification.type === "reservation_available" && <CheckCircle className="h-4 w-4" />}
                                                    {notification.type === "book_overdue" && <AlertCircle className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{notification.message}</p>
                                                    <p className="text-sm text-gray-600">{new Date(notification.date).toLocaleDateString()}</p>
                                                </div>
                                                {!notification.read && <Badge className="bg-blue-500">New</Badge>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <BookDetailsModal
                    showBookDetail={showBookDetail}
                    setShowBookDetail={setShowBookDetail}
                    selectedBook={selectedBook}
                    handleBorrowBook={handleBorrowBook}
                    user={user}
                />

                <Dialog open={showScanner} onOpenChange={setShowScanner}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Scan Book Barcode</DialogTitle>
                            <DialogDescription>Position the barcode within the camera frame or enter manually</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">Camera view would appear here</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Or enter barcode manually:</label>
                                <Input placeholder="Enter ISBN or barcode number" />
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1">Search Book</Button>
                                <Button variant="outline" onClick={() => setShowScanner(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    )
}
