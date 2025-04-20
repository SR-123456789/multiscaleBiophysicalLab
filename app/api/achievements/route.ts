import { type NextRequest, NextResponse } from "next/server"
import type { AchievementsResponse, AchievementsQueryParams } from "@/types/api"

// 実際のデータは別ファイルから取得するか、データベースから取得します
// ここではモックデータを使用します
import { journalArticles, reviews, books, patents, awards, studentAwards, exhibitions } from "@/data/achievements"

export async function GET(request: NextRequest) {
  try {
    // URLからクエリパラメータを取得
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined
    const author = searchParams.get("author") || undefined
    const section = (searchParams.get("section") as AchievementsQueryParams["section"]) || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0

    // 全データを取得
    let response: AchievementsResponse = {
      journalArticles,
      reviews,
      books,
      patents,
      awards,
      studentAwards,
      exhibitions,
    }

    // フィルタリング: 年
    if (year) {
      response = {
        journalArticles: response.journalArticles.filter((item) => item.year === year),
        reviews: response.reviews.filter((item) => item.year === year),
        books: response.books.filter((item) => item.year === year),
        patents: response.patents, // 特許には年が直接ないので、日付から抽出する必要があります
        awards: response.awards, // 賞与も同様
        studentAwards: response.studentAwards,
        exhibitions: response.exhibitions,
      }
    }

    // フィルタリング: 著者/発明者
    if (author) {
      const authorLower = author.toLowerCase()
      response = {
        journalArticles: response.journalArticles.filter((item) => item.authors.toLowerCase().includes(authorLower)),
        reviews: response.reviews.filter((item) => item.authors.toLowerCase().includes(authorLower)),
        books: response.books.filter((item) => item.authors.toLowerCase().includes(authorLower)),
        patents: response.patents.filter((item) => item.inventors.toLowerCase().includes(authorLower)),
        awards: response.awards,
        studentAwards: response.studentAwards,
        exhibitions: response.exhibitions,
      }
    }

    // 特定のセクションのみ返す
    if (section) {
      const sectionData = response[section]
      return NextResponse.json({ [section]: sectionData })
    }

    // ページネーション
    if (limit) {
      response = {
        journalArticles: response.journalArticles.slice(offset, offset + limit),
        reviews: response.reviews.slice(offset, offset + limit),
        books: response.books.slice(offset, offset + limit),
        patents: response.patents.slice(offset, offset + limit),
        awards: response.awards.slice(offset, offset + limit),
        studentAwards: response.studentAwards.slice(offset, offset + limit),
        exhibitions: response.exhibitions.slice(offset, offset + limit),
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements data" }, { status: 500 })
  }
}
