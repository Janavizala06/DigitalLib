import { Library } from "lucide-react"

export function Footer() {
  return (
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
  )
}
