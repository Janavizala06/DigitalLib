import { Search, Eye, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BookCatalogProps {
    books: any[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    categories: string[];
    handleViewBook: (book: any) => void;
    handleBorrowBook: (bookId: string) => void;
    handleReserveBook: (bookId: string) => void;
}

export function BookCatalog({
    books,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    handleViewBook,
    handleBorrowBook,
    handleReserveBook
}: BookCatalogProps) {
    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.isbn && book.isbn.includes(searchTerm))
        const matchesCategory = selectedCategory === "all" || book.category.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-8">
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
                                <span className="text-sm font-medium">{book.rating || "N/A"}</span>
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
                                    <span>{book.pages || 0} pages</span>
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
                                            onClick={() => handleBorrowBook(book._id || book.id)}
                                            size="sm"
                                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                                        >
                                            Borrow
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleReserveBook(book._id || book.id)}
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
        </div>
    )
}
