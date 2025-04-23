"use client"

import { useEffect, useState } from "react"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import {
  getJournalArticles,
  getReviews,
  getBooks,
  getPatents,
  getAwards,
  getStudentAwards,
  getExhibitions,
  type JournalArticle,
  type Review,
  type Book,
  type Patent,
  type Award,
  type StudentAward,
  type Exhibition,
} from "@/lib/api"

export default function AchievementsPage() {
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [patents, setPatents] = useState<Patent[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [studentAwards, setStudentAwards] = useState<StudentAward[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("journals")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    journals: true,
    reviews: false,
    books: false,
    patents: false,
    awards: false,
    studentAwards: false,
    exhibitions: false,
  })

  // 初期データをロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 並列でデータを取得
        const [articles, reviewsData, booksData, patentsData, awardsData, studentAwardsData, exhibitionsData] =
          await Promise.all([
            getJournalArticles(),
            getReviews(),
            getBooks(),
            getPatents(),
            getAwards(),
            getStudentAwards(),
            getExhibitions(),
          ])

        setJournalArticles(articles)
        setReviews(reviewsData)
        setBooks(booksData)
        setPatents(patentsData)
        setAwards(awardsData)
        setStudentAwards(studentAwardsData)
        setExhibitions(exhibitionsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // スティッキーヘッダー用のクラス
  const stickyHeaderClass =
    "w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors sticky z-10 border-b shadow-sm"

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // 論文を年ごとにグループ化
  const journalsByYear = journalArticles.reduce(
    (acc, article) => {
      const year = typeof article.year === "string" ? article.year : article.year.toString()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(article)
      return acc
    },
    {} as Record<string, JournalArticle[]>,
  )

  // 総説を年ごとにグループ化
  const reviewsByYear = reviews.reduce(
    (acc, review) => {
      const year = typeof review.year === "string" ? review.year : review.year.toString()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(review)
      return acc
    },
    {} as Record<string, Review[]>,
  )

  // 年を降順にソート
  const sortedJournalYears = Object.keys(journalsByYear).sort((a, b) => Number(b) - Number(a))
  const sortedReviewYears = Object.keys(reviewsByYear).sort((a, b) => Number(b) - Number(a))

  // ローディング中のスケルトン表示
  const JournalSkeleton = () => (
    <div className="p-4">
      <div className="space-y-8">
        {[1, 2].map((year) => (
          <div key={year}>
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // 書籍を年ごとにグループ化する処理を追加
  const booksByYear = books.reduce(
    (acc, book) => {
      const year = typeof book.year === "string" ? book.year : book.year.toString()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(book)
      return acc
    },
    {} as Record<string, Book[]>,
  )

  // 年を降順にソート
  const sortedBookYears = Object.keys(booksByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">研究業績</h1>
          <p className="text-lg text-gray-600 mb-6">上杉研究室の主な研究業績をご紹介します</p>

          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="https://researchmap.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Researchmap <ExternalLink className="ml-1 h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              学会発表などはこちら（Conferences）
            </a>
          </div>
        </SectionAnimation>

        <div className="space-y-8">
          {/* 査読付き学術論文 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden relative">
              <button className={stickyHeaderClass} onClick={() => toggleSection("journals")}>
                <h2 className="text-xl font-bold text-secondary">査読付き学術論文（Journal Articles）</h2>
                {expandedSections.journals ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.journals &&
                (loading ? (
                  <JournalSkeleton />
                ) : (
                  <div className="p-4 pt-0">
                    <div className="space-y-6">
                      {sortedJournalYears.map((year) => (
                        <div key={year}>
                          <h3 className="text-lg font-bold mb-4 text-secondary border-b border-gray-200 pb-2">
                            {year}年
                          </h3>
                          <ul className="space-y-4">
                            {journalsByYear[year].map((article) => (
                              <li
                                key={article.id}
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col">
                                  <p className="mb-1 font-medium">{article.authors}</p>
                                  <p className="mb-1">{article.title}</p>
                                  <p className="text-gray-600">{article.journal}</p>
                                  {article.doi && (
                                    <a
                                      href={`https://doi.org/${article.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline mt-1 inline-flex items-center text-sm"
                                    >
                                      DOI: {article.doi} <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  )}
                                  {article.url && (
                                    <a
                                      href={article.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                                    >
                                      詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </SectionAnimation>
          {/* 総説 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("reviews")}>
                <h2 className="text-xl font-bold text-secondary">総説（Review）</h2>
                {expandedSections.reviews ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.reviews &&
                (loading ? (
                  <JournalSkeleton />
                ) : (
                  <div className="p-4 pt-0">
                    <div className="space-y-6">
                      {sortedReviewYears.map((year) => (
                        <div key={year}>
                          <h3 className="text-lg font-bold mb-4 text-secondary border-b border-gray-200 pb-2">
                            {year}年
                          </h3>
                          <ul className="space-y-4">
                            {reviewsByYear[year].map((review) => (
                              <li
                                key={review.id}
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col">
                                  <p className="mb-1 font-medium">{review.authors}</p>
                                  <p className="mb-1">{review.title}</p>
                                  <p className="text-gray-600">{review.journal}</p>
                                  {review.doi && (
                                    <a
                                      href={`https://doi.org/${review.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline mt-1 inline-flex items-center text-sm"
                                    >
                                      DOI: {review.doi} <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  )}
                                  {review.url && (
                                    <a
                                      href={review.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                                    >
                                      詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </SectionAnimation>
          {/* 書籍 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("books")}>
                <h2 className="text-xl font-bold text-secondary">書籍（Books）</h2>
                {expandedSections.books ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.books && (
                <div className="p-4 pt-0">
                  <div className="space-y-6">
                    {sortedBookYears.map((year) => (
                      <div key={year}>
                        <h3 className="text-lg font-bold mb-4 text-secondary border-b border-gray-200 pb-2">
                          {year}年
                        </h3>
                        <ul className="space-y-4">
                          {booksByYear[year].map((book) => (
                            <li
                              key={book.id}
                              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col">
                                <p className="mb-1 font-medium">{book.authors}</p>
                                <p className="mb-1">{book.title}</p>
                                <p className="text-gray-600">{book.publisher}</p>
                                {book.doi && (
                                  <a
                                    href={`https://doi.org/${book.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline mt-1 inline-flex items-center text-sm"
                                  >
                                    DOI: {book.doi} <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                )}
                                {book.url && (
                                  <a
                                    href={book.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                                  >
                                    詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionAnimation>
          {/* 特許 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("patents")}>
                <h2 className="text-xl font-bold text-secondary">特許（Patent）</h2>
                {expandedSections.patents ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.patents && (
                <div className="p-4">
                  <ul className="space-y-4">
                    {patents.map((patent) => (
                      <li
                        key={patent.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <p className="mb-1 text-sm text-gray-500">{patent.date}</p>
                          <p className="mb-1 font-medium">{patent.inventors}</p>
                          <p className="mb-1">発明の名称：{patent.title}</p>
                          {patent.patentNumber && <p className="text-gray-600">特許番号：{patent.patentNumber}</p>}
                          {patent.publicationNumber && (
                            <p className="text-gray-600">公開番号：{patent.publicationNumber}</p>
                          )}
                          {patent.applicationNumber && (
                            <p className="text-gray-600">出願番号：{patent.applicationNumber}</p>
                          )}
                          {patent.url && (
                            <a
                              href={patent.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                            >
                              詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionAnimation>
          {/* 賞与 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("awards")}>
                <h2 className="text-xl font-bold text-secondary">賞与（Awards）</h2>
                {expandedSections.awards ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.awards && (
                <div className="p-4">
                  <ul className="space-y-4">
                    {awards.map((award) => (
                      <li
                        key={award.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <p className="mb-1 text-sm text-gray-500">{award.date}</p>
                          <p className="mb-1 font-medium">{award.title}</p>
                          {award.description && <p className="text-gray-600">{award.description}</p>}
                          {award.url && (
                            <a
                              href={award.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                            >
                              詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionAnimation>
          {/* 指導学生の受賞 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("studentAwards")}>
                <h2 className="text-xl font-bold text-secondary">その他受賞（Other awards）</h2>
                {expandedSections.studentAwards ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedSections.studentAwards && (
                <div className="p-4">
                  <ul className="space-y-4">
                    {studentAwards.map((award) => (
                      <li
                        key={award.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <p className="mb-1 text-sm text-gray-500">{award.date}</p>
                          <p className="mb-1 font-medium">{award.title}</p>
                          <p className="text-gray-600">{award.description}</p>
                          {award.url && (
                            <a
                              href={award.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                            >
                              詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionAnimation>
          {/* 研究に関わる出展 */}
          <SectionAnimation>
            <div className="border rounded-lg overflow-hidden">
              <button className={stickyHeaderClass} onClick={() => toggleSection("exhibitions")}>
                <h2 className="text-xl font-bold text-secondary">研究に関わる出展（Exhibitions）</h2>
                {expandedSections.exhibitions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {expandedSections.exhibitions && (
                <div className="p-4">
                  <ul className="space-y-4">
                    {exhibitions.map((exhibition) => (
                      <li
                        key={exhibition.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <p className="mb-1 font-medium">{exhibition.title}</p>
                          <p className="text-gray-600">{exhibition.location}</p>
                          <p className="text-sm text-gray-500">{exhibition.date}</p>
                          {exhibition.url && (
                            <a
                              href={exhibition.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 mt-1 inline-flex items-center text-sm"
                            >
                              詳細を見る <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionAnimation>
        </div>
      </PageContainer>
    </div>
  )
}
