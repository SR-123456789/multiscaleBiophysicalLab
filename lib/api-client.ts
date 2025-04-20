import type { AchievementsResponse, AchievementsQueryParams } from "@/types/api"

/**
 * 研究業績データを取得する関数
 */
export async function getAchievements(params?: AchievementsQueryParams): Promise<AchievementsResponse> {
  try {
    // クエリパラメータの構築
    const queryParams = new URLSearchParams()
    if (params?.year) queryParams.append("year", params.year.toString())
    if (params?.author) queryParams.append("author", params.author)
    if (params?.section) queryParams.append("section", params.section)
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.offset) queryParams.append("offset", params.offset.toString())

    // APIリクエスト
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    const response = await fetch(`/api/achievements${queryString}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data as AchievementsResponse
  } catch (error) {
    console.error("Error fetching achievements:", error)
    throw error
  }
}

/**
 * 特定の年の研究業績を取得する関数
 */
export async function getAchievementsByYear(year: number): Promise<AchievementsResponse> {
  return getAchievements({ year })
}

/**
 * 特定の著者/発明者の研究業績を取得する関数
 */
export async function getAchievementsByAuthor(author: string): Promise<AchievementsResponse> {
  return getAchievements({ author })
}

/**
 * 特定のセクションの研究業績を取得する関数
 */
export async function getAchievementsBySection(
  section: AchievementsQueryParams["section"],
): Promise<Partial<AchievementsResponse>> {
  return getAchievements({ section })
}
