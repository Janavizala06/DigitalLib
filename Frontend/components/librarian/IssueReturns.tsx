"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, RotateCcw } from "lucide-react"
import { api } from "@/lib/api"
import { calculateFine } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function IssueReturns() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [selectedTransactionType, setSelectedTransactionType] = useState("all")

  const [showViewTransaction, setShowViewTransaction] = useState(false)
  const [selectedTransactionToView, setSelectedTransactionToView] = useState<any>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await api.getAllBorrowedBooks({ limit: 1000 })
      const mapped = (data.borrowedBooks || []).map((item: any) => {
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
          memberName: item.studentId?.name || item.studentId || 'Unknown',
          date: new Date(item.borrowDate).toISOString().split('T')[0],
          dueDate: new Date(item.dueDate).toISOString().split('T')[0],
          status,
          fine,
        }
      })
      setTransactions(mapped)
    } catch (err: any) {
      toast({ title: "Error fetching transactions", description: err.message, variant: "destructive" })
    }
  }

  const handleReturnBook = async (transactionId: string) => {
    try {
      await api.returnBook(transactionId)
      toast({ title: "Success", description: "Book returned successfully!" })
      fetchTransactions()
    } catch (err: any) {
      toast({ title: "Error returning book", description: err.message, variant: "destructive" })
    }
  }

  const filteredTransactions = transactions.filter((transaction: any) => {
    if (selectedTransactionType === "all") return true
    if (selectedTransactionType === "borrow") return transaction.type === "borrow"
    return transaction.status === selectedTransactionType
  })

  return (
    <div className="space-y-6">
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
              <SelectItem value="returned">Returned</SelectItem>
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
                  <span className={transaction.fine > 0 ? "text-red-600 font-semibold" : ""}>
                    ₹{transaction.fine.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
                    {(transaction.status === "active" || transaction.status === "overdue") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturnBook(transaction.id)}
                        title="Return Book"
                      >
                        <RotateCcw className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
              <p><span className="font-semibold">Book:</span> {selectedTransactionToView.bookTitle}</p>
              <p><span className="font-semibold">Member:</span> {selectedTransactionToView.memberName}</p>
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
              <p><span className="font-semibold">Fine:</span> ₹{selectedTransactionToView.fine.toFixed(2)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
