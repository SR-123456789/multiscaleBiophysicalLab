"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, X } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getNewPages, type NewPageItem, searchNewPages } from "@/lib/api"

export default function BlogPage() {
  const [pages, setPages] = useState<NewPageItem[]>([])
  const [filteredPages, setFilteredPages] = useState<NewPageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const LIMIT = 100 // 一度に取得するページ数

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getNewPages(LIMIT, 0)
        setPages(result.pages)
        setFilteredPages(result.pages)
        setTotalCount(result.totalCount)
        setHasMore(result.hasMore)
        setOffset(LIMIT)
      } catch (error) {
        console.error("Failed to fetch pages:", error)
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
      const result = await getNewPages(LIMIT, offset)
      const newPages = [...pages, ...result.pages]
      setPages(newPages)

      // 検索中の場合は、新しく読み込んだページも検索対象にする
      if (searchQuery) {
        const newFilteredPages = filterPages(newPages, searchQuery)
        setFilteredPages(newFilteredPages)
      } else {
        setFilteredPages(newPages)
      }

      setHasMore(result.hasMore)
      setOffset((prevOffset) => prevOffset + LIMIT)
    } catch (error) {
      console.error("Failed to fetch more pages:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // 検索機能を改善
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(!!searchQuery)

    if (!searchQuery) {
      setFilteredPages(pages)
      return
    }

    try {
      setLoading(true)
      // サーバーサイドで検索を実行
      const result = await searchNewPages(searchQuery, LIMIT, 0)
      setFilteredPages(result.pages)
      // 検索結果の総数を表示
      setTotalCount(result.totalCount)
      setHasMore(result.hasMore)
      setOffset(LIMIT)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    setFilteredPages(pages)
    setTotalCount(pages.length)
  }

  // 検索結果の「もっと読み込む」も改善
  const loadMoreSearchResults = async () => {
    if (loadingMore || !searchQuery) return

    try {
      setLoadingMore(true)
      const result = await searchNewPages(searchQuery, LIMIT, offset)
      setFilteredPages((prev) => [...prev, ...result.pages])
      setHasMore(result.hasMore)
      setOffset((prev) => prev + LIMIT)
    } catch (error) {
      console.error("Failed to load more search results:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // ページをフィルタリングする関数
  const filterPages = (pagesArray: NewPageItem[], query: string): NewPageItem[] => {
    if (!query) return pagesArray

    const lowerCaseQuery = query.toLowerCase()
    return pagesArray.filter((page) => {
      // タイトルで検索
      if (page.title.toLowerCase().includes(lowerCaseQuery)) return true

      // コンテンツで検索
      if (page.content.toLowerCase().includes(lowerCaseQuery)) return true

      // キーワードで検索
      if (page.keyword && page.keyword.toLowerCase().includes(lowerCaseQuery)) return true

      // ジャンルで検索
      if (page.genre && page.genre.toLowerCase().includes(lowerCaseQuery)) return true

      return false
    })
  }

  // 日付でページをグループ化
  const groupedPages: Record<string, NewPageItem[]> = {}

  filteredPages.forEach((page) => {
    // 日付を「YYYY年MM月」形式に変換
    const date = new Date(page.publishedAt)
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`

    if (!groupedPages[yearMonth]) {
      groupedPages[yearMonth] = []
    }

    groupedPages[yearMonth].push(page)
  })

  // 年月を降順にソート
  const sortedYearMonths = Object.keys(groupedPages).sort((a, b) => {
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

  // コンテンツから抜粋を抽出する関数
  const extractExcerpt = (content: string, maxLength = 100): string => {
    // HTMLタグを削除
    const textOnly = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // 最初の段落を抽出
    const firstParagraph = textOnly.split(/\n/)[0]

    // 長さを制限
    if (firstParagraph.length <= maxLength) {
      return firstParagraph
    }

    return firstParagraph.substring(0, maxLength) + "..."
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <PageContainer>
        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ブログ / 特集</h1>
          <p className="text-lg text-gray-600 mb-6">上杉研究室の特集記事やブログをご紹介します</p>

          {/* 検索フォーム */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex items-center max-w-md mx-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="キーワードで検索..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* 検索結果の表示 */}
          {isSearching && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                「{searchQuery}」の検索結果: {filteredPages.length}件
                {filteredPages.length === 0 && (
                  <span className="block mt-2 text-gray-500">検索条件に一致する記事が見つかりませんでした。</span>
                )}
              </p>
              {filteredPages.length > 0 && (
                <button onClick={clearSearch} className="mt-2 text-primary hover:text-primary/80 underline text-sm">
                  検索をクリア
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mb-12">
            全{totalCount}件中 {filteredPages.length}件表示
          </p>
        </SectionAnimation>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-500">読み込み中...</div>
          </div>
        ) : filteredPages.length === 0 && !isSearching ? (
          <div className="text-center py-20">
            <p className="text-gray-500">記事はまだありません。</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sortedYearMonths.map((yearMonth) => (
              <SectionAnimation key={yearMonth}>
                <h2 className="text-xl font-bold mb-8 text-secondary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary">
                  {yearMonth}
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {groupedPages[yearMonth].map((page) => (
                    <Link key={page.id} href={`/blog/${page.slug}`} className="group">
                      <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={extractThumbnail(page.content) || "/placeholder.svg"}
                            alt={page.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                          <time className="absolute bottom-4 left-4 text-white text-sm font-medium bg-primary/80 px-2 py-1 rounded">
                            {new Date(page.publishedAt).toLocaleDateString("ja-JP")}
                          </time>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {page.title}
                          </h3>
                          {page.author && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">著者:</span> {page.author}
                            </p>
                          )}
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">{extractExcerpt(page.content)}</p>
                          <div className="flex justify-between items-center">
                            {page.genre && (
                              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                {page.genre}
                              </span>
                            )}
                            <span className="inline-flex items-center text-primary group-hover:text-primary/80 text-sm font-medium">
                              続きを読む{" "}
                              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </SectionAnimation>
            ))}

            {hasMore && !isSearching && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors disabled:opacity-50 font-medium"
                >
                  {loadingMore ? "読み込み中..." : "もっと読み込む"}
                </button>
              </div>
            )}
            {isSearching && hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreSearchResults}
                  disabled={loadingMore}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors disabled:opacity-50 font-medium"
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
