"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BookOpen,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  QrCode,
  Download,
  Upload,
  BarChart3,
  User,
  Settings,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Add the calculateFine function at the top of the file, before the default export.
const calculateFine = (dueDate: string, returnDate?: string): number => {
  const due = new Date(dueDate)
  const actualDate = returnDate ? new Date(returnDate) : new Date()
  actualDate.setHours(0, 0, 0, 0) // Normalize actual date to start of day
  due.setHours(0, 0, 0, 0) // Normalize due date to start of day

  if (actualDate > due) {
    const diffTime = Math.abs(actualDate.getTime() - due.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * 5 // ₹5 per day
  }
  return 0
}

export default function LibrarianDashboard() {
  const [books, setBooks] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [bookSearchTerm, setBookSearchTerm] = useState("")
  const [memberSearchTerm, setMemberSearchTerm] = useState("")
  const [selectedBookCategory, setSelectedBookCategory] = useState("all")
  const [selectedTransactionType, setSelectedTransactionType] = useState("all")
  const [userName, setUserName] = useState("")
  const router = useRouter()

  // Remove the constant borrowedBooksCount declaration below to avoid redeclaration error
  // const borrowedBooksCount = books.reduce((sum: number, book: any) => sum + book.borrowedCopies, 0)

  // Dialog states for Books
  const [showAddBook, setShowAddBook] = useState(false)
  const [showEditBook, setShowEditBook] = useState(false)
  const [showViewBook, setShowViewBook] = useState(false)
  const [selectedBookToEdit, setSelectedBookToEdit] = useState<any>(null)
  const [selectedBookToView, setSelectedBookToView] = useState<any>(null)

  // Dialog states for Members
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditMember, setShowEditMember] = useState(false)
  const [showViewMember, setShowViewMember] = useState(false)
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState<any>(null)
  const [selectedMemberToView, setSelectedMemberToView] = useState<any>(null)

  // Dialog states for Transactions
  const [showViewTransaction, setShowViewTransaction] = useState(false)
  const [selectedTransactionToView, setSelectedTransactionToView] = useState<any>(null)

  // 1. Ensure all number fields in newBook and selectedBookToEdit are initialized to 0 or 1, not undefined.
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    shelfNumber: "",
    totalCopies: 1,
    description: "",
    publisher: "",
    language: "",
    format: "",
    pages: 0,
    publishedYear: 0,
    coverUrl: "/placeholder.svg?height=300&width=200", // Default placeholder
  })

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
  })

  // Fetch books from localStorage or backend on mount
  useEffect(() => {
    const name = localStorage.getItem("userName") || "Librarian"
    setUserName(name)

    // Fetch books from local storage if available
    const storedBooks = localStorage.getItem("books")
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    } else {
      fetch("http://localhost:5000/api/books")
        .then((res) => res.json())
        .then((data) => {
          setBooks(data)
          localStorage.setItem("books", JSON.stringify(data))
        })
        .catch((error) => {
          console.error("Error fetching books:", error)
          setBooks([])
        })
    }

    // Fetch members from backend
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        // Map users to member structure expected by dashboard
        const mappedMembers = data.map((user: any, idx: number) => ({
          id: user._id || idx + 1,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          joinDate: user.createdAt || new Date().toISOString().split("T")[0],
          booksIssued: 0, // You may update this if you have borrow info
          totalFines: 0,  // You may update this if you have fine info
          status: "active",
          phone: user.phone || "",
        }))
        setMembers(mappedMembers)
      })
      .catch((error) => {
        console.error("Error fetching members:", error)
        setMembers([])
      })

    // Fetch borrowed books from local storage if available, else fetch from backend
    const storedBorrowedBooks = localStorage.getItem("borrowedBooks")
    if (storedBorrowedBooks) {
      try {
        const data = JSON.parse(storedBorrowedBooks)
        const mapped = data.map((item: any) => {
          const today = new Date()
          const dueDate = new Date(item.dueDate)
          let status = 'active'
          let fine = 0
          if (item.returnDate) {
            status = 'returned'
            fine = calculateFine(item.dueDate, item.returnDate)
          } else if (today > dueDate) {
            status = 'overdue'
            fine = calculateFine(item.dueDate)
          }
          return {
            id: item._id,
            type: 'borrow',
            bookTitle: item.bookId?.title || 'Unknown',
            memberName: item.studentId,
            date: new Date(item.borrowDate).toISOString().split('T')[0],
            dueDate: new Date(item.dueDate).toISOString().split('T')[0],
            status,
            fine,
          }
        })
        setTransactions(mapped)
      } catch (error) {
        console.error('Error parsing borrowedBooks from localStorage:', error)
        setTransactions([])
      }
    } else {
      fetch('http://localhost:5000/api/borrowedBooks')
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.map((item: any) => {
            const today = new Date()
            const dueDate = new Date(item.dueDate)
            let status = 'active'
            let fine = 0
            if (item.returnDate) {
              status = 'returned'
              fine = calculateFine(item.dueDate, item.returnDate)
            } else if (today > dueDate) {
              status = 'overdue'
              fine = calculateFine(item.dueDate)
            }
            return {
              id: item._id,
              type: 'borrow',
              bookTitle: item.bookId?.title || 'Unknown',
              memberName: item.studentId,
              date: new Date(item.borrowDate).toISOString().split('T')[0],
              dueDate: new Date(item.dueDate).toISOString().split('T')[0],
              status,
              fine,
            }
          })
          setTransactions(mapped)
          // Update borrowedBooksCount based on mapped borrowedBooks data
          const totalBorrowed = mapped.length
          setBorrowedBooksCount(totalBorrowed)
        })
        .catch((error) => {
          console.error('Error fetching borrowed books:', error)
          setTransactions([])
        })
    }
  }, [])

  // Helper to update books state and localStorage
  const updateBooksAndLocalStorage = (updatedBooks: any[]) => {
    setBooks(updatedBooks)
    localStorage.setItem("books", JSON.stringify(updatedBooks))
  }

  // Add Book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const book = {
      ...newBook,
      totalCopies: Number.isNaN(newBook.totalCopies) ? 1 : newBook.totalCopies,
      pages: Number.isNaN(newBook.pages) ? 0 : newBook.pages,
      publishedYear: Number.isNaN(newBook.publishedYear) ? 0 : newBook.publishedYear,
      availableCopies: Number.isNaN(newBook.totalCopies) ? 1 : newBook.totalCopies,
      borrowedCopies: 0,
      addedDate: new Date().toISOString().split("T")[0],
    }
    try {
      const res = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add book")
      }
      const savedBook = await res.json()
      const updatedBooks = [...books, savedBook]
      updateBooksAndLocalStorage(updatedBooks)
      setNewBook({
        title: "",
        author: "",
        category: "",
        isbn: "",
        shelfNumber: "",
        totalCopies: 1,
        description: "",
        publisher: "",
        language: "",
        format: "",
        pages: 0,
        publishedYear: 0,
        coverUrl: "/placeholder.svg?height=300&width=200",
      })
      setShowAddBook(false)
    } catch (err: any) {
      alert("Error adding book: " + err.message)
    }
  }

  // Edit Book
  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedBookData = {
        ...selectedBookToEdit,
        totalCopies: Number.isNaN(selectedBookToEdit.totalCopies) ? 1 : selectedBookToEdit.totalCopies,
        pages: Number.isNaN(selectedBookToEdit.pages) ? 0 : selectedBookToEdit.pages,
        publishedYear: Number.isNaN(selectedBookToEdit.publishedYear) ? 0 : selectedBookToEdit.publishedYear,
      }
      const res = await fetch(`http://localhost:5000/api/books/${selectedBookToEdit._id || selectedBookToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookData),
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update book")
      }
      const updatedBook = await res.json()
      const updatedBooks = books.map((book) =>
        (book._id || book.id) === (updatedBook._id || updatedBook.id)
          ? updatedBook
          : book
      )
      updateBooksAndLocalStorage(updatedBooks)
      setShowEditBook(false)
      setSelectedBookToEdit(null)
    } catch (err: any) {
      alert("Error updating book: " + err.message)
    }
  }

  // Delete Book
  const handleDeleteBook = async (bookId: string | number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${bookId}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Failed to delete book")
        const updatedBooks = books.filter((book) => (book._id || book.id) !== bookId)
        updateBooksAndLocalStorage(updatedBooks)
      } catch (err) {
        alert("Error deleting book. Please try again.")
      }
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          studentId: newMember.studentId,
          password: newMember.studentId, // Use studentId as default password (or generate one)
          phone: newMember.phone,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add member")
      }
      // After successful registration, fetch updated members list
      const membersRes = await fetch("http://localhost:5000/api/auth/users")
      const membersData = await membersRes.json()
      const mappedMembers = membersData.map((user: any, idx: number) => ({
        id: user._id || idx + 1,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        joinDate: user.createdAt || new Date().toISOString().split("T")[0],
        booksIssued: 0,
        totalFines: 0,
        status: "active",
        phone: user.phone || "",
      }))
      setMembers(mappedMembers)
      setNewMember({
        name: "",
        email: "",
        studentId: "",
        phone: "",
      })
      setShowAddMember(false)
    } catch (err: any) {
      alert("Error adding member: " + err.message)
    }
  }

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault()
    setMembers(members.map((member) => (member.id === selectedMemberToEdit.id ? selectedMemberToEdit : member)))
    setShowEditMember(false)
    setSelectedMemberToEdit(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch =
      book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
      book.isbn.includes(bookSearchTerm)
    const matchesCategory =
      selectedBookCategory === "all" || book.category.toLowerCase() === selectedBookCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const filteredMembers = members.filter((member: any) => {
    const searchTermLower = memberSearchTerm.toLowerCase()
    return (
      (member.name?.toLowerCase() || "").includes(searchTermLower) ||
      (member.email?.toLowerCase() || "").includes(searchTermLower) ||
      (member.studentId?.toLowerCase() || "").includes(searchTermLower)
    )
  })

  const filteredTransactions = transactions.filter((transaction: any) => {
    return selectedTransactionType === "all" || transaction.type === selectedTransactionType
  })

  const totalBooks = books.reduce((sum: number, book: any) => sum + book.totalCopies, 0)
  const availableBooks = books.reduce((sum: number, book: any) => sum + book.availableCopies, 0)
  // const borrowedBooksCount = books.reduce((sum: number, book: any) => sum + book.borrowedCopies, 0)
  const totalFines = transactions.reduce((sum: number, transaction: any) => sum + (transaction.fine || 0), 0)
  const totalMembers = members.length // Calculate total members

  const allCategories = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">DigitalLib Admin</h1>
                <p className="text-sm text-gray-600">Welcome back, {userName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => alert("Settings functionality coming soon!")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <User className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Books</p>
                  <p className="text-3xl font-bold">{totalBooks}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Available</p>
                  <p className="text-3xl font-bold">{availableBooks}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Borrowed</p>
                  <p className="text-3xl font-bold">{borrowedBooksCount}</p>
                </div>
                <Calendar className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Fines</p>
                  <p className="text-3xl font-bold">₹{totalFines.toFixed(2)}</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          {/* New Total Members Card */}
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">Total Members</p>
                  <p className="text-3xl font-bold">{totalMembers}</p>
                </div>
                <Users className="h-12 w-12 text-teal-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Books</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Members</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Books Management */}
          <TabsContent value="books" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Book Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => alert("Import Books functionality coming soon!")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Books
                </Button>
                <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Book</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new book to add to the library catalog.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddBook} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            value={newBook.author}
                            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newBook.category}
                            onValueChange={(value) => setNewBook({ ...newBook, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {allCategories.slice(1).map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="isbn">ISBN</Label>
                          <Input
                            id="isbn"
                            value={newBook.isbn}
                            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shelf">Shelf Number</Label>
                          <Input
                            id="shelf"
                            value={newBook.shelfNumber}
                            onChange={(e) => setNewBook({ ...newBook, shelfNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="copies">Total Copies</Label>
                          <Input
                            id="copies"
                            type="number"
                            min="1"
                            value={Number.isNaN(newBook.totalCopies) ? '' : newBook.totalCopies}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewBook({ ...newBook, totalCopies: Number(value) });
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newBook.description}
                          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="publisher">Publisher</Label>
                          <Input
                            id="publisher"
                            value={newBook.publisher}
                            onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Input
                            id="language"
                            value={newBook.language}
                            onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="format">Format</Label>
                          <Input
                            id="format"
                            value={newBook.format}
                            onChange={(e) => setNewBook({ ...newBook, format: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pages">Pages</Label>
                          <Input
                            id="pages"
                            type="number"
                            min="0"
                            value={Number.isNaN(newBook.pages) ? '' : newBook.pages}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewBook({ ...newBook, pages: Number(value) });
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishedYear">Published Year</Label>
                        <Input
                          id="publishedYear"
                          type="number"
                          min="0"
                          value={Number.isNaN(newBook.publishedYear) ? '' : newBook.publishedYear}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewBook({ ...newBook, publishedYear: Number(value) });
                          }}
                        />
                      </div>
                      {/* New: Book Cover Image URL */}
                      <div className="space-y-2">
                        <Label htmlFor="coverUrl">Book Cover Image URL</Label>
                        <Input
                          id="coverUrl"
                          value={newBook.coverUrl}
                          onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
                          placeholder="e.g., /placeholder.svg or a direct image URL"
                        />
                        {newBook.coverUrl && (
                          <div className="mt-2 flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Preview:</span>
                            <Image
                              src={newBook.coverUrl || "/placeholder.svg"}
                              alt="Cover Preview"
                              width={50}
                              height={75}
                              className="rounded object-cover border"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Add Book
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddBook(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex gap-4">
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={bookSearchTerm}
                onChange={(e) => setBookSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedBookCategory} onValueChange={setSelectedBookCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => alert("Barcode scanning functionality coming soon!")}>
                <QrCode className="h-4 w-4 mr-2" />
                Scan
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Shelf</TableHead>
                    <TableHead>Copies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book: any) => (
                    <TableRow key={book._id || book.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={book.coverUrl || "/placeholder.svg"}
                            alt={book.title}
                            width={40}
                            height={60}
                            className="rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold">{book.title}</p>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${book.category === "Fiction"
                            ? "border-purple-500 text-purple-700 bg-purple-50"
                            : book.category === "Non-Fiction"
                              ? "border-gray-500 text-gray-700 bg-gray-50"
                              : book.category === "Science"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : book.category === "Technology"
                                  ? "border-blue-500 text-blue-700 bg-blue-50"
                                  : book.category === "Business"
                                    ? "border-orange-500 text-orange-700 bg-orange-50"
                                    : book.category === "History"
                                      ? "border-red-500 text-red-700 bg-red-50"
                                      : book.category === "Biography"
                                        ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                                        : book.category === "Self-Help"
                                          ? "border-pink-500 text-pink-700 bg-pink-50"
                                          : book.category === "Finance"
                                            ? "border-indigo-500 text-indigo-700 bg-indigo-50"
                                            : book.category === "Literature"
                                              ? "border-teal-500 text-teal-700 bg-teal-50"
                                              : "border-gray-500 text-gray-700 bg-gray-50"
                            }`}
                        >
                          {book.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.shelfNumber}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Total: {book.totalCopies}</p>
                          <p className="text-green-600">Available: {book.availableCopies}</p>
                          <p className="text-orange-600">Borrowed: {book.borrowedCopies}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={book.availableCopies > 0 ? "default" : "secondary"}>
                          {book.availableCopies > 0 ? "Available" : "All Borrowed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBookToView(book)
                              setShowViewBook(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBookToEdit(book)
                              setShowEditBook(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* View Book Dialog */}
          <Dialog open={showViewBook} onOpenChange={setShowViewBook}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book Details</DialogTitle>
                <DialogDescription>Detailed information about the selected book.</DialogDescription>
              </DialogHeader>
              {selectedBookToView && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <Image
                      src={selectedBookToView.coverUrl || "/placeholder.svg"}
                      alt={selectedBookToView.title}
                      width={200}
                      height={300}
                      className="rounded-lg shadow-lg mb-4"
                    />
                    <Badge
                      className={`${selectedBookToView.category === "Fiction"
                        ? "bg-purple-500"
                        : selectedBookToView.category === "Non-Fiction"
                          ? "bg-gray-600"
                          : selectedBookToView.category === "Science"
                            ? "bg-green-500"
                            : selectedBookToView.category === "Technology"
                              ? "bg-blue-500"
                              : selectedBookToView.category === "Business"
                                ? "bg-orange-500"
                                : selectedBookToView.category === "History"
                                  ? "bg-red-500"
                                  : selectedBookToView.category === "Biography"
                                    ? "bg-yellow-600"
                                    : selectedBookToView.category === "Self-Help"
                                      ? "bg-pink-500"
                                      : selectedBookToView.category === "Finance"
                                        ? "bg-indigo-500"
                                        : selectedBookToView.category === "Literature"
                                          ? "bg-teal-500"
                                          : "bg-gray-500"
                        } text-white`}
                    >
                      {selectedBookToView.category}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{selectedBookToView.title}</h3>
                    <p className="text-lg text-gray-700">by {selectedBookToView.author}</p>
                    <p className="text-gray-600">{selectedBookToView.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-semibold">ISBN:</span> {selectedBookToView.isbn}
                      </p>
                      <p>
                        <span className="font-semibold">Shelf:</span> {selectedBookToView.shelfNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Total Copies:</span> {selectedBookToView.totalCopies}
                      </p>
                      <p>
                        <span className="font-semibold">Available Copies:</span> {selectedBookToView.availableCopies}
                      </p>
                      <p>
                        <span className="font-semibold">Borrowed Copies:</span> {selectedBookToView.borrowedCopies}
                      </p>
                      <p>
                        <span className="font-semibold">Publisher:</span> {selectedBookToView.publisher}
                      </p>
                      <p>
                        <span className="font-semibold">Language:</span> {selectedBookToView.language}
                      </p>
                      <p>
                        <span className="font-semibold">Format:</span> {selectedBookToView.format}
                      </p>
                      <p>
                        <span className="font-semibold">Pages:</span> {selectedBookToView.pages}
                      </p>
                      <p>
                        <span className="font-semibold">Published Year:</span> {selectedBookToView.publishedYear}
                      </p>
                      <p>
                        <span className="font-semibold">Added Date:</span>{" "}
                        {new Date(selectedBookToView.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Book Dialog */}
          <Dialog open={showEditBook} onOpenChange={setShowEditBook}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogDescription>Modify the details of the selected book.</DialogDescription>
              </DialogHeader>
              {selectedBookToEdit && (
                <form onSubmit={handleUpdateBook} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={selectedBookToEdit.title}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-author">Author</Label>
                      <Input
                        id="edit-author"
                        value={selectedBookToEdit.author}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, author: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        value={selectedBookToEdit.category}
                        onValueChange={(value) => setSelectedBookToEdit({ ...selectedBookToEdit, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.slice(1).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-isbn">ISBN</Label>
                      <Input
                        id="edit-isbn"
                        value={selectedBookToEdit.isbn}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, isbn: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-shelf">Shelf Number</Label>
                      <Input
                        id="edit-shelf"
                        value={selectedBookToEdit.shelfNumber}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, shelfNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-total-copies">Total Copies</Label>
                      <Input
                        id="edit-total-copies"
                        type="number"
                        min="1"
                        value={Number.isNaN(selectedBookToEdit?.totalCopies) ? '' : selectedBookToEdit?.totalCopies}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedBookToEdit({ ...selectedBookToEdit, totalCopies: Number(value) });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={selectedBookToEdit.description}
                      onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-publisher">Publisher</Label>
                      <Input
                        id="edit-publisher"
                        value={selectedBookToEdit.publisher}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, publisher: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-language">Language</Label>
                      <Input
                        id="edit-language"
                        value={selectedBookToEdit.language}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, language: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-format">Format</Label>
                      <Input
                        id="edit-format"
                        value={selectedBookToEdit.format}
                        onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, format: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-pages">Pages</Label>
                      <Input
                        id="edit-pages"
                        type="number"
                        min="0"
                        value={Number.isNaN(selectedBookToEdit?.pages) ? '' : selectedBookToEdit?.pages}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedBookToEdit({ ...selectedBookToEdit, pages: Number(value) });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-publishedYear">Published Year</Label>
                    <Input
                      id="edit-publishedYear"
                      type="number"
                      min="0"
                      value={Number.isNaN(selectedBookToEdit?.publishedYear) ? '' : selectedBookToEdit?.publishedYear}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedBookToEdit({ ...selectedBookToEdit, publishedYear: Number(value) });
                      }}
                    />
                  </div>
                  {/* New: Book Cover Image URL for Edit */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-coverUrl">Book Cover Image URL</Label>
                    <Input
                      id="edit-coverUrl"
                      value={selectedBookToEdit.coverUrl}
                      onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, coverUrl: e.target.value })}
                      placeholder="e.g., /placeholder.svg or a direct image URL"
                    />
                    {selectedBookToEdit.coverUrl && (
                      <div className="mt-2 flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Preview:</span>
                        <Image
                          src={selectedBookToEdit.coverUrl || "/placeholder.svg"}
                          alt="Cover Preview"
                          width={50}
                          height={75}
                          className="rounded object-cover border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowEditBook(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Members Management */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Member Management</h2>
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Register a new student member to the library system.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Full Name</Label>
                      <Input
                        id="member-name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email</Label>
                      <Input
                        id="member-email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-student-id">Student ID</Label>
                      <Input
                        id="member-student-id"
                        value={newMember.studentId}
                        onChange={(e) => setNewMember({ ...newMember, studentId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-phone">Phone Number</Label>
                      <Input
                        id="member-phone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Add Member
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Input
              placeholder="Search members by name, email, or student ID..."
              className="max-w-md"
              value={memberSearchTerm}
              onChange={(e) => setMemberSearchTerm(e.target.value)}
            />

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Details</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Books Issued</TableHead>
                    <TableHead>Fines</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{member.studentId}</TableCell>
                      <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>{member.booksIssued}</TableCell>
                      <TableCell>
                        <span className={member.totalFines > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                          ₹{member.totalFines.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMemberToView(member)
                              setShowViewMember(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMemberToEdit(member)
                              setShowEditMember(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* View Member Dialog */}
          <Dialog open={showViewMember} onOpenChange={setShowViewMember}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Member Details</DialogTitle>
                <DialogDescription>Detailed information about the selected member.</DialogDescription>
              </DialogHeader>
              {selectedMemberToView && (
                <div className="space-y-4">
                  <p>
                    <span className="font-semibold">Name:</span> {selectedMemberToView.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {selectedMemberToView.email}
                  </p>
                  <p>
                    <span className="font-semibold">Student ID:</span> {selectedMemberToView.studentId}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {selectedMemberToView.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Join Date:</span>{" "}
                    {new Date(selectedMemberToView.joinDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Books Issued:</span> {selectedMemberToView.booksIssued}
                  </p>
                  <p>
                    <span className="font-semibold">Total Fines:</span> ₹{selectedMemberToView.totalFines.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <Badge variant={selectedMemberToView.status === "active" ? "default" : "secondary"}>
                      {selectedMemberToView.status}
                    </Badge>
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Member Dialog */}
          <Dialog open={showEditMember} onOpenChange={setShowEditMember}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogDescription>Modify the details of the selected member.</DialogDescription>
              </DialogHeader>
              {selectedMemberToEdit && (
                <form onSubmit={handleUpdateMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-member-name">Full Name</Label>
                    <Input
                      id="edit-member-name"
                      value={selectedMemberToEdit.name}
                      onChange={(e) => setSelectedMemberToEdit({ ...selectedMemberToEdit, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-member-email">Email</Label>
                    <Input
                      id="edit-member-email"
                      type="email"
                      value={selectedMemberToEdit.email}
                      onChange={(e) => setSelectedMemberToEdit({ ...selectedMemberToEdit, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-member-student-id">Student ID</Label>
                    <Input
                      id="edit-member-student-id"
                      value={selectedMemberToEdit.studentId}
                      onChange={(e) => setSelectedMemberToEdit({ ...selectedMemberToEdit, studentId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-member-phone">Phone Number</Label>
                    <Input
                      id="edit-member-phone"
                      value={selectedMemberToEdit.phone}
                      onChange={(e) => setSelectedMemberToEdit({ ...selectedMemberToEdit, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowEditMember(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => alert("Export functionality coming soon!")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="borrow">Borrowed</SelectItem>
                    <SelectItem value="return">Returned</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant={transaction.type === "borrow" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.bookTitle}</TableCell>
                      <TableCell>{transaction.memberName}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(transaction.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "active"
                              ? "default"
                              : transaction.status === "returned"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          let displayFine = transaction.fine // Default to recorded fine from mock data
                          // If the transaction is overdue or an active borrow that is past its due date, calculate the current fine
                          if (
                            transaction.status === "overdue" ||
                            (transaction.status === "active" && new Date(transaction.dueDate) < new Date())
                          ) {
                            displayFine = calculateFine(transaction.dueDate)
                          }
                          return (
                            <span className={displayFine > 0 ? "text-red-600 font-semibold" : ""}>
                              ₹{displayFine.toFixed(2)}
                            </span>
                          )
                        })()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTransactionToView(transaction)
                            setShowViewTransaction(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* View Transaction Dialog */}
          <Dialog open={showViewTransaction} onOpenChange={setShowViewTransaction}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>Detailed information about the selected transaction.</DialogDescription>
              </DialogHeader>
              {selectedTransactionToView && (
                <div className="space-y-4">
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    <Badge variant={selectedTransactionToView.type === "borrow" ? "default" : "secondary"}>
                      {selectedTransactionToView.type}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-semibold">Book:</span> {selectedTransactionToView.bookTitle}
                  </p>
                  <p>
                    <span className="font-semibold">Member:</span> {selectedTransactionToView.memberName}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(selectedTransactionToView.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Due Date:</span>{" "}
                    {new Date(selectedTransactionToView.dueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <Badge
                      variant={
                        selectedTransactionToView.status === "active"
                          ? "default"
                          : selectedTransactionToView.status === "returned"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {selectedTransactionToView.status}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-semibold">Fine:</span> ₹{selectedTransactionToView.fine.toFixed(2)}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reports & Analytics</h2>
              <Button variant="outline" onClick={() => alert("Report generation functionality coming soon!")}>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Most Popular Books</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">The Psychology of Money</span>
                      <Badge>15 borrows</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Atomic Habits</span>
                      <Badge>12 borrows</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Company of One</span>
                      <Badge>8 borrows</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Active Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Members</span>
                      <Badge>{members.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Borrowers</span>
                      <Badge>{members.filter((m: any) => m.booksIssued > 0).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">With Fines</span>
                      <Badge variant="destructive">{members.filter((m: any) => m.totalFines > 0).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Overdue Books</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Overdue</span>
                      <Badge variant="destructive">{transactions.filter((t: any) => t.status === "overdue").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Fines</span>
                      <Badge variant="destructive">₹{totalFines.toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Days Late</span>
                      <Badge>5 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
                <CardDescription>Library usage trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
