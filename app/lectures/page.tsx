"use client"

import { useEffect, useState } from "react"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getLectures, type LectureItem } from "@/lib/api"
import { ExternalLink } from "lucide-react"

export default function LecturesPage() {
  const [lectures, setLectures] = useState<LectureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [academicYears, setAcademicYears] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getLectures()
        setLectures(data)

        // 年度情報を抽出して重複を排除
        const years = data
          .map((lecture) => {
            try {
              const date = new Date(lecture.years)
              // 日本の学年暦は4月始まりなので、年度は「YYYY年度」の形式にする
              return `${date.getFullYear()}年度`
            } catch (e) {
              console.error("Invalid date:", lecture.years)
              return null
            }
          })
          .filter((year): year is string => year !== null)
          .filter((year, index, self) => self.indexOf(year) === index)
          .sort((a, b) => {
            // 年度の降順（最新の年度が先頭）
            const yearA = Number.parseInt(a.replace("年度", ""))
            const yearB = Number.parseInt(b.replace("年度", ""))
            return yearB - yearA
          })

        setAcademicYears(years)
      } catch (error) {
        console.error("Failed to fetch lectures:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 学期ごとに講義をグループ化
  const lecturesBySemester: Record<string, LectureItem[]> = {}

  // 全ての学期を抽出
  const allSemesters = lectures
    .flatMap((lecture) => lecture.semester)
    .filter((semester, index, self) => self.indexOf(semester) === index)
    .sort()

  // 学期ごとにグループ化
  allSemesters.forEach((semester) => {
    lecturesBySemester[semester] = lectures.filter((lecture) => lecture.semester.includes(semester))
  })

  // 年度ごとに講義をフィルタリングする関数
  const getLecturesByYear = (year: string) => {
    const yearNumber = Number.parseInt(year.replace("年度", ""))
    return lectures.filter((lecture) => {
      try {
        const lectureDate = new Date(lecture.years)
        return lectureDate.getFullYear() === yearNumber
      } catch (e) {
        return false
      }
    })
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">担当科目</h1>
          <p className="text-lg text-gray-600 mb-12">上杉研究室が担当する講義科目をご紹介します</p>
        </SectionAnimation>

        <div className="space-y-16">
          {academicYears.map((year) => (
            <SectionAnimation key={year}>
              <h2 className="section-title mb-8">{year}</h2>

              {allSemesters.map((semester) => {
                // この年度のこの学期の講義をフィルタリング
                const yearLectures = getLecturesByYear(year)
                const semesterLectures = yearLectures.filter((lecture) => lecture.semester.includes(semester))

                if (semesterLectures.length === 0) return null

                return (
                  <div key={`${year}-${semester}`} className="mb-12">
                    <h3 className="text-xl font-bold mb-6 text-secondary border-b border-gray-200 pb-2">{semester}</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {semesterLectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-secondary"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-semibold">{lecture.title}</h4>
                            {lecture.kind && lecture.kind.length > 0 && (
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {lecture.kind.join("・")}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{lecture.description || "詳細情報は準備中です。"}</p>
                          {lecture.url && (
                            <a
                              href={lecture.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary hover:text-primary/80 text-sm"
                            >
                              講義ページを見る <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </SectionAnimation>
          ))}

          {lectures.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">現在、担当科目の情報はありません。</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  )
}
