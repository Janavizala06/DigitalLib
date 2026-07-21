"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { LibrarianHeader } from "@/components/librarian/LibrarianHeader"
import { DashboardStats } from "@/components/librarian/DashboardStats"
import { LibrarianSidebar } from "@/components/librarian/LibrarianSidebar"
import { ManageBooks } from "@/components/librarian/ManageBooks"
import { ManageMembers } from "@/components/librarian/ManageMembers"
import { IssueReturns } from "@/components/librarian/IssueReturns"
import { Reports } from "@/components/librarian/Reports"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function LibrarianDashboard() {
  return (
    <AuthGuard requiredRole="librarian">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <LibrarianHeader />
        
        <div className="container mx-auto px-4 py-8">
          <DashboardStats />

          <Tabs defaultValue="books" className="space-y-6">
            <LibrarianSidebar />

            <TabsContent value="books">
              <ManageBooks />
            </TabsContent>

            <TabsContent value="members">
              <ManageMembers />
            </TabsContent>

            <TabsContent value="transactions">
              <IssueReturns />
            </TabsContent>

            <TabsContent value="reports">
              <Reports />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
