"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs" // Import TabsContent
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import DropdownMenu components

import {
    Search,
    BookOpen,
    Star,
    Calendar,
    User,
    Bell,
    Eye,
    Clock,
    AlertCircle,
    CheckCircle,
    QrCode,
    Camera,
    Download,
    Share,
    MapPin,
    FileText,
    BookMarked,
    Target,
    Award,
    TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Add the calculateFine function at the top of the file, before the default export.
// This function calculates the fine based on the due date and the current date.
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
        read: true, // Mark as read to match the image
    },
]

export default function StudentDashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [books, setBooks] = useState<any[]>([]) // Removed mockBooks and fixed type
    const [borrowedBooks, setBorrowedBooks] = useState<any[]>([])
    const [reservations, setReservations] = useState(mockReservations)
    const [notifications, setNotifications] = useState<any[]>(initialNotifications) // Use initialNotifications
    const [selectedBook, setSelectedBook] = useState<any>(null)
    const [showScanner, setShowScanner] = useState(false)
    const [showBookDetail, setShowBookDetail] = useState(false)
    const [activeTab, setActiveTab] = useState("browse")
    const [userName, setUserName] = useState("")
    const [studentId, setStudentId] = useState("")  // Added state for studentId
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
    const [showReviewForm, setShowReviewForm] = useState(false)
    const router = useRouter()

    // Add reviews state
    const [reviews, setReviews] = useState<any[]>([])

    // Fetch reviews when a book is selected
    useEffect(() => {
        if (selectedBook) {
            fetch(`http://localhost:5000/api/reviews/${selectedBook._id || selectedBook.id}`)
                .then((res) => res.json())
                .then((data) => setReviews(data))
                .catch(() => setReviews([]))
        }
    }, [selectedBook])

    useEffect(() => {
        const name = localStorage.getItem("userName") || "Janavi"
        setUserName(name)
        const id = localStorage.getItem("studentId") || "S123456"  // Fetch studentId from localStorage or use default
        setStudentId(id)

        // Fetch books data from backend API with full URL including port 5000
        fetch('http://localhost:5000/api/books')
            .then((response) => response.json())
            .then((data) => {
                setBooks(data)
            })
            .catch((error) => {
                console.error('Error fetching books:', error)
            })

        // Fetch borrowed books for the student from backend
        fetch(`http://localhost:5000/api/borrowedBooks/${id}`)
            .then((response) => response.json())
            .then((data) => {
                // Map backend borrowed books to frontend format
                const mappedBorrowedBooks = data.map((item: any) => ({
                    id: item.bookId._id,
                    title: item.bookId.title,
                    author: item.bookId.author,
                    borrowDate: new Date(item.borrowDate).toISOString().split("T")[0],
                    dueDate: new Date(item.dueDate).toISOString().split("T")[0],
                    coverUrl: item.bookId.coverUrl,
                }))
                setBorrowedBooks(mappedBorrowedBooks)
            })
            .catch((error) => {
                console.error('Error fetching borrowed books:', error)
            })
    }, [])


    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.includes(searchTerm)
        const matchesCategory = selectedCategory === "all" || book.category.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    // Update the categories array to include all categories:
    const categories = [
        "all",
        "Fiction",
        "Non-Fiction",
        "Science",
        "Technology",
        "Business",
        "History",
        "Biography",
        "Self-Help",
        "Finance",
        "Literature",
    ]

    const handleBorrowBook = (bookId: number) => {
        const book = books.find((b) => b.id === bookId)
        if (book && book.available) {
            // Call backend API to borrow book
            fetch('http://localhost:5000/api/borrowedBooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    bookId: book._id, // Use MongoDB ObjectId string
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to borrow book')
                    }
                    return response.json()
                })
                .then((data) => {
                    // Update borrowedBooks state with new borrowed book
                    const borrowedBook = {
                        id: book._id,
                        title: book.title,
                        author: book.author,
                        borrowDate: new Date(data.borrowDate).toISOString().split("T")[0],
                        dueDate: new Date(data.dueDate).toISOString().split("T")[0],
                        coverUrl: book.coverUrl,
                    }
                    setBorrowedBooks([...borrowedBooks, borrowedBook])
                    // Update books state to mark book as unavailable
                    setBooks(
                        books.map((b) =>
                            b.id === bookId ? { ...b, available: false, availableCopies: b.availableCopies - 1 } : b,
                        ),
                    )
                    setShowBookDetail(false)
                })
                .catch((error) => {
                    console.error('Error borrowing book:', error)
                    alert('Failed to borrow book. Please try again.')
                })
        }
    }

    const handleReserveBook = (bookId: number) => {
        const book = books.find((b) => b.id === bookId)
        if (book && !book.available) {
            const reservation = {
                id: book.id,
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

    const handleReturnBook = (bookId: number) => {
        setBorrowedBooks(borrowedBooks.filter((b) => b.id !== bookId))
        setBooks(
            books.map((b) => (b.id === bookId ? { ...b, available: true, availableCopies: b.availableCopies + 1 } : b)),
        )
    }

    const handleViewBook = (book: any) => {
        setSelectedBook(book)
        setShowBookDetail(true)
    }

    // Update handleSubmitReview to POST to backend
    const handleSubmitReview = async () => {
        if (newReview.comment.trim() && selectedBook) {
            const reviewPayload = {
                bookId: selectedBook._id || selectedBook.id,
                studentId: studentId,
                studentName: userName,
                rating: newReview.rating,
                review: newReview.comment,
            }
            try {
                const res = await fetch('http://localhost:5000/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewPayload),
                })
                if (!res.ok) throw new Error('Failed to submit review')
                const savedReview = await res.json()
                setReviews([savedReview, ...reviews])
                setNewReview({ rating: 5, comment: '' })
            setShowReviewForm(false)
            } catch (err) {
                alert('Error submitting review. Please try again.')
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("userRole")
        localStorage.removeItem("userName")
        router.push("/")
    }

    const handleViewProfile = () => {
        alert("Profile functionality coming soon!")
        // In a real application, you would open a modal or navigate to a profile page here.
    }

    const unreadNotifications = notifications.filter((n: any) => !n.read).length
    const readingProgress = 10
    // In the 'StudentDashboard' component, update the 'totalFines' calculation to use the new 'calculateFine' function.
    // Replace the existing 'const totalFines = borrowedBooks.reduce((sum, book) => sum + book.fine, 0);' line with:
    const totalFines = borrowedBooks.reduce((sum, book) => sum + calculateFine(book.dueDate), 0)
    const readingScore = 4.2

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

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map((n: any) => ({ ...n, read: true })))
    }

    const handleNotificationClick = (notificationId: number) => {
        setNotifications(notifications.map((n: any) => (n.id === notificationId ? { ...n, read: true } : n)))
        // Optionally, navigate to a specific tab or open a modal based on notification type
        // For example, if it's a reservation available notification, you might want to go to the reservations tab.
        // setActiveTab("notifications"); // This would take them to the full notifications tab
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Header */}
            <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 rounded-full p-2">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">DigitalLib Student</h1>
                                <p className="text-sm opacity-90">Your Digital Reading Experience</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowScanner(true)}
                                className="text-white hover:bg-white/20"
                            >
                                <QrCode className="h-4 w-4 mr-2" />
                                Scan
                            </Button>
                            <div className="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                            <Bell className="h-4 w-4" />
                                            {unreadNotifications > 0 && (
                                                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                                                    {unreadNotifications}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 p-2">
                                        <DropdownMenuLabel className="font-bold text-lg mb-2">Notifications</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {notifications.length === 0 ? (
                                            <DropdownMenuItem className="text-gray-500 italic">No new notifications</DropdownMenuItem>
                                        ) : (
                                            notifications.map((notification: any) => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification.id)}
                                                    className={`flex items-start space-x-3 py-3 px-2 rounded-md cursor-pointer ${!notification.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-1 ${!notification.read ? "bg-blue-500" : "bg-gray-300"
                                                            }`}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">
                                                            {notification.type
                                                                .replace(/_/g, " ")
                                                                .split(" ")
                                                                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                                                .join(" ")}
                                                        </p>
                                                        <p className="text-gray-700 text-sm">{notification.message}</p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {new Date(notification.date).toLocaleDateString("en-GB")}
                                                        </p>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                        {notifications.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-center text-blue-600 hover:text-blue-800 cursor-pointer py-2"
                                                >
                                                    Mark all as read
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setActiveTab("notifications")}
                                                    className="text-center text-blue-600 hover:text-blue-800 cursor-pointer py-2"
                                                >
                                                    View all notifications
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* Add the Profile button here */}
                            <Button variant="ghost" size="sm" onClick={handleViewProfile} className="text-white hover:bg-white/20">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
                                <User className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Welcome Section */}
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Target className="h-6 w-6 text-yellow-300" />
                                <h2 className="text-3xl font-bold">Welcome , {userName}!</h2>
                            </div>
                            <p className="text-lg opacity-90">Ready to explore new worlds of knowledge today?</p>

                            <div className="mt-4 flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-300" />
                                    <span className="text-sm">Reading Goal: {readingProgress}% Complete</span>
                                </div>
                                <div className="w-48 bg-white/20 rounded-full h-2">
                                    <div
                                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${readingProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">

                            <div className="text-sm opacity-90">Student ID</div>
                            <div className="text-2xl font-bold">{studentId}</div>
                            <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Books Borrowed</p>
                                    <p className="text-3xl font-bold text-blue-600">{borrowedBooks.length}</p>
                                    <p className="text-green-600 text-sm flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Check out now!
                                    </p>
                                </div>
                                <div className="bg-blue-500 rounded-xl p-3">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Reserved Books</p>
                                    <p className="text-3xl font-bold text-purple-600">{reservations.length}</p>
                                    <p className="text-orange-600 text-sm flex items-center mt-1">
                                        <Clock className="h-3 w-3 mr-1" />available soon
                                    </p>
                                </div>
                                <div className="bg-purple-500 rounded-xl p-3">
                                    <BookMarked className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Pending Fines</p>
                                    <p className="text-3xl font-bold text-red-600">₹{totalFines.toFixed(1)}</p>
                                    <p className="text-red-600 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Pay by due date
                                    </p>
                                </div>
                                <div className="bg-red-500 rounded-xl p-3">
                                    <AlertCircle className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Reading Score</p>
                                    <p className="text-3xl font-bold text-green-600">{readingScore}</p>
                                    <p className="text-green-600 text-sm flex items-center mt-1">
                                        <Award className="h-3 w-3 mr-1" />
                                        Excellent reader
                                    </p>
                                </div>
                                <div className="bg-green-500 rounded-xl p-3">
                                    <Star className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Tabs */}
                <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

                    {/* Search and Filter */}
                    {activeTab === "browse" && (
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Search books by title, author, or ISBN..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full md:w-48 h-12 border-gray-200">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category === "all" ? "All Categories" : category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Content based on active tab */}
                    {activeTab === "browse" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
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
                                            {/* Update the category badge colors in the book cards:
                      Replace the existing badge className with this enhanced version: */}
                                            <Badge
                                                className={`${book.category === "Fiction"
                                                    ? "bg-purple-500"
                                                    : book.category === "Non-Fiction"
                                                        ? "bg-gray-600"
                                                        : book.category === "Science"
                                                            ? "bg-green-500"
                                                            : book.category === "Technology"
                                                                ? "bg-blue-500"
                                                                : book.category === "Business"
                                                                    ? "bg-orange-500"
                                                                    : book.category === "History"
                                                                        ? "bg-red-500"
                                                                        : book.category === "Biography"
                                                                            ? "bg-yellow-600"
                                                                            : book.category === "Self-Help"
                                                                                ? "bg-pink-500"
                                                                                : book.category === "Finance"
                                                                                    ? "bg-indigo-500"
                                                                                    : book.category === "Literature"
                                                                                        ? "bg-teal-500"
                                                                                        : "bg-gray-500"
                                                    } text-white`}
                                            >
                                                {book.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md flex items-center space-x-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{book.rating}</span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm">{book.author}</p>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>
                                                    Available: {book.availableCopies}/{book.totalCopies}
                                                </span>
                                                <span>{book.pages} pages</span>
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
                                                {book.available ? (
                                                    <Button
                                                        onClick={() => handleBorrowBook(book.id)}
                                                        size="sm"
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Borrow
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleReserveBook(book.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                    >
                                                        Reserve
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* My Books Tab */}
                    <TabsContent value="mybooks" className="space-y-6">
                        <h2 className="text-2xl font-bold">My Borrowed Books</h2>
                        {borrowedBooks.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No borrowed books</h3>
                                    <p className="text-gray-600">Start exploring our catalog to borrow your first book!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {borrowedBooks.map((book) => {
                                    const isOverdue = new Date(book.dueDate) < new Date()
                                    const daysUntilDue = Math.ceil(
                                        (new Date(book.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                                    )

                                    // In the 'My Books' tab content, within the 'borrowedBooks.map' function, update how the fine is displayed.
                                    // Replace the existing 'const bookFine = book.fine;' (if it existed) and the fine display logic with:
                                    const bookFine = calculateFine(book.dueDate) // Calculate fine for the current book

                                    return (
                                        <Card
                                            key={book.id}
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
                                                            {/* Then, within the JSX for displaying the fine, replace:
                              {book.fine > 0 && (
                                <div className="text-red-600 font-semibold">Fine: ₹{book.fine.toFixed(2)}</div>
                              )}
                              with: */}
                                                            {bookFine > 0 && (
                                                                <div className="text-red-600 font-semibold">Fine: ₹{bookFine.toFixed(2)}</div>
                                                            )}
                                                        </div>
                                                        <Button onClick={() => handleReturnBook(book.id)} size="sm" className="w-full">
                                                            Return Book
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Reservations Tab */}
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

                    {/* Recommended Tab */}
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
                                            <span className="text-sm font-medium">{book.rating}</span>
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
                                                    onClick={() => handleBorrowBook(book.id)}
                                                    size="sm"
                                                    className="flex-1 bg-green-500 hover:bg-green-600"
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

                    {/* Notifications Tab */}
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

            {/* Enhanced Book Detail Modal */}
            <Dialog open={showBookDetail} onOpenChange={setShowBookDetail}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-blue-600">Book Details</DialogTitle>
                    </DialogHeader>

                    {selectedBook && (
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
                                    <div className="flex justify-center">{renderStars(selectedBook.rating, "lg")}</div>
                                    <p className="text-gray-600">({selectedBook.reviews} reviews)</p>

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
                                        <span>{selectedBook.shelfNumber}</span>
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
                                        <span>{selectedBook.publishedYear}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Pages:</span>
                                        <span>{selectedBook.pages}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                                        onClick={() => handleBorrowBook(selectedBook.id)}
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
                                                <span className="font-medium">Language:</span> {selectedBook.language}
                                            </div>
                                            <div>
                                                <span className="font-medium">Format:</span> {selectedBook.format}
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
                                                            {review.studentName
                                                                ? review.studentName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                                                                : ''}
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
                    )}
                </DialogContent>
            </Dialog>

            {/* Barcode Scanner Modal */}
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
    )
}
