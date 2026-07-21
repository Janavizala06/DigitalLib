"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Eye } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/types"

export function ManageMembers() {
  const [members, setMembers] = useState<any[]>([])
  const [memberSearchTerm, setMemberSearchTerm] = useState("")

  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditMember, setShowEditMember] = useState(false)
  const [showViewMember, setShowViewMember] = useState(false)
  
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState<any>(null)
  const [selectedMemberToView, setSelectedMemberToView] = useState<any>(null)

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const data = await api.getUsers()
      const mappedMembers = data.map((user: any, idx: number) => ({
        id: user._id || idx + 1,
        _id: user._id,
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
    } catch (err: any) {
      toast({ title: "Error fetching members", description: err.message, variant: "destructive" })
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.register({
        name: newMember.name,
        email: newMember.email,
        studentId: newMember.studentId,
        password: newMember.studentId, // Default password
        phone: newMember.phone,
      })
      toast({ title: "Success", description: "Member added successfully!" })
      fetchMembers()
      setNewMember({ name: "", email: "", studentId: "", phone: "" })
      setShowAddMember(false)
    } catch (err: any) {
      toast({ title: "Error adding member", description: err.message, variant: "destructive" })
    }
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.updateUser(selectedMemberToEdit._id, {
        name: selectedMemberToEdit.name,
        email: selectedMemberToEdit.email,
        studentId: selectedMemberToEdit.studentId,
        phone: selectedMemberToEdit.phone,
      })
      toast({ title: "Success", description: "Member updated successfully!" })
      setMembers(members.map((m) => (m._id === selectedMemberToEdit._id ? selectedMemberToEdit : m)))
      setShowEditMember(false)
      setSelectedMemberToEdit(null)
    } catch (err: any) {
      toast({ title: "Error updating member", description: err.message, variant: "destructive" })
    }
  }

  const filteredMembers = members.filter((member: any) => {
    const searchTermLower = memberSearchTerm.toLowerCase()
    return (
      (member.name?.toLowerCase() || "").includes(searchTermLower) ||
      (member.email?.toLowerCase() || "").includes(searchTermLower) ||
      (member.studentId?.toLowerCase() || "").includes(searchTermLower)
    )
  })

  return (
    <div className="space-y-6">
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
                <Button type="submit" className="flex-1">Add Member</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
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

      {/* View Member Dialog */}
      <Dialog open={showViewMember} onOpenChange={setShowViewMember}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>Detailed information about the selected member.</DialogDescription>
          </DialogHeader>
          {selectedMemberToView && (
            <div className="space-y-4">
              <p><span className="font-semibold">Name:</span> {selectedMemberToView.name}</p>
              <p><span className="font-semibold">Email:</span> {selectedMemberToView.email}</p>
              <p><span className="font-semibold">Student ID:</span> {selectedMemberToView.studentId}</p>
              <p><span className="font-semibold">Phone:</span> {selectedMemberToView.phone || "N/A"}</p>
              <p>
                <span className="font-semibold">Join Date:</span>{" "}
                {new Date(selectedMemberToView.joinDate).toLocaleDateString()}
              </p>
              <p><span className="font-semibold">Books Issued:</span> {selectedMemberToView.booksIssued}</p>
              <p><span className="font-semibold">Total Fines:</span> ₹{selectedMemberToView.totalFines.toFixed(2)}</p>
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
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setShowEditMember(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
