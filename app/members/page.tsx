"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"
import { getMembers, type MemberItem } from "@/lib/api"

export default function MembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMembers()
        setMembers(data)
        console.log("メンバーデータ:", data) // デバッグ用
      } catch (error) {
        console.error("Failed to fetch members:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 役職でメンバーをグループ化
  const facultyPositions = ["アメンボ", "教授", "特命教授", "准教授", "助教", "豊年技術者", "秘書"]

  // 教員メンバー（教授、准教授、助教）
  const facultyMembers = members.filter((member) => member.position.some((pos) => facultyPositions.includes(pos)))

  // 学生メンバー（教員以外）
  const studentMembers = members.filter((member) => !member.position.some((pos) => facultyPositions.includes(pos)))

  const toggleBio = (id: string) => {
    setExpandedBios((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">メンバー紹介</h1>
          <p className="text-lg text-gray-600 mb-12">上杉研究室のメンバーをご紹介します</p>
        </SectionAnimation>

        {/* Faculty Members */}
        {facultyMembers.length > 0 && (
          <SectionAnimation className="mb-16">
            <h2 className="section-title mb-8">教員</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
              {facultyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={member.image.url || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="inline-block bg-secondary text-white text-xs sm:text-sm px-2 py-1 rounded mb-1">
                      {member.position[0]} {/* 最初の役職を表示 */}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{member.name}</h3>
                    <div className="relative">
                      <p
                        className={`text-xs sm:text-sm text-gray-600 ${!expandedBios[member.id] ? "line-clamp-2" : ""}`}
                      >
                        {member.bio}
                      </p>
                      {member.bio.length > 50 && (
                        <button
                          onClick={() => toggleBio(member.id)}
                          className="text-xs text-primary mt-1 hover:underline"
                        >
                          {expandedBios[member.id] ? "閉じる" : "もっと見る"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAnimation>
        )}

        {/* Student Members */}
        {studentMembers.length > 0 && (
          <SectionAnimation>
            <h2 className="section-title mb-8">学生</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
              {studentMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={member.image.url || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="inline-block bg-primary text-white text-xs sm:text-sm px-2 py-1 rounded mb-1">
                      {member.position[0]} {/* 最初の役職を表示 */}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{member.name}</h3>
                    <div className="relative">
                      <p
                        className={`text-xs sm:text-sm text-gray-600 ${!expandedBios[member.id] ? "line-clamp-2" : ""}`}
                      >
                        {member.bio}
                      </p>
                      {member.bio.length > 50 && (
                        <button
                          onClick={() => toggleBio(member.id)}
                          className="text-xs text-primary mt-1 hover:underline"
                        >
                          {expandedBios[member.id] ? "閉じる" : "もっと見る"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionAnimation>
        )}

        {/* メンバーがいない場合 */}
        {members.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">メンバー情報はまだ登録されていません。</p>
          </div>
        )}
      </PageContainer>
    </div>
  )
}
