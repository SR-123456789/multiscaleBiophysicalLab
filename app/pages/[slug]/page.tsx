"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PageRedirect({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { slug } = params

  useEffect(() => {
    router.replace(`/blog/${slug}`)
  }, [router, slug])

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">リダイレクト中...</div>
    </div>
  )
}
