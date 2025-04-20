"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false)
  const pathname = usePathname()

  // ページ遷移時にスクロール位置をリセット
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // スクロール位置に基づいてボタンの表示/非表示を制御
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary/90 text-white rounded-full p-3 shadow-lg transition-all z-50"
          aria-label="ページトップへ戻る"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}
