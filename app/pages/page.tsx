"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PagesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/blog")
  }, [router])

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">リダイレクト中...</div>
    </div>
  )
}
