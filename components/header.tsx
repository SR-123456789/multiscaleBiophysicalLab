"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "ホーム", href: "/" },
  { name: "メンバー", href: "/members" },
  { name: "研究業績", href: "/achievements" },
  { name: "研究設備", href: "/facilities" },
  { name: "研究理念", href: "/philosophy" },
  { name: "学生向け", href: "/students" },
  { name: "担当科目", href: "/lectures" },
  { name: "ブログ/特集", href: "/blog" }, // 名前を変更
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-secondary hover:text-primary transition-colors">
                マルチスケール・階層的生物物理応用研究室
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm font-medium text-gray-600">立命館大学理工学部ロボティクス学科</span>
                <span className="text-xs md:text-sm font-medium text-gray-600">上杉研究室</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation - now hidden on lg and smaller screens */}
          <nav className="hidden xl:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-800 hover:text-primary font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button - now visible on lg and smaller screens */}
          <div className="xl:hidden">
            <button type="button" className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - now for xl and smaller screens */}
      <div className={`xl:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
