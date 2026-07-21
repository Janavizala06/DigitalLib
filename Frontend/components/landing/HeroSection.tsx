import { Button } from "@/components/ui/button"
import { BookOpen, Search, Star, Library, Users, QrCode } from "lucide-react"

interface HeroSectionProps {
  onShowAuth: () => void;
}

export function HeroSection({ onShowAuth }: HeroSectionProps) {
  return (
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
              onClick={onShowAuth}
            >
              <BookOpen className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Reading Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-purple-600 px-10 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl bg-transparent"
              onClick={onShowAuth}
            >
              <Search className="h-5 w-5 mr-2" />
              Explore Catalog
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 group-hover:scale-105 transition-all duration-500">
              <div className="relative h-96 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
                    <BookOpen className="h-16 w-16 text-white mx-auto" />
                  </div>
                </div>

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

                <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border-2 border-blue-400/50 rounded-full animate-spin-reverse"></div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-white mb-2">Your Digital Library</h3>
                <p className="text-blue-100">Unlimited access to knowledge</p>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/4 -right-6 w-5 h-5 bg-purple-400 rounded-full animate-ping delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
