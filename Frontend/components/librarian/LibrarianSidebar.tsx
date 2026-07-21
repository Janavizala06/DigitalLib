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
