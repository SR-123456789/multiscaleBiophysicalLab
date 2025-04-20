"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getResearch, type ResearchItem } from "@/lib/api"

export default function ResearchPage() {
  const [research, setResearch] = useState<ResearchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getResearch()
        setResearch(data)
      } catch (error) {
        console.error("Failed to fetch research:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ホームに戻る
          </Link>
        </div>

        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">研究テーマ</h1>
          <p className="text-lg text-gray-600 mb-12">上杉研究室の主な研究テーマをご紹介します</p>
        </SectionAnimation>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-500">読み込み中...</div>
          </div>
        ) : research.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">研究テーマはまだ登録されていません。</p>
          </div>
        ) : (
          <div className="space-y-16">
            {research.map((item, index) => (
              <SectionAnimation key={item.id}>
                <div
                  className={`grid gap-8 ${index % 2 === 0 ? "lg:grid-cols-[1fr_1.5fr]" : "lg:grid-cols-[1.5fr_1fr]"}`}
                >
                  <div className={`${index % 2 === 1 ? "lg:order-last" : ""}`}>
                    <h2 className="text-2xl font-bold mb-4 text-secondary">{item.title}</h2>
                    <p className="text-gray-600 mb-6">{item.summary}</p>
                    <Link
                      href={`/research/${item.id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      詳細を見る
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={
                        item.image && item.image.length > 0 && item.image[0].url
                          ? item.image[0].url
                          : "/placeholder.svg"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </SectionAnimation>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
