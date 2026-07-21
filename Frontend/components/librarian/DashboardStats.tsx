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
