"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getNewPageBySlug, type NewPageItem } from "@/lib/api"

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<NewPageItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getNewPageBySlug(params.slug)
        setPage(data)
      } catch (error) {
        console.error("Failed to fetch page:", error)
        setError("ページの取得中にエラーが発生しました。")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  // コンテンツからサムネイル画像URLを抽出する関数
  const extractThumbnail = (content: string): string => {
    // eyecatchフィールドを探す
    const eyecatchMatch = content.match(/eyecatch: "([^"]+)"/)
    if (eyecatchMatch && eyecatchMatch[1]) {
      return eyecatchMatch[1]
    }

    // imgタグを探す
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/)
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1]
    }

    // 画像URLを探す
    const urlMatch = content.match(/(https?:\/\/[^"\s]+\.(jpg|jpeg|png|gif|webp))/)
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1]
    }

    // デフォルト画像
    return "/diverse-blog-community.png"
  }

  // コンテンツからタグを抽出する関数
  const extractTags = (content: string): string[] => {
    const tagsMatch = content.match(/tags:\s*\n([\s\S]*?)(?:\n\n|\n---)/m)
    if (!tagsMatch || !tagsMatch[1]) return []

    return tagsMatch[1]
      .split("\n")
      .map((line) => {
        const match = line.match(/\s*-\s*"([^"]+)"/)
        return match ? match[1] : null
      })
      .filter(Boolean) as string[]
  }

  // コンテンツからカテゴリを抽出する関数
  const extractCategory = (content: string): string | null => {
    const categoryMatch = content.match(/category:\s*"([^"]+)"/)
    return categoryMatch ? categoryMatch[1] : null
  }

  // HTMLコンテンツを整形する関数
  const formatContent = (content: string): string => {
    // フロントマターを削除
    const formattedContent = content.replace(/---[\s\S]*?---/m, "")

    // 残りのHTMLを返す
    return formattedContent
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <PageContainer>
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-secondary hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ブログ一覧に戻る
            </Link>
          </div>

          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error || "ページが見つかりません。"}</p>
            <Link
              href="/blog"
              className="inline-block bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              ブログ一覧に戻る
            </Link>
          </div>
        </PageContainer>
      </div>
    )
  }

  const thumbnailUrl = extractThumbnail(page.content)
  const tags = extractTags(page.content)
  const category = extractCategory(page.content)
  const formattedContent = formatContent(page.content)

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <PageContainer>
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ブログ一覧に戻る
          </Link>
        </div>

        <SectionAnimation>
          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {category && (
                  <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium">{category}</span>
                )}
                {tags.map((tag, index) => (
                  <span key={index} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                <time className="text-gray-500 text-xs px-3 py-1 rounded-full bg-gray-100">
                  {new Date(page.publishedAt).toLocaleDateString("ja-JP")}
                </time>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{page.title}</h1>

              {page.author && (
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{page.author}</p>
                    <p className="text-xs text-gray-500">著者</p>
                  </div>
                </div>
              )}

              {/* <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt={page.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div> */}
            </header>

            <div className="bg-white rounded-xl p-6 md:p-10 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ブログ一覧に戻る
              </Link>
            </div>
          </article>
        </SectionAnimation>
      </PageContainer>
    </div>
  )
}
