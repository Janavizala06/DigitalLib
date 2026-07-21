import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

manage_books_code = """
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Edit, Trash2, Eye, Upload, QrCode, ImageIcon } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function ManageBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [bookSearchTerm, setBookSearchTerm] = useState("")
  const [selectedBookCategory, setSelectedBookCategory] = useState("all")
  const { toast } = useToast()

  const [showAddBook, setShowAddBook] = useState(false)
  const [showEditBook, setShowEditBook] = useState(false)
  const [showViewBook, setShowViewBook] = useState(false)
  const [selectedBookToEdit, setSelectedBookToEdit] = useState<any>(null)
  const [selectedBookToView, setSelectedBookToView] = useState<any>(null)

  const [newBook, setNewBook] = useState({
    title: "", author: "", category: "", isbn: "", shelfNumber: "",
    totalCopies: 1, description: "", publisher: "", language: "",
    format: "", pages: 0, publishedYear: 0, coverUrl: "/placeholder.svg?height=300&width=200",
  })

  const allCategories = [
    "all", "Fiction", "Non-Fiction", "Science", "Technology", "Business",
    "History", "Biography", "Self-Help", "Finance", "Literature",
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const res = await api.getBooks({ limit: 1000 })
      setBooks(res.books || [])
    } catch (err: any) {
      console.error("Error fetching books:", err)
      toast({ title: "Error", description: "Failed to load books", variant: "destructive" })
    }
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBook.title || !newBook.author || !newBook.category) {
      return toast({ title: "Validation Error", description: "Title, Author, and Category are required.", variant: "destructive" })
    }
    const bookData = {
      ...newBook,
      totalCopies: Number.isNaN(newBook.totalCopies) ? 1 : newBook.totalCopies,
      pages: Number.isNaN(newBook.pages) ? 0 : newBook.pages,
      publishedYear: Number.isNaN(newBook.publishedYear) ? 0 : newBook.publishedYear,
      availableCopies: Number.isNaN(newBook.totalCopies) ? 1 : newBook.totalCopies,
      borrowedCopies: 0,
      addedDate: new Date().toISOString().split("T")[0],
    }
    try {
      const savedBook = await api.addBook(bookData)
      setBooks([...books, savedBook])
      setNewBook({
        title: "", author: "", category: "", isbn: "", shelfNumber: "",
        totalCopies: 1, description: "", publisher: "", language: "",
        format: "", pages: 0, publishedYear: 0, coverUrl: "/placeholder.svg?height=300&width=200",
      })
      setShowAddBook(false)
      toast({ title: "Success", description: "Book added successfully!" })
    } catch (err: any) {
      toast({ title: "Error adding book", description: err.message, variant: "destructive" })
    }
  }

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedBookData = {
        ...selectedBookToEdit,
        totalCopies: Number.isNaN(selectedBookToEdit.totalCopies) ? 1 : selectedBookToEdit.totalCopies,
        pages: Number.isNaN(selectedBookToEdit.pages) ? 0 : selectedBookToEdit.pages,
        publishedYear: Number.isNaN(selectedBookToEdit.publishedYear) ? 0 : selectedBookToEdit.publishedYear,
      }
      const updatedBook = await api.updateBook(selectedBookToEdit._id || selectedBookToEdit.id, updatedBookData)
      setBooks(books.map((book) => (book._id || book.id) === (updatedBook._id || updatedBook.id) ? updatedBook : book))
      setShowEditBook(false)
      setSelectedBookToEdit(null)
      toast({ title: "Success", description: "Book updated successfully!" })
    } catch (err: any) {
      toast({ title: "Error updating book", description: err.message, variant: "destructive" })
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.deleteBook(bookId)
        setBooks(books.filter((book) => (book._id || book.id) !== bookId))
        toast({ title: "Success", description: "Book deleted successfully!" })
      } catch (err: any) {
        toast({ title: "Error deleting book", description: err.message, variant: "destructive" })
      }
    }
  }

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch =
      book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(bookSearchTerm))
    const matchesCategory =
      selectedBookCategory === "all" || (book.category && book.category.toLowerCase() === selectedBookCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
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
                <DialogDescription>Enter the details of the new book to add to the library catalog.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newBook.category} onValueChange={(value) => setNewBook({ ...newBook, category: value })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {allCategories.slice(1).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shelf">Shelf Number</Label>
                    <Input id="shelf" value={newBook.shelfNumber} onChange={(e) => setNewBook({ ...newBook, shelfNumber: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="copies">Total Copies</Label>
                    <Input id="copies" type="number" min="1" value={Number.isNaN(newBook.totalCopies) ? '' : newBook.totalCopies} onChange={(e) => setNewBook({ ...newBook, totalCopies: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" value={newBook.publisher} onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" value={newBook.language} onChange={(e) => setNewBook({ ...newBook, language: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input id="format" value={newBook.format} onChange={(e) => setNewBook({ ...newBook, format: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages</Label>
                    <Input id="pages" type="number" min="0" value={Number.isNaN(newBook.pages) ? '' : newBook.pages} onChange={(e) => setNewBook({ ...newBook, pages: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input id="publishedYear" type="number" min="0" value={Number.isNaN(newBook.publishedYear) ? '' : newBook.publishedYear} onChange={(e) => setNewBook({ ...newBook, publishedYear: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverUrl">Book Cover Image URL</Label>
                  <Input id="coverUrl" value={newBook.coverUrl} onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })} placeholder="e.g., /placeholder.svg or a direct image URL" />
                  {newBook.coverUrl && (
                    <div className="mt-2 flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Preview:</span>
                      <Image src={newBook.coverUrl || "/placeholder.svg"} alt="Cover Preview" width={50} height={75} className="rounded object-cover border" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Add Book</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddBook(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search books by title, author, or ISBN..." value={bookSearchTerm} onChange={(e) => setBookSearchTerm(e.target.value)} className="flex-1" />
        <Select value={selectedBookCategory} onValueChange={setSelectedBookCategory}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger>
          <SelectContent>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</SelectItem>
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
                    <Image src={book.coverUrl || "/placeholder.svg"} alt={book.title} width={40} height={60} className="rounded object-cover" />
                    <div>
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{book.category}</Badge></TableCell>
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
                    <Button variant="outline" size="sm" onClick={() => { setSelectedBookToView(book); setShowViewBook(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedBookToEdit(book); setShowEditBook(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book._id || book.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showViewBook} onOpenChange={setShowViewBook}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Book Details</DialogTitle><DialogDescription>Detailed information about the selected book.</DialogDescription></DialogHeader>
          {selectedBookToView && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <Image src={selectedBookToView.coverUrl || "/placeholder.svg"} alt={selectedBookToView.title} width={200} height={300} className="rounded-lg shadow-lg mb-4" />
                <Badge className="bg-blue-500 text-white">{selectedBookToView.category}</Badge>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{selectedBookToView.title}</h3>
                <p className="text-lg text-gray-700">by {selectedBookToView.author}</p>
                <p className="text-gray-600">{selectedBookToView.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-semibold">ISBN:</span> {selectedBookToView.isbn}</p>
                  <p><span className="font-semibold">Shelf:</span> {selectedBookToView.shelfNumber}</p>
                  <p><span className="font-semibold">Total Copies:</span> {selectedBookToView.totalCopies}</p>
                  <p><span className="font-semibold">Available Copies:</span> {selectedBookToView.availableCopies}</p>
                  <p><span className="font-semibold">Borrowed Copies:</span> {selectedBookToView.borrowedCopies}</p>
                  <p><span className="font-semibold">Publisher:</span> {selectedBookToView.publisher}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditBook} onOpenChange={setShowEditBook}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Book</DialogTitle><DialogDescription>Modify the details of the selected book.</DialogDescription></DialogHeader>
          {selectedBookToEdit && (
            <form onSubmit={handleUpdateBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="edit-title">Title</Label><Input id="edit-title" value={selectedBookToEdit.title} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="edit-author">Author</Label><Input id="edit-author" value={selectedBookToEdit.author} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, author: e.target.value })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={selectedBookToEdit.category} onValueChange={(value) => setSelectedBookToEdit({ ...selectedBookToEdit, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{allCategories.slice(1).map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="edit-isbn">ISBN</Label><Input id="edit-isbn" value={selectedBookToEdit.isbn} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, isbn: e.target.value })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="edit-shelf">Shelf Number</Label><Input id="edit-shelf" value={selectedBookToEdit.shelfNumber} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, shelfNumber: e.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="edit-total-copies">Total Copies</Label><Input id="edit-total-copies" type="number" min="1" value={Number.isNaN(selectedBookToEdit?.totalCopies) ? '' : selectedBookToEdit?.totalCopies} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, totalCopies: Number(e.target.value) })} required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" value={selectedBookToEdit.description} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="edit-publisher">Publisher</Label><Input id="edit-publisher" value={selectedBookToEdit.publisher} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, publisher: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="edit-language">Language</Label><Input id="edit-language" value={selectedBookToEdit.language} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, language: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="edit-coverUrl">Book Cover Image URL</Label><Input id="edit-coverUrl" value={selectedBookToEdit.coverUrl} onChange={(e) => setSelectedBookToEdit({ ...selectedBookToEdit, coverUrl: e.target.value })} placeholder="e.g., /placeholder.svg or a direct image URL" /></div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setShowEditBook(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
"""

base_path = "e:/Projects/IBM/DigitalLib-main/Frontend/components/librarian"
write_file(f"{base_path}/ManageBooks.tsx", manage_books_code)
print("ManageBooks.tsx written.")
