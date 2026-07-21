import type { AuthResponse, Book, BooksResponse, BorrowedBook, BorrowedBooksResponse, Review, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid — clear auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      throw new Error('Authentication expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth
  async register(data: { name: string; studentId: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/auth/users');
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/api/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Books
  async getBooks(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<BooksResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    const query = searchParams.toString();
    return this.request<BooksResponse>(`/api/books${query ? `?${query}` : ''}`);
  }

  async addBook(data: Partial<Book>): Promise<Book> {
    return this.request<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(id: string, data: Partial<Book>): Promise<Book> {
    return this.request<Book>(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Borrowed Books
  async borrowBook(bookId: string): Promise<BorrowedBook> {
    return this.request<BorrowedBook>('/api/borrowedBooks', {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    });
  }

  async returnBook(borrowId: string): Promise<{ message: string; borrowedBook: BorrowedBook }> {
    return this.request<{ message: string; borrowedBook: BorrowedBook }>(`/api/borrowedBooks/${borrowId}/return`, {
      method: 'PUT',
    });
  }

  async getMyBorrowedBooks(): Promise<BorrowedBook[]> {
    return this.request<BorrowedBook[]>('/api/borrowedBooks/my');
  }

  async getAllBorrowedBooks(params?: { page?: number; limit?: number; status?: string }): Promise<BorrowedBooksResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return this.request<BorrowedBooksResponse>(`/api/borrowedBooks${query ? `?${query}` : ''}`);
  }

  // Reviews
  async getReviews(bookId: string): Promise<Review[]> {
    return this.request<Review[]>(`/api/reviews/${bookId}`);
  }

  async addReview(bookId: string, rating: number, review: string): Promise<Review> {
    return this.request<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookId, rating, review }),
    });
  }

  async deleteReview(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/reviews/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
