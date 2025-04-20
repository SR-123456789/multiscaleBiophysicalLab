"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getResearchById, type ResearchItem } from "@/lib/api"

export default function ResearchDetailPage({ params }: { params: { id: string } }) {
  const [research, setResearch] = useState<ResearchItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedResearch = await getResearchById(params.id)
        setResearch(selectedResearch)
      } catch (error) {
        console.error("Failed to fetch research:", error)
        setError("データの取得中にエラーが発生しました。")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error || !research) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <PageContainer>
          <div className="mb-6">
            <Link
              href="/research"
              className="inline-flex items-center text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              研究テーマ一覧に戻る
            </Link>
          </div>

          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error || "エラーが発生しました。"}</p>
            <Link
              href="/research"
              className="inline-block bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              研究テーマ一覧に戻る
            </Link>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <div className="mb-6">
          <Link
            href="/research"
            className="inline-flex items-center text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            研究テーマ一覧に戻る
          </Link>
        </div>

        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{research.title}</h1>

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="prose prose-lg max-w-none">
              {/* HTML形式の詳細説明を表示 */}
              {research.descriptionDetail ? (
                <div dangerouslySetInnerHTML={{ __html: research.descriptionDetail }} />
              ) : (
                <p>{research.summary}</p>
              )}

              <div className="mt-8 flex space-x-4">
                <Link
                  href="/students"
                  className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  学生の方へ
                </Link>
                <Link
                  href="/facilities"
                  className="inline-block bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
                >
                  研究設備を見る
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24 space-y-8">
                {research.image && research.image.length > 0 && research.image[0].url ? (
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={research.image[0].url || "/placeholder.svg"}
                      alt={research.title}
                      width={research.image[0].width}
                      height={research.image[0].height}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center"
                    style={{ height: "300px" }}
                  >
                    <p className="text-gray-500">画像がありません</p>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-secondary">関連研究テーマ</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/research" className="text-primary hover:underline">
                        他の研究テーマを見る
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SectionAnimation>
      </PageContainer>
    </div>
  )
}
