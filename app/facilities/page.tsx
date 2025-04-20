"use client"

import { useEffect, useState } from "react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import Carousel from "@/components/carousel"
import { getFacilities, type FacilityItem } from "@/lib/api"

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getFacilities()
        setFacilities(data)
      } catch (error) {
        console.error("Error fetching facilities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">研究設備</h1>
          <p className="text-lg text-gray-600 mb-12">上杉研究室の主な研究設備をご紹介します</p>
        </SectionAnimation>

        <div className="space-y-16">
          {facilities.length > 0 ? (
            facilities.map((facility, index) => (
              <SectionAnimation key={facility.id}>
                <div
                  className={`grid gap-8 ${index % 2 === 0 ? "lg:grid-cols-[1fr_1.5fr]" : "lg:grid-cols-[1.5fr_1fr]"}`}
                >
                  <div className={`${index % 2 === 1 ? "lg:order-last" : ""}`}>
                    <h2 className="text-2xl font-bold mb-4 text-secondary">{facility.title}</h2>
                    <p className="text-gray-600">{facility.summary}</p>
                  </div>
                  <div>
                    <Carousel
                      images={facility.images.map((image) => ({
                        src: { url: image.url },
                        alt: facility.title,
                      }))}
                      className="h-[250px] md:h-[350px] rounded-lg overflow-hidden"
                    />
                  </div>
                </div>
              </SectionAnimation>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">現在、研究設備の情報はありません。</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  )
}
