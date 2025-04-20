"use client"

import type React from "react"
import { useState, useEffect, useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  itemClassName?: string
  autoScroll?: boolean
  scrollSpeed?: number
  pauseOnHover?: boolean
  showControls?: boolean
}

export default function HorizontalScroll({
  children,
  className = "",
  itemClassName = "",
  autoScroll = true,
  scrollSpeed = 30,
  pauseOnHover = true,
  showControls = true,
}: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // 自動スクロール（右端で停止）
  useEffect(() => {
    if (!autoScroll || isPaused) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let lastTimestamp: number

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const elapsed = timestamp - lastTimestamp

      if (elapsed > scrollSpeed) {
        scrollContainer.scrollLeft += 1
        lastTimestamp = timestamp

        const isAtEnd =
          scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 1
        if (isAtEnd) {
          setIsPaused(true)
          return
        }
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [autoScroll, isPaused, scrollSpeed])

  // スクロール位置に基づく矢印の表示
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    setShowLeftArrow(scrollContainer.scrollLeft > 10)
    setShowRightArrow(scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" })
  const togglePause = () => setIsPaused((prev) => !prev)

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-y ${className}`}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "auto"
        }}
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div key={index} className={`flex-shrink-0 snap-start ${itemClassName}`}>
                {child}
              </div>
            ))
          : children}
      </div>

      {showControls && (
        <>
          <button
            onClick={scrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 transition-all shadow-md ${
              showLeftArrow ? "opacity-70 hover:opacity-100" : "opacity-0 pointer-events-none"
            } group-hover:opacity-70 hover:opacity-100`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-secondary" />
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 transition-all shadow-md ${
              showRightArrow ? "opacity-70 hover:opacity-100" : "opacity-0 pointer-events-none"
            } group-hover:opacity-70 hover:opacity-100`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-secondary" />
          </button>

          <button
            onClick={togglePause}
            className="absolute bottom-2 right-2 bg-white/70 hover:bg-white/90 rounded-full p-2 transition-all shadow-md opacity-0 group-hover:opacity-70 hover:opacity-100"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="h-4 w-4 text-secondary" /> : <Pause className="h-4 w-4 text-secondary" />}
          </button>
        </>
      )}
    </div>
  )
}
