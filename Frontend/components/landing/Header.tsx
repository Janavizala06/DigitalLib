import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  onShowAuth: () => void;
}

export function Header({ onShowAuth }: HeaderProps) {
  return (
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
          onClick={onShowAuth}
        >
          <Users className="h-4 w-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </header>
  )
}
