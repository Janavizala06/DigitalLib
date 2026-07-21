import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, BookMarked, AlertCircle, Star, TrendingUp, Clock, Award } from "lucide-react"

interface DashboardOverviewProps {
    borrowedBooksCount: number;
    reservationsCount: number;
    totalFines: number;
    readingScore: number;
}

export function DashboardOverview({
    borrowedBooksCount,
    reservationsCount,
    totalFines,
    readingScore
}: DashboardOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Books Borrowed</p>
                            <p className="text-3xl font-bold text-blue-600">{borrowedBooksCount}</p>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Check out now!
                            </p>
                        </div>
                        <div className="bg-blue-500 rounded-xl p-3">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Reserved Books</p>
                            <p className="text-3xl font-bold text-purple-600">{reservationsCount}</p>
                            <p className="text-orange-600 text-sm flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />available soon
                            </p>
                        </div>
                        <div className="bg-purple-500 rounded-xl p-3">
                            <BookMarked className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending Fines</p>
                            <p className="text-3xl font-bold text-red-600">₹{totalFines.toFixed(1)}</p>
                            <p className="text-red-600 text-sm flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pay by due date
                            </p>
                        </div>
                        <div className="bg-red-500 rounded-xl p-3">
                            <AlertCircle className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Reading Score</p>
                            <p className="text-3xl font-bold text-green-600">{readingScore}</p>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <Award className="h-3 w-3 mr-1" />
                                Excellent reader
                            </p>
                        </div>
                        <div className="bg-green-500 rounded-xl p-3">
                            <Star className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
