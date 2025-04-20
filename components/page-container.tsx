"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <div
      className={`container mx-auto px-4 ${
        !isHomePage ? "max-w-screen-xl lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}
