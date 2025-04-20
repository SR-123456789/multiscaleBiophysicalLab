// 各セクションのデータ型定義

// 査読付き学術論文
export interface JournalArticle {
  id: string
  authors: string
  title: string
  journal: string
  year: number
  doi?: string
}

// 総説
export interface Review {
  id: string
  authors: string
  title: string
  journal: string
  year: number
}

// 書籍
export interface Book {
  id: string
  authors: string
  title: string
  publisher: string
  year: number
  doi?: string
}

// 特許
export interface Patent {
  id: string
  date: string
  inventors: string
  title: string
  patentNumber?: string
  applicationNumber?: string
  publicationNumber?: string
}

// 賞与
export interface Award {
  id: string
  date: string
  title: string
  description?: string
}

// 学生の受賞
export interface StudentAward {
  id: string
  date: string
  title: string
  description: string
}

// 研究に関わる出展
export interface Exhibition {
  id: string
  title: string
  location: string
  date: string
}

// API レスポンスの型定義
export interface AchievementsResponse {
  journalArticles: JournalArticle[]
  reviews: Review[]
  books: Book[]
  patents: Patent[]
  awards: Award[]
  studentAwards: StudentAward[]
  exhibitions: Exhibition[]
}

// フィルタリングパラメータの型定義
export interface AchievementsQueryParams {
  year?: number
  author?: string
  section?: "journalArticles" | "reviews" | "books" | "patents" | "awards" | "studentAwards" | "exhibitions"
  limit?: number
  offset?: number
}
