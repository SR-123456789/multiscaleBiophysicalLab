"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  images: {
    src: string
    alt: string
  }[]
  autoplay?: boolean
  interval?: number
  className?: string
}

export default function Carousel({ images, autoplay = true, interval = 5000, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isFirstSlideAnimated, setIsFirstSlideAnimated] = useState(false)

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [images.length])

  // 自動スクロール機能の強化
  useEffect(() => {
    if (autoplay && !isHovering && images.length > 1) {
      const timer = setInterval(() => {
        next()
      }, interval)
      return () => clearInterval(timer)
    }
  }, [autoplay, interval, next, isHovering, images.length])

  // Touch handling
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      next()
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      prev()
    }
  }

  useEffect(() => {
    // コンポーネントがマウントされたら、少し遅延を入れてアニメーションフラグをセット
    const timer = setTimeout(() => {
      setIsFirstSlideAnimated(true)
    }, 50) // 50msの遅延を入れる

    return () => clearTimeout(timer)
  }, []) // 空の依存配列で初回マウント時のみ実行

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full overflow-hidden">
            <div
              className={`w-full h-full transition-transform duration-[8000ms] ease-out ${
                index === currentIndex ? (isFirstSlideAnimated || index !== 0 ? "scale-110" : "scale-100") : "scale-100"
              }`}
            >
              <Image
                src={image.src.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover"
                width={1200}
                height={600}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if there are multiple images */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 transition-all"
            onClick={prev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-secondary" />
          </button>

          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 transition-all"
            onClick={next}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-secondary" />
          </button>

          {/* Indicators - only show if there are multiple images */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-4" : "bg-white/70"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
