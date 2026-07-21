"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, AlertCircle, BarChart3, Download } from "lucide-react"
import { api } from "@/lib/api"
import { calculateFine } from "@/lib/utils"

export function Reports() {
  const [totalMembers, setTotalMembers] = useState(0)
  const [activeBorrowers, setActiveBorrowers] = useState(0)
  const [membersWithFines, setMembersWithFines] = useState(0)
  
  const [totalOverdue, setTotalOverdue] = useState(0)
  const [totalFines, setTotalFines] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [users, transactionsRes] = await Promise.all([
        api.getUsers(),
        api.getAllBorrowedBooks({ limit: 1000 })
      ])

      setTotalMembers(users.length)
      
      const transactions = transactionsRes.borrowedBooks || []
      const activeTransactions = transactions.filter(t => t.status === "active" || t.status === "overdue" || (t.status !== "returned" && !t.returnDate))
      
      const activeMemberIds = new Set(activeTransactions.map(t => typeof t.studentId === 'object' ? (t.studentId as any)._id : t.studentId))
      setActiveBorrowers(activeMemberIds.size)

      let overdueCount = 0
      let finesTotal = 0
      const usersWithFines = new Set()

      transactions.forEach(t => {
        const today = new Date()
        const dueDate = new Date(t.dueDate)
        let fine = 0
        
        if (t.returnDate) {
          fine = calculateFine(t.dueDate, t.returnDate)
        } else if (today > dueDate) {
          overdueCount++
          fine = calculateFine(t.dueDate)
        }

        if (fine > 0) {
          finesTotal += fine
          usersWithFines.add(typeof t.studentId === 'object' ? (t.studentId as any)._id : t.studentId)
        }
      })

      setTotalOverdue(overdueCount)
      setTotalFines(finesTotal)
      setMembersWithFines(usersWithFines.size)
    } catch (err) {
      console.error("Failed to fetch reports", err)
    }
  }

  return (
    <div className="space-y-6">
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
                <Badge>{totalMembers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Borrowers</span>
                <Badge>{activeBorrowers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">With Fines</span>
                <Badge variant="destructive">{membersWithFines}</Badge>
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
                <Badge variant="destructive">{totalOverdue}</Badge>
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
    </div>
  )
}
