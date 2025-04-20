"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getNews, type NewsItem } from "@/lib/api"

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const LIMIT = 20 // 一度に取得するニュース数

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getNews(LIMIT, 0)
        setNews(result.news)
        setTotalCount(result.totalCount)
        setHasMore(result.hasMore)
        setOffset(LIMIT)
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const loadMore = async () => {
    if (loadingMore) return

    try {
      setLoadingMore(true)
      const result = await getNews(LIMIT, offset)
      setNews((prevNews) => [...prevNews, ...result.news])
      setHasMore(result.hasMore)
      setOffset((prevOffset) => prevOffset + LIMIT)
    } catch (error) {
      console.error("Failed to fetch more news:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // 年月ごとにニュースをグループ化
  const groupedNews: Record<string, NewsItem[]> = {}

  news.forEach((item) => {
    // 日付が既に「YYYY年MM月DD日」形式の場合は、年月だけを抽出
    let yearMonth: string
    if (item.date.includes("年")) {
      const dateParts = item.date.split("年")
      const year = dateParts[0]
      const month = dateParts[1].split("月")[0]
      yearMonth = `${year}年${month}月`
    } else {
      // 日付が ISO 形式の場合は変換
      try {
        const date = new Date(item.date)
        if (!isNaN(date.getTime())) {
          yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`
        } else {
          yearMonth = "日付不明"
        }
      } catch (error) {
        console.error("日付の変換に失敗:", item.date)
        yearMonth = "日付不明"
      }
    }

    if (!groupedNews[yearMonth]) {
      groupedNews[yearMonth] = []
    }

    groupedNews[yearMonth].push(item)
  })

  // 年月を降順にソート
  const sortedYearMonths = Object.keys(groupedNews).sort((a, b) => {
    // 「YYYY年MM月」形式から年と月を抽出
    const yearA = Number.parseInt(a.split("年")[0])
    const monthA = Number.parseInt(a.split("年")[1].split("月")[0])
    const yearB = Number.parseInt(b.split("年")[0])
    const monthB = Number.parseInt(b.split("年")[1].split("月")[0])

    // 年で比較し、同じ年なら月で比較
    if (yearA !== yearB) {
      return yearB - yearA // 降順
    }
    return monthB - monthA // 降順
  })

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ニュース</h1>
          <p className="text-lg text-gray-600 mb-4">上杉研究室の最新情報をお届けします</p>
          <p className="text-sm text-gray-500 mb-12">
            全{totalCount}件中 {news.length}件表示
          </p>
        </SectionAnimation>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-500">読み込み中...</div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">ニュースはまだありません。</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedYearMonths.map((yearMonth) => (
              <SectionAnimation key={yearMonth}>
                <h2 className="text-xl font-bold mb-6 text-secondary border-b border-gray-200 pb-2">{yearMonth}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedNews[yearMonth].map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <time className="text-sm text-gray-500 mb-2 block">{item.date}</time>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.content}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors text-sm"
                        >
                          詳細を見る
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </SectionAnimation>
            ))}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "読み込み中..." : "もっと読み込む"}
                </button>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
