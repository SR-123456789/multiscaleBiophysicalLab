"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface SectionAnimationProps {
  children: ReactNode
  className?: string
}

export default function SectionAnimation({ children, className = "" }: SectionAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear")
          }
        })
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    const section = sectionRef.current
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className={`fade-in ${className}`}>
      {children}
    </div>
  )
}
