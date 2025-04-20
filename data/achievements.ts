import type { JournalArticle, Review, Book, Patent, Award, StudentAward, Exhibition } from "@/types/api"

// 査読付き学術論文
export const journalArticles: JournalArticle[] = [
  {
    id: "j1",
    authors: "K. Uesugi, S. Obata, K. Nagayama",
    title:
      "Micro tensile tester measurement of biomechanical properties and adhesion force of microtubule-polymerization-inhibited cancer cells",
    journal: "Journal of the Mechanical Behavior of Biomedical Materials, Vol. 156, 106586",
    year: 2024,
    doi: "10.1016/j.jmbbm.2024.106586",
  },
  {
    id: "j2",
    authors: "Y. Wang, K. Uesugi, T. Nitta, Y. Hiratsuka, K. Morishima",
    title: "Contractile and tensile measurement of molecular artificial muscles for biohybrid robotics",
    journal: "Cyborg and Bionic Systems, Vol. 5, Article ID: 0106",
    year: 2024,
    doi: "10.34133/cbsystems.0106",
  },
  // 他の論文データ...
]

// 総説
export const reviews: Review[] = [
  {
    id: "r1",
    authors: "上杉薫，森島圭祐",
    title: "バイオマテリアルとマイクロナノマシンが拓く生命機械融合ウェットロボティクス",
    journal: "バイオマテリアル・生体材料，Vol. 32, No. 4，pp. 272-281",
    year: 2014,
  },
  // 他の総説データ...
]

// 書籍
export const books: Book[] = [
  {
    id: "b1",
    authors: "Y. Takashima, K. Uesugi, K. Morishima",
    title: "Construction and Functional Emergence of Bioactuated Micronanosystem and Living Machined Wet Robotics",
    publisher:
      'K. Asaka, H Okuzaki (Editor), "Soft Actuators -Materials, Modeling, Applications, and Future Perspectives-", Springer Nature Singapore Pte Ltd., pp. 723-740',
    year: 2019,
    doi: "10.1007/978-981-13-6850-9_41",
  },
  // 他の書籍データ...
]

// 特許
export const patents: Patent[] = [
  {
    id: "p1",
    date: "2024年12月26日",
    inventors: "上杉薫，大内椋太",
    title: "試料固定治具",
    applicationNumber: "2024-229928",
  },
  // 他の特許データ...
]

// 賞与
export const awards: Award[] = [
  {
    id: "a1",
    date: "2023年7月12日",
    title: "TRiSTARフェロー認定",
    description:
      "文部科学省「世界で活躍できる研究者戦略育成事業」として実施する「大学×国研×企業連携によるトップランナー育成プログラム（TRiSTAR）」（代表機関　国立大学法人筑波大学）の育成対象者",
  },
  // 他の賞与データ...
]

// 学生の受賞
export const studentAwards: StudentAward[] = [
  {
    id: "sa1",
    date: "2024年8月30日",
    title: "優秀講演賞（指導学生の受賞）",
    description:
      '発表内容：大内椋太，広瀬裕一，長山和亮，上杉薫"ホヤ表面ナノ構造の防汚機能メカニズム解明に向けた摩擦力測定システムの開発"，日本機械学会 2024年茨城講演会，日立，76（2024.8）',
  },
  // 他の学生受賞データ...
]

// 研究に関わる出展
export const exhibitions: Exhibition[] = [
  {
    id: "e1",
    title: "衝撃型攪拌装置（企業との共同展示）",
    location: "E21，東京たま未来メッセ展示場",
    date: "2024年12月23～24日",
  },
  // 他の出展データ...
]
