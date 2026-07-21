import { BookOpen, QrCode, Bell, User, Target, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StudentHeaderProps {
    userName: string;
    studentId: string;
    readingProgress: number;
    unreadNotifications: number;
    notifications: any[];
    setShowScanner: (show: boolean) => void;
    handleNotificationClick: (id: number) => void;
    handleMarkAllAsRead: () => void;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

export function StudentHeader({
    userName,
    studentId,
    readingProgress,
    unreadNotifications,
    notifications,
    setShowScanner,
    handleNotificationClick,
    handleMarkAllAsRead,
    setActiveTab,
    handleLogout
}: StudentHeaderProps) {
    const handleViewProfile = () => {
        alert("Profile functionality coming soon!")
    }

    return (
        <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 rounded-full p-2">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">DigitalLib Student</h1>
                            <p className="text-sm opacity-90">Your Digital Reading Experience</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowScanner(true)}
                            className="text-white hover:bg-white/20"
                        >
                            <QrCode className="h-4 w-4 mr-2" />
                            Scan
                        </Button>
                        <div className="relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                        <Bell className="h-4 w-4" />
                                        {unreadNotifications > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                                                {unreadNotifications}
                                            </Badge>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 p-2">
                                    <DropdownMenuLabel className="font-bold text-lg mb-2">Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.length === 0 ? (
                                        <DropdownMenuItem className="text-gray-500 italic">No new notifications</DropdownMenuItem>
                                    ) : (
                                        notifications.map((notification: any) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification.id)}
                                                className={`flex items-start space-x-3 py-3 px-2 rounded-md cursor-pointer ${!notification.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full mt-1 ${!notification.read ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">
                                                        {notification.type
                                                            .replace(/_/g, " ")
                                                            .split(" ")
                                                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(" ")}
                                                    </p>
                                                    <p className="text-gray-700 text-sm">{notification.message}</p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {new Date(notification.date).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                    {notifications.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleMarkAllAsRead}
                                                className="text-center text-blue-600 hover:text-blue-800 cursor-pointer py-2"
                                            >
                                                Mark all as read
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setActiveTab("notifications")}
                                                className="text-center text-blue-600 hover:text-blue-800 cursor-pointer py-2"
                                            >
                                                View all notifications
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleViewProfile} className="text-white hover:bg-white/20">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
                            <User className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-6 w-6 text-yellow-300" />
                            <h2 className="text-3xl font-bold">Welcome , {userName}!</h2>
                        </div>
                        <p className="text-lg opacity-90">Ready to explore new worlds of knowledge today?</p>

                        <div className="mt-4 flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-300" />
                                <span className="text-sm">Reading Goal: {readingProgress}% Complete</span>
                            </div>
                            <div className="w-48 bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${readingProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm opacity-90">Student ID</div>
                        <div className="text-2xl font-bold">{studentId}</div>
                        <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-300" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
