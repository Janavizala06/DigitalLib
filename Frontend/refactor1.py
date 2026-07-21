import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# 1. LibrarianHeader.tsx
header_code = """
"use client"

import { BookOpen, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function LibrarianHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState("Librarian")

  useEffect(() => {
    const name = localStorage.getItem("userName")
    if (name) setUserName(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
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
  )
}
"""

# 2. LibrarianSidebar.tsx
sidebar_code = """
"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Calendar, BarChart3 } from "lucide-react"

export function LibrarianSidebar() {
  return (
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
  )
}
"""

# 3. DashboardStats.tsx
stats_code = """
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, Calendar, DollarSign, Users } from "lucide-react"
import { api } from "@/lib/api"
import { calculateFine } from "@/lib/utils" // We will extract this

export function DashboardStats() {
  const [totalBooks, setTotalBooks] = useState(0)
  const [availableBooks, setAvailableBooks] = useState(0)
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0)
  const [totalFines, setTotalFines] = useState(0)
  const [totalMembers, setTotalMembers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, users, transactionsRes] = await Promise.all([
          api.getBooks({ limit: 1000 }),
          api.getUsers(),
          api.getAllBorrowedBooks({ limit: 1000 })
        ])

        const books = booksRes.books || []
        const transactions = transactionsRes.borrowedBooks || []

        setTotalBooks(books.reduce((sum, b) => sum + (b.totalCopies || 0), 0))
        setAvailableBooks(books.reduce((sum, b) => sum + (b.availableCopies || 0), 0))
        setBorrowedBooksCount(transactions.length)
        setTotalMembers(users.length)

        const fines = transactions.reduce((sum, t) => {
          let fine = 0
          const today = new Date()
          const dueDate = new Date(t.dueDate)
          if (t.returnDate) {
            fine = calculateFine(t.dueDate, t.returnDate)
          } else if (today > dueDate) {
            fine = calculateFine(t.dueDate)
          }
          return sum + fine
        }, 0)
        setTotalFines(fines)
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    fetchData()
  }, [])

  return (
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
  )
}
"""

# I will write the rest of the components in part 2 of the script execution.

base_path = "e:/Projects/IBM/DigitalLib-main/Frontend/components/librarian"
write_file(f"{base_path}/LibrarianHeader.tsx", header_code)
write_file(f"{base_path}/LibrarianSidebar.tsx", sidebar_code)
write_file(f"{base_path}/DashboardStats.tsx", stats_code)
print("Basic components written.")
