import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Shield, Smartphone, Star } from "lucide-react"

interface FeaturesSectionProps {
  onShowAuth: () => void;
}

export function FeaturesSection({ onShowAuth }: FeaturesSectionProps) {
  return (
    <>
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
                  onClick={onShowAuth}
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
    </>
  )
}
