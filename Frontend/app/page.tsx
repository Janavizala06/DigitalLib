"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Library, Star, QrCode, Search, Shield, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [activeAuthTab, setActiveAuthTab] = useState("login")
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    role: "student",
  })
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        if (loginData.email === "librarian@library.com" || loginData.email === "librarian@gmail.com") {
          localStorage.setItem("userRole", "librarian")
          localStorage.setItem("userName", "Librarian")
          router.push("/librarian")
        } else {
          localStorage.setItem("userRole", "student")
          localStorage.setItem("userName", data.user.name)
          localStorage.setItem("studentId", data.user.studentId)
          router.push("/student")
        }
      } else if (response.status === 401) {
        // User not found, show alert and redirect to Join Now tab
        alert("Account doesn't exist")
        setActiveAuthTab("register")
      } else {
        alert(data.message || "Login failed")
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          studentId: registerData.studentId,
          email: registerData.email,
          password: registerData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        // After successful registration, redirect to login tab instead of dashboard
        setActiveAuthTab("login")
        alert("Registration successful! Please sign in.")
      } else {
        alert(data.message || "Registration failed")
      }
    } catch (error) {
      alert("An error occurred during registration. Please try again.")
    }
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Books Animation */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-12 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform rotate-12 shadow-2xl opacity-80"></div>
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <div className="w-10 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg transform -rotate-12 shadow-2xl opacity-80"></div>
          </div>
          <div className="absolute bottom-32 left-1/4 animate-float-slow">
            <div className="w-14 h-18 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg transform rotate-6 shadow-2xl opacity-80"></div>
          </div>
          <div className="absolute top-1/3 right-1/3 animate-float">
            <div className="w-8 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg transform -rotate-6 shadow-2xl opacity-80"></div>
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-float-delayed">
            <div className="w-11 h-15 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg transform rotate-3 shadow-2xl opacity-80"></div>
          </div>

          {/* Enhanced Glowing Orbs */}
          <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Particle Grid */}
          <div className="absolute inset-0 opacity-40">
            <div className="grid grid-cols-16 gap-6 h-full">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-white/30 rounded-full animate-twinkle"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-16 right-16 animate-float-slow">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-16 left-16 animate-float">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header */}
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white rounded-full shadow-xl flex items-center justify-center" style={{ width: 56, height: 56 }}>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <div>
                <span className="text-white text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  DigitalLib
                </span>
                <div className="text-xs text-purple-200 font-medium">Digital Reading Experience</div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              onClick={() => setShowAuth(false)}
            >
              ← Back to Home
            </Button>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Enhanced Hero Section */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium">Join 10,000+ readers worldwide</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black leading-none">
                  <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
                    {activeAuthTab === "login" ? "Welcome" : "Start"}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-reverse">
                    {activeAuthTab === "login" ? "Back" : "Your"}
                  </span>
                  {activeAuthTab === "register" && (
                    <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient">
                      Journey
                    </span>
                  )}
                </h1>

                <p className="text-xl lg:text-2xl text-purple-100 max-w-2xl leading-relaxed">
                  {activeAuthTab === "login"
                    ? "Continue your extraordinary reading journey with"
                    : "Embark on an extraordinary reading journey with our"}
                  <span className="text-yellow-300 font-semibold"> unlimited access</span> to our digital library
                  ecosystem.
                </p>
              </div>

              {/* Enhanced Features Grid */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  { icon: BookOpen, text: "10,000+ Books", color: "text-yellow-300" },
                  { icon: Users, text: "Student Portal", color: "text-blue-300" },
                  { icon: Star, text: "Reviews & Ratings", color: "text-pink-300" },
                  { icon: QrCode, text: "Barcode Scanner", color: "text-green-300" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:scale-110 transition-transform">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-medium group-hover:text-white transition-colors">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Reading Progress Visualization */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-200 text-sm">Your Reading Journey</span>
                  <span className="text-white font-semibold">Ready to continue</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Login/Register Form */}
            <div className="relative">
              {/* Form Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>

              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
                <Tabs value={activeAuthTab} onValueChange={setActiveAuthTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
                    <TabsTrigger
                      value="login"
                      className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      Join Now
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl text-white font-bold mb-2">Welcome Back, Reader!</CardTitle>
                        <CardDescription className="text-purple-200 text-lg">
                          Sign in to continue your literary adventure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-white font-medium text-lg">
                              Email Address
                            </Label>
                            <div className="relative group">
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                className="h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-lg"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="password" className="text-white font-medium text-lg">
                              Password
                            </Label>
                            <div className="relative group">
                              <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-lg"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <BookOpen className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                            Sign In to Library
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="register">
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl text-white font-bold mb-2">Join Our Community!</CardTitle>
                        <CardDescription className="text-purple-200 text-lg">
                          Create your account and start exploring
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleRegister} className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-white font-medium">
                              Full Name
                            </Label>
                            <div className="relative group">
                              <Input
                                id="name"
                                placeholder="Enter your full name"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email" className="text-white font-medium">
                              Email Address
                            </Label>
                            <div className="relative group">
                              <Input
                                id="reg-email"
                                type="email"
                                placeholder="Enter your email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-id" className="text-white font-medium">
                              Student ID
                            </Label>
                            <div className="relative group">
                              <Input
                                id="student-id"
                                placeholder="Enter your student ID"
                                value={registerData.studentId}
                                onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })}
                                className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password" className="text-white font-medium">
                              Password
                            </Label>
                            <div className="relative group">
                              <Input
                                id="reg-password"
                                type="password"
                                placeholder="Create a strong password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                className="h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                                required
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Users className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                            Create My Account
                          </Button>

                          <div className="text-center mt-4">
                            <p className="text-purple-200 text-sm">
                              By signing up, you agree to our
                              <span className="text-yellow-300 hover:underline cursor-pointer"> Terms of Service</span>
                            </p>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Floating Action Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce delay-300 shadow-lg"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-ping shadow-lg"></div>
              <div className="absolute top-1/4 -left-6 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping delay-500 shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Books Animation */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-8 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm transform rotate-12 shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-6 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-sm transform -rotate-12 shadow-lg"></div>
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float-slow">
          <div className="w-10 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-sm transform rotate-6 shadow-lg"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float">
          <div className="w-7 h-9 bg-gradient-to-br from-pink-400 to-rose-500 rounded-sm transform -rotate-6 shadow-lg"></div>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Particle Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-12 gap-8 h-full">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-white/20 rounded-full animate-twinkle"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white rounded-full shadow-xl flex items-center justify-center" style={{ width: 48, height: 48 }}>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
            <div>
              <span className="text-white text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                DigitalLib
              </span>
              <div className="text-xs text-purple-200 font-medium">Digital Reading Experience</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-purple-600 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => setShowAuth(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Trusted by 10,000+ readers</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-none">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
                  TIME TO
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-reverse">
                  READ
                </span>
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient">
                  BOOKS
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-purple-100 max-w-2xl leading-relaxed">
                Embark on an extraordinary reading journey with our
                <span className="text-yellow-300 font-semibold"> revolutionary digital library</span>. Discover,
                explore, and immerse yourself in thousands of captivating stories.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">10K+</div>
                <div className="text-sm text-purple-200">Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">5K+</div>
                <div className="text-sm text-purple-200">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">24/7</div>
                <div className="text-sm text-purple-200">Access</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                onClick={() => setShowAuth(true)}
              >
                <BookOpen className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Reading Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-purple-600 px-10 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl bg-transparent"
                onClick={() => setShowAuth(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                Explore Catalog
              </Button>
            </div>
          </div>

          {/* Enhanced Hero Illustration */}
          <div className="relative">
            <div className="relative group">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 group-hover:scale-105 transition-all duration-500">
                <div className="relative h-96 flex items-center justify-center">
                  {/* Central Book Stack */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
                      <BookOpen className="h-16 w-16 text-white mx-auto" />
                    </div>
                  </div>

                  {/* Floating Books Around */}
                  <div className="absolute top-8 left-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg p-4 shadow-lg transform -rotate-12 hover:rotate-0 transition-transform animate-float">
                    <Library className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-12 right-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg p-4 shadow-lg transform rotate-12 hover:rotate-0 transition-transform animate-float-delayed">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-12 left-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg p-4 shadow-lg transform rotate-6 hover:rotate-0 transition-transform animate-float-slow">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-8 right-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg p-4 shadow-lg transform -rotate-6 hover:rotate-0 transition-transform animate-float">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>

                  {/* Reading Progress Ring */}
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border-2 border-blue-400/50 rounded-full animate-spin-reverse"></div>
                </div>

                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Your Digital Library</h3>
                  <p className="text-blue-100">Unlimited access to knowledge</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/4 -right-6 w-5 h-5 bg-purple-400 rounded-full animate-ping delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Library Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Smartphone className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-white font-medium">Powerful Features</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Library Features
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Experience the future of reading with our cutting-edge digital library platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Vast Collection",
              description: "Access thousands of books across all genres and categories",
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/10",
            },
            {
              icon: Search,
              title: "Smart Search",
              description: "AI-powered search to find exactly what you're looking for",
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-500/10 to-emerald-500/10",
            },
            {
              icon: Shield,
              title: "Member Management",
              description: "Seamless borrowing system with automated fine calculation",
              gradient: "from-orange-500 to-red-500",
              bgGradient: "from-orange-500/10 to-red-500/10",
            },
            {
              icon: Smartphone,
              title: "Digital Access",
              description: "Read anywhere, anytime with our mobile-optimized platform",
              gradient: "from-pink-500 to-purple-500",
              bgGradient: "from-pink-500/10 to-purple-500/10",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              transparent={true}
              className={`group bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/20 text-white hover:scale-105 transition-all duration-500 hover:shadow-2xl overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div
                  className={`bg-gradient-to-r ${feature.gradient} rounded-2xl p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform`}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl"></div>
          <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">Join thousands of readers</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Ready to Start Your
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Reading Adventure?
                </span>
              </h2>

              <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
                Join our digital library today and unlock unlimited access to thousands of books, personalized
                recommendations, and a community of passionate readers.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-110"
                  onClick={() => setShowAuth(true)}
                >
                  <BookOpen className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Get Started Now
                  <div className="ml-3 bg-white/20 rounded-full px-3 py-1 text-sm">Free</div>
                </Button>

                <div className="flex items-center space-x-4 text-purple-200">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-white">5,000+ readers</div>
                    <div className="text-sm">joined this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-2">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xl font-bold">DigitalLib</span>
              </div>
              <p className="text-purple-200 max-w-md">
                Revolutionizing the way you discover, read, and share knowledge through our innovative digital library
                platform.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-purple-200">
                <li>Book Catalog</li>
                <li>Digital Reading</li>
                <li>Member Portal</li>
                <li>Smart Search</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-purple-200">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-purple-200">&copy; 2024 DigitalLib. Crafted with ❤️ for book lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
