export interface User {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  role: 'student' | 'librarian';
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  shelfNumber?: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  coverUrl?: string;
  addedDate?: string;
  description?: string;
  publisher?: string;
  language?: string;
  format?: string;
  pages?: number;
  publishedYear?: number;
}

export interface BorrowedBook {
  _id: string;
  studentId: User | string;
  bookId: Book | string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: 'active' | 'returned' | 'overdue';
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  bookId: string;
  studentId: { _id: string; name: string } | string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BooksResponse extends PaginatedResponse<Book> {
  books: Book[];
}

export interface BorrowedBooksResponse extends PaginatedResponse<BorrowedBook> {
  borrowedBooks: BorrowedBook[];
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; path: string }>;
}
