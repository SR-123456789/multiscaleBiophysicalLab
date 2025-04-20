"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getPhilosophy, type PhilosophyItem } from "@/lib/api"

export default function PhilosophyPage() {
  const [philosophy, setPhilosophy] = useState<PhilosophyItem | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPhilosophy()
      setPhilosophy(data)
    }

    fetchData()
  }, [])

  if (!philosophy) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  // Split content into paragraphs
  const paragraphs = philosophy.content.split("\n\n")

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">研究理念</h1>
          <p className="text-lg text-gray-600 mb-12">上杉研究室の研究に対する考え方をご紹介します</p>
        </SectionAnimation>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <SectionAnimation>
            <div className="prose prose-lg max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </SectionAnimation>

          <SectionAnimation>
            <div className="relative">
              <div className="sticky top-24">
                <div className="bg-secondary text-white p-8 rounded-lg shadow-lg mb-8">
                  <blockquote className="text-xl italic mb-4">{philosophy.quote}</blockquote>
                  <cite className="block text-right">— {philosophy.quoteAuthor}</cite>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/biology-lab-microscopy.png"
                    alt="研究室の様子"
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </SectionAnimation>
        </div>
      </PageContainer>
    </div>
  )
}
