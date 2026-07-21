"use client"

import { useState } from "react"
import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { Footer } from "@/components/landing/Footer"
import { AuthModal } from "@/components/landing/AuthModal"

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return <AuthModal onClose={() => setShowAuth(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <Header onShowAuth={() => setShowAuth(true)} />
      <HeroSection onShowAuth={() => setShowAuth(true)} />
      <FeaturesSection onShowAuth={() => setShowAuth(true)} />
      <Footer />
    </div>
  )
}
