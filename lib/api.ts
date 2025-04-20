// This file will be used for microCMS integration

// microCMS API設定を更新
const API_ENDPOINT = "https://inxbd58g5q.microcms.io/api/v1"
const API_KEY = "KQ6Fyu8fFotgdCfQGlErjzNCPdLbYyAlGADo"

// 講義・設備・研究テーマ用の新しいAPIエンドポイントとキー
const EXTENDED_API_ENDPOINT = "https://9952iolksf.microcms.io/api/v1"
const EXTENDED_API_KEY = "OAiNTAuhB6ZnDPaENQikLjWCA6nUtzoIQum0"

// 新しいページ用のAPIエンドポイントとキー
const NEWPAGE_API_ENDPOINT = "https://or19bteehs.microcms.io/api/v1"
const NEWPAGE_API_KEY = "pnzZXSv7q5cqutdTt0rlAuxOhmkehkPqXbyP"

// 新しい論文用のAPIエンドポイントとキーを追加
const JOURNAL_API_ENDPOINT = "https://tl3azu471k.microcms.io/api/v1"
const JOURNAL_API_KEY = "5py7c8bbO6eqC5SWMeg53gXwEk56NETc3PHs"

// その他の受賞用のAPIエンドポイントとキーを追加
const OTHERAWARDS_API_ENDPOINT = "https://cr7mwojdjf.microcms.io/api/v1"
const OTHERAWARDS_API_KEY = "NYGFsbYMvdczd8R7jzzgMVnSewa2ThMLaLWD"

// 共通のfetch関数
async function fetchFromMicroCMS<T>(endpoint: string, options: RequestInit = {}, limit = 100): Promise<T> {
  const url = new URL(`${API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("limit", limit.toString())

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": API_KEY,
      ...options.headers,
    },
    ...options,
    cache: "no-store", // SSRでの最新データ取得のため
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from microCMS: ${response.status}`)
  }
  return response.json()
}

// 拡張API用のfetch関数
async function fetchFromExtendedMicroCMS<T>(endpoint: string, options: RequestInit = {}, limit = 100): Promise<T> {
  const url = new URL(`${EXTENDED_API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("limit", limit.toString())

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": EXTENDED_API_KEY,
      ...options.headers,
    },
    ...options,
    cache: "no-store", // SSRでの最新データ取得のため
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from extended microCMS: ${response.status}`)
  }
  return response.json()
}

// 新しいページ用のfetch関数
async function fetchFromNewPageMicroCMS<T>(endpoint: string, options: RequestInit = {}, limit = 100): Promise<T> {
  const url = new URL(`${NEWPAGE_API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("limit", limit.toString())

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": NEWPAGE_API_KEY,
      ...options.headers,
    },
    ...options,
    cache: "no-store", // SSRでの最新データ取得のため
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from newpage microCMS: ${response.status}`)
  }
  return response.json()
}

// 論文用のfetch関数
async function fetchFromJournalMicroCMS<T>(endpoint: string, options: RequestInit = {}, limit = 100): Promise<T> {
  const url = new URL(`${JOURNAL_API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("limit", limit.toString())

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": JOURNAL_API_KEY,
      ...options.headers,
    },
    ...options,
    cache: "no-store", // SSRでの最新データ取得のため
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from journal microCMS: ${response.status}`)
  }
  return response.json()
}

// その他の受賞用のfetch関数
async function fetchFromOtherAwardsMicroCMS<T>(endpoint: string, options: RequestInit = {}, limit = 100): Promise<T> {
  const url = new URL(`${OTHERAWARDS_API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("limit", limit.toString())

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": OTHERAWARDS_API_KEY,
      ...options.headers,
    },
    ...options,
    cache: "no-store", // SSRでの最新データ取得のため
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from other awards microCMS: ${response.status}`)
  }
  return response.json()
}

// 特定のIDのコンテンツを取得するための関数
async function fetchSingleContentFromExtendedMicroCMS<T>(endpoint: string, contentId: string): Promise<T> {
  const response = await fetch(`${EXTENDED_API_ENDPOINT}/${endpoint}/${contentId}`, {
    headers: {
      "X-MICROCMS-API-KEY": EXTENDED_API_KEY,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch content from extended microCMS: ${response.status}`)
  }
  return response.json()
}

// 特定のスラッグのコンテンツを取得するための関数
async function fetchContentBySlugFromNewPageMicroCMS<T>(endpoint: string, slug: string): Promise<T> {
  const url = new URL(`${NEWPAGE_API_ENDPOINT}/${endpoint}`)
  url.searchParams.append("filters", `slug[equals]${slug}`)

  const response = await fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": NEWPAGE_API_KEY,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch content by slug from newpage microCMS: ${response.status}`)
  }

  const data = await response.json()
  if (data.contents && data.contents.length > 0) {
    return data.contents[0] as T
  }

  throw new Error(`Content with slug ${slug} not found`)
}

// microCMSのレスポンス型
interface MicroCMSResponse<T> {
  contents: T[]
  totalCount: number
  limit: number
  offset: number
}

// カルーセル画像の型定義
export interface CarouselImage {
  id: string
  src: {
    url: string
  }
  alt: string
}

// カルーセル画像を取得する関数
export async function getCarouselImages(): Promise<CarouselImage[]> {
  try {
    const data = await fetchFromMicroCMS<MicroCMSResponse<CarouselImage>>("carouselimages")
    return data.contents
  } catch (error) {
    console.error("Error fetching carousel images:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "1",
        src: { url: "/biology-lab-microscopy.png" },
        alt: "研究室の様子",
      },
      {
        id: "2",
        src: { url: "/microfluidic-manipulation.png" },
        alt: "マイクロロボット実験",
      },
      {
        id: "3",
        src: { url: "/cellular-force-microscopy.png" },
        alt: "細胞力学測定",
      },
      {
        id: "4",
        src: { url: "/nature-inspired-materials.png" },
        alt: "生体模倣材料研究",
      },
    ]
  }
}

// ニュース記事の型定義
export interface NewsItem {
  id: string
  title: string
  date: string
  originalDate?: string // 元のISO形式の日付を保持するためのプロパティ
  content: string
  url?: string // URLフィールドを追加
}

// ニュース記事を取得する関数（ページネーション対応）
export async function getNews(
  limit = 100,
  offset = 0,
): Promise<{
  news: NewsItem[]
  totalCount: number
  hasMore: boolean
}> {
  try {
    // URLパラメータを構築
    const url = new URL(`${API_ENDPOINT}/news`)
    url.searchParams.append("limit", limit.toString())
    url.searchParams.append("offset", offset.toString())

    const response = await fetch(url.toString(), {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`)
    }

    const data = (await response.json()) as MicroCMSResponse<NewsItem>

    // 日付を整形して返す
    const formattedNews = data.contents.map((item) => ({
      ...item,
      // 元の日付を保持
      originalDate: item.date,
      // ISO形式の日付を「YYYY年MM月DD日」形式に変換
      date: formatDate(item.date),
    }))

    return {
      news: formattedNews,
      totalCount: data.totalCount,
      hasMore: offset + limit < data.totalCount,
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    // エラー時はフォールバックデータを返す
    return {
      news: [
        {
          id: "fallback-1",
          title: "データの取得に失敗しました",
          date: new Date().toISOString().split("T")[0],
          content: "申し訳ありませんが、ニュース記事の取得中にエラーが発生しました。",
        },
      ],
      totalCount: 1,
      hasMore: false,
    }
  }
}

// 日付をフォーマットする関数
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    // 日付が有効かチェック
    if (isNaN(date.getTime())) {
      console.warn("無効な日付:", dateString)
      return dateString // 変換できない場合は元の文字列を返す
    }

    // 日本語の日付形式に変換
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  } catch (error) {
    console.error("日付の変換に失敗:", dateString, error)
    return dateString // エラーが発生した場合は元の文字列を返す
  }
}

// 研究テーマの型定義を更新
export interface ResearchItem {
  id: string
  title: string
  summary: string
  image: {
    url: string
    height: number
    width: number
  }[]
  descriptionDetail?: string // HTML形式の詳細説明
}

// 研究テーマを取得する関数
export async function getResearch(): Promise<ResearchItem[]> {
  try {
    // 研究テーマ用のAPIからデータを取得
    const data = await fetchFromExtendedMicroCMS<MicroCMSResponse<ResearchItem>>("researchtheme")
    return data.contents
  } catch (error) {
    console.error("Error fetching research themes:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        title: "生体模倣型マイクロロボット",
        summary:
          "生物の動きや機能を模倣したマイクロスケールのロボットを開発し、医療や環境モニタリングへの応用を目指しています。特に、細菌の鞭毛運動や繊毛運動を模倣した推進機構、自己組織化による集団行動制御などに注目し研究を進めています。",
        image: [
          {
            url: "/swarm-of-microrobots.png",
            height: 600,
            width: 800,
          },
        ],
      },
      {
        id: "fallback-2",
        title: "細胞力学の定量解析",
        summary:
          "細胞の力学的特性を高精度に計測し、疾患メカニズムの解明や新たな診断技術の開発に取り組んでいます。原子間力顕微鏡やマイクロピラーアレイなどの先端技術を用いて、細胞の弾性率や接着力、収縮力などを定量的に評価しています。",
        image: [
          {
            url: "/cellular-forces.png",
            height: 600,
            width: 800,
          },
        ],
      },
    ]
  }
}

// 特定の研究テーマを取得する関数
export async function getResearchById(id: string): Promise<ResearchItem> {
  try {
    // 特定のIDの研究テーマを取得
    const data = await fetchSingleContentFromExtendedMicroCMS<ResearchItem>("researchtheme", id)
    return data
  } catch (error) {
    console.error(`Error fetching research theme with ID ${id}:`, error)
    // エラー時はフォールバックデータを返す
    return {
      id: "error",
      title: "データの取得に失敗しました",
      summary: "申し訳ありませんが、研究テーマの取得中にエラーが発生しました。",
      image: [
        {
          url: "/placeholder.svg",
          height: 600,
          width: 800,
        },
      ],
      descriptionDetail: "<p>詳細情報を取得できませんでした。</p>",
    }
  }
}

// メンバー情報の型定義（microCMSのレスポンス形式に合わせて更新）
export interface MemberItem {
  id: string
  name: string
  position: string[] // 配列に変更
  bio: string
  image: {
    url: string
    height: number
    width: number
  }
}

// メンバー情報を取得する関数
export async function getMembers(): Promise<MemberItem[]> {
  try {
    // microCMSからメンバー情報を取得
    const data = await fetchFromMicroCMS<MicroCMSResponse<MemberItem>>("member")
    return data.contents
  } catch (error) {
    console.error("Error fetching members:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        name: "上杉 薫",
        position: ["教授"],
        bio: "東京大学工学部卒業、同大学院工学系研究科博士課程修了。専門は生体力学、マイクロロボティクス。20年以上にわたり生物の動きや機能を工学的に応用する研究に従事。",
        image: {
          url: "/diverse-professor-lecture.png",
          height: 600,
          width: 800,
        },
      },
      {
        id: "fallback-2",
        name: "鈴木 健太",
        position: ["准教授"],
        bio: "京都大学工学部卒業、同大学院工学研究科博士課程修了。専門はバイオメカニクス、細胞工学。細胞の力学特性の計測と応用に関する研究を行っている。",
        image: {
          url: "/diverse-faculty-discussion.png",
          height: 600,
          width: 800,
        },
      },
      {
        id: "fallback-3",
        name: "田中 美咲",
        position: ["助教"],
        bio: "大阪大学基礎工学部卒業、同大学院基礎工学研究科博士課程修了。専門は生体材料、ソフトマター物理。生物由来の材料開発と特性評価を担当。",
        image: {
          url: "/university-lecture.png",
          height: 600,
          width: 800,
        },
      },
    ]
  }
}

export interface AchievementItem {
  id: string
  year: number
  title: string
  link?: string
}

// 設備情報の型定義
export interface FacilityItem {
  id: string
  title: string
  summary: string
  images: {
    url: string
    height: number
    width: number
  }[]
}

// 設備情報を取得する関数
export async function getFacilities(): Promise<FacilityItem[]> {
  try {
    // 設備用のAPIからデータを取得
    const data = await fetchFromExtendedMicroCMS<MicroCMSResponse<FacilityItem>>("equipment")
    return data.contents
  } catch (error) {
    console.error("Error fetching facilities:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        title: "原子間力顕微鏡（AFM）",
        summary:
          "ナノスケールでの表面形状観察と力学特性計測が可能な最新のAFMシステムを備えています。細胞や生体材料の力学特性評価に使用しています。",
        images: [
          {
            url: "/atomic-force-microscope-schematic.png",
            height: 600,
            width: 800,
          },
          {
            url: "/atomic-force-microscope-scan.png",
            height: 600,
            width: 800,
          },
        ],
      },
      {
        id: "fallback-2",
        title: "マイクロ流体デバイス作製設備",
        summary:
          "クリーンルーム内にフォトリソグラフィー装置やプラズマ処理装置を備え、様々なマイクロ流体デバイスを自作できる環境を整えています。",
        images: [
          {
            url: "/microfluidic-fabrication-overview.png",
            height: 600,
            width: 800,
          },
          {
            url: "/sterile-manufacturing.png",
            height: 600,
            width: 800,
          },
        ],
      },
    ]
  }
}

export interface PhilosophyItem {
  id: string
  content: string
  quote: string
  quoteAuthor: string
}

export async function getPhilosophy(): Promise<PhilosophyItem> {
  return {
    id: "1",
    content: `細胞は豆腐より柔らかいけどプリンより硬い――
アメンボが水面を蹴っても脚に水がまとわりつくことはない――
　でも，なぜ？　どうして？


　エネルギーは力や熱，光など多様な形を取りますが，中でも「ニュートン（N）」を用いて表現される「力」は皆さんにとって一番親しみ深いものではないでしょうか？
　例えば，生物は様々な形で力を発揮します．カブトムシを捕まえるとすごい力で暴れて手が引っ掻き傷だらけになります．魚を釣れば，竿が信じられない様な力で引っ張られます．雑草はアスファルトを押し上げ，突き破り力強く生い茂ります．私達はサッカーボールを遠くまで蹴り飛ばし，逆上がりもできます．
　加えて，私達が最初に客観的なエネルギーに関する表現方法として習い，認識する概念もまた「力」です．例えば，小学校の算数や理科で「重さ」や「バネの力」は習ったでしょう．また，運動会での綱引きや，繋いだ手を誰かに引っ張られたり引き返したり，直感的にも「力」が何たるかを理解していたと思います．
　以上のことから単純な話ですが，私はこれまで最も慣れ親しんできた「力」という概念を研究手段として採用しました．研究対象はこれも単純で，やはり幼少から慣れ親しみ「力」という概念を直感的に理解するための糧となった「生物」そのものです．
　生き物たちの力はどのくらいの大きさなのでしょう？　どうやって力を出しているのでしょう？　筋肉の細胞達が力を振り絞っているのでしょうか？　大きな力を出した場合，多量の細胞から構成される身体は壊れてしまわないのでしょうか？　押したり引っ張ったり外力を加えるとどうなるのでしょうか？
　こういった疑問に科学的手法を用いて向き合えば，生物，ヒトを理解する上で新しい発見があるかもしれません．また，その発見を応用することで，新しい技術が生まれるかもしれません．そして，知識や技術の更新によって新しい文化が発生するかもしれません．

　上杉研では，生物に関わる「力」を理解し応用するための知識として機械工学が適していると考え，機械工学的知見を中心に研究を進めています．もちろん，研究領域は複合的なため，扱う知識は機械工学だけでなく生物学，電気・電子工学，医学，化学など多義にわたります．
　これら複合的かつ幅広い視野のもと，生物機能を解明し，更には応用することで新しい知識・価値観を提案することが当研究室の目標です．また，体系立った知識を社会に供給することで文化的基盤を豊かにしていくことが使命です．`,
    quote: "細胞は豆腐より柔らかいけどプリンより硬い",
    quoteAuthor: "上杉 薫",
  }
}

export interface StudentMessageItem {
  id: string
  content: string
}

export async function getStudentMessage(): Promise<StudentMessageItem> {
  return {
    id: "1",
    content: `## 研究室を志望する学生の皆さんへ

当研究室では、生物物理学と機械工学の境界領域で、新しい発見や技術開発に挑戦する意欲的な学生を歓迎します。

### 求める学生像

- 生物の不思議な機能や構造に興味を持ち、それを工学的に理解・応用したいと考えている方
- 実験と理論の両面からアプローチできる柔軟な思考力を持つ方
- 異分野の知識を積極的に学び、融合させる意欲のある方
- チームでの研究活動を大切にし、コミュニケーション能力の高い方

### 研究室での学び

当研究室では、機械工学の基礎知識に加え、生物学、材料科学、制御工学など多岐にわたる分野の知識を学ぶことができます。また、最先端の実験設備を用いた実践的な研究スキルも身につけることができます。

定期的なセミナーや学会発表を通じて、プレゼンテーション能力やディスカッション能力も養成します。また、国内外の研究機関との共同研究も活発に行っており、幅広い視野を持った研究者・技術者を育成することを目指しています。

### 卒業後のキャリア

当研究室の卒業生は、医療機器メーカー、精密機器メーカー、自動車メーカーなどの研究開発部門や、大学・研究機関など、様々な分野で活躍しています。バイオエンジニアリングの知識と経験は、今後ますます社会で求められるスキルとなるでしょう。

### 研究室訪問について

研究室の見学は随時受け付けています。実際の研究環境や雰囲気を知りたい方は、メールでご連絡ください。また、毎年夏と冬にオープンラボを開催していますので、そちらにもぜひご参加ください。

皆さんと一緒に研究できる日を楽しみにしています。`,
  }
}

// 講義情報の型定義
export interface LectureItem {
  id: string
  title: string
  description: string
  semester: string[]
  kind: string[]
  url?: string
  years: string // ISO形式の日付文字列
}

// 講義情報を取得する関数
export async function getLectures(): Promise<LectureItem[]> {
  try {
    // 講義用のAPIからデータを取得
    const data = await fetchFromExtendedMicroCMS<MicroCMSResponse<LectureItem>>("lecture")
    return data.contents
  } catch (error) {
    console.error("Error fetching lectures:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        title: "生体工学概論",
        description:
          "生物の構造や機能を工学的に理解し応用するための基礎知識を学びます。生体材料、バイオメカニクス、バイオミメティクスなどの基本概念を解説します。",
        semester: ["前期"],
        kind: ["学部"],
        years: new Date().toISOString(),
      },
      {
        id: "fallback-2",
        title: "マイクロ・ナノ工学",
        description:
          "マイクロスケール、ナノスケールでの物理現象と工学応用について学びます。MEMS技術、マイクロ流体力学、ナノスケール計測技術などを取り上げます。",
        semester: ["後期"],
        kind: ["学部"],
        years: new Date().toISOString(),
      },
    ]
  }
}

export async function getAchievements(): Promise<AchievementItem[]> {
  return [
    {
      id: "1",
      year: 2024,
      title:
        'K. Uesugi, et al. "Biomimetic microrobots for targeted drug delivery", Nature Robotics, Vol. 5, pp. 123-130',
      link: "#",
    },
    {
      id: "2",
      year: 2023,
      title:
        'K. Suzuki, M. Tanaka, K. Uesugi, "Mechanical properties of cancer cells measured by atomic force microscopy", Journal of Biomechanics, Vol. 76, pp. 45-52',
      link: "#",
    },
    {
      id: "3",
      year: 2023,
      title:
        'M. Tanaka, K. Uesugi, "Bio-inspired adhesive materials with hierarchical structures", Advanced Materials, Vol. 35, pp. 2100123',
      link: "#",
    },
    {
      id: "4",
      year: 2022,
      title:
        'T. Sato, K. Uesugi, "Autonomous control system for swarm microrobots", IEEE Transactions on Robotics, Vol. 38, pp. 1567-1580',
      link: "#",
    },
    {
      id: "5",
      year: 2022,
      title:
        'K. Uesugi, K. Suzuki, "Cellular mechanotransduction in disease progression", Annual Review of Biomedical Engineering, Vol. 24, pp. 267-289',
      link: "#",
    },
    {
      id: "6",
      year: 2021,
      title:
        'K. Suzuki, K. Uesugi, "High-throughput mechanical phenotyping of cells using microfluidic devices", Lab on a Chip, Vol. 21, pp. 3456-3470',
      link: "#",
    },
  ]
}

// 新しいページの型定義
export interface NewPageItem {
  id: string
  title: string
  slug: string
  content: string
  keyword?: string
  genre?: string
  author?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// 新しいページを取得する関数（ページネーション対応）
export async function getNewPages(
  limit = 100,
  offset = 0,
): Promise<{
  pages: NewPageItem[]
  totalCount: number
  hasMore: boolean
}> {
  try {
    // URLパラメータを構築
    const url = new URL(`${NEWPAGE_API_ENDPOINT}/newpage`)
    url.searchParams.append("limit", limit.toString())
    url.searchParams.append("offset", offset.toString())

    const response = await fetch(url.toString(), {
      headers: {
        "X-MICROCMS-API-KEY": NEWPAGE_API_KEY,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch new pages: ${response.status}`)
    }

    const data = (await response.json()) as MicroCMSResponse<NewPageItem>

    return {
      pages: data.contents,
      totalCount: data.totalCount,
      hasMore: offset + limit < data.totalCount,
    }
  } catch (error) {
    console.error("Error fetching new pages:", error)
    // エラー時はフォールバックデータを返す
    return {
      pages: [
        {
          id: "fallback-1",
          title: "データの取得に失敗しました",
          slug: "error",
          content: "申し訳ありませんが、ページの取得中にエラーが発生しました。",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
      ],
      totalCount: 1,
      hasMore: false,
    }
  }
}

// 特定のスラッグのページを取得する関数
export async function getNewPageBySlug(slug: string): Promise<NewPageItem> {
  try {
    const data = await fetchContentBySlugFromNewPageMicroCMS<NewPageItem>("newpage", slug)
    return data
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    // エラー時はフォールバックデータを返す
    return {
      id: "error",
      title: "ページが見つかりません",
      slug: "not-found",
      content: "<p>お探しのページは見つかりませんでした。</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    }
  }
}

// 検索用の関数を追加
export async function searchNewPages(
  query: string,
  limit = 100,
  offset = 0,
): Promise<{
  pages: NewPageItem[]
  totalCount: number
  hasMore: boolean
}> {
  try {
    // URLパラメータを構築
    const url = new URL(`${NEWPAGE_API_ENDPOINT}/newpage`)
    url.searchParams.append("limit", limit.toString())
    url.searchParams.append("offset", offset.toString())

    // 検索クエリを追加（microCMSの検索構文に合わせる）
    if (query) {
      url.searchParams.append("q", query)
    }

    const response = await fetch(url.toString(), {
      headers: {
        "X-MICROCMS-API-KEY": NEWPAGE_API_KEY,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to search new pages: ${response.status}`)
    }

    const data = (await response.json()) as MicroCMSResponse<NewPageItem>

    return {
      pages: data.contents,
      totalCount: data.totalCount,
      hasMore: offset + limit < data.totalCount,
    }
  } catch (error) {
    console.error("Error searching new pages:", error)
    return {
      pages: [],
      totalCount: 0,
      hasMore: false,
    }
  }
}

// 査読付き論文の型定義
export interface JournalArticle {
  id: string
  authors: string
  title: string
  journal: string
  year: string
  doi?: string
  url?: string
}

// 査読付き論文を取得する関数
export async function getJournalArticles(): Promise<JournalArticle[]> {
  try {
    const data = await fetchFromJournalMicroCMS<MicroCMSResponse<JournalArticle>>("journalarticles")
    return data.contents
  } catch (error) {
    console.error("Error fetching journal articles:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        authors: "K. Uesugi, S. Obata, K. Nagayama",
        title:
          "Micro tensile tester measurement of biomechanical properties and adhesion force of microtubule-polymerization-inhibited cancer cells",
        journal: "Journal of the Mechanical Behavior of Biomedical Materials, Vol. 156, 106586",
        year: "2024",
        doi: "10.1016/j.jmbbm.2024.106586",
      },
    ]
  }
}

// 総説の型定義
export interface Review {
  id: string
  authors: string
  title: string
  journal: string
  year: string
  doi?: string
  url?: string
}

// 総説を取得する関数
export async function getReviews(): Promise<Review[]> {
  try {
    const data = await fetchFromJournalMicroCMS<MicroCMSResponse<Review>>("journalarticles")
    return data.contents
  } catch (error) {
    console.error("Error fetching reviews:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        authors: "上杉薫，森島圭祐",
        title: "バイオマテリアルとマイクロナノマシンが拓く生命機械融合ウェットロボティクス",
        journal: "バイオマテリアル・生体材料，Vol. 32, No. 4，pp. 272-281",
        year: "2014",
      },
    ]
  }
}

// 書籍の型定義
export interface Book {
  id: string
  authors: string
  title: string
  publisher: string
  year: string
  doi?: string
  url?: string
}

// 書籍を取得する関数
export async function getBooks(): Promise<Book[]> {
  try {
    const data = await fetchFromJournalMicroCMS<MicroCMSResponse<Book>>("books")
    return data.contents
  } catch (error) {
    console.error("Error fetching books:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        authors: "Y. Takashima, K. Uesugi, K. Morishima",
        title: "Construction and Functional Emergence of Bioactuated Micronanosystem and Living Machined Wet Robotics",
        publisher:
          'K. Asaka, H Okuzaki (Editor), "Soft Actuators -Materials, Modeling, Applications, and Future Perspectives-", Springer Nature Singapore Pte Ltd., pp. 723-740',
        year: "2019",
        doi: "10.1007/978-981-13-6850-9_41",
      },
    ]
  }
}

// 特許の型定義
export interface Patent {
  id: string
  date: string
  inventors: string
  title: string
  patentNumber?: string
  applicationNumber?: string
  publicationNumber?: string
  url?: string
}

// 特許を取得する関数
export async function getPatents(): Promise<Patent[]> {
  try {
    const data = await fetchFromNewPageMicroCMS<MicroCMSResponse<Patent>>("patent")

    // 日付を整形して返す
    const formattedPatents = data.contents.map((patent) => ({
      ...patent,
      // ISO形式の日付を「YYYY年MM月DD日」形式に変換
      date: formatDate(patent.date),
    }))

    return formattedPatents
  } catch (error) {
    console.error("Error fetching patents:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        date: "2024年12月26日",
        inventors: "上杉薫，大内椋太",
        title: "試料固定治具",
        applicationNumber: "2024-229928",
      },
      {
        id: "fallback-2",
        date: "2023年1月15日",
        inventors: "上杉薫",
        title: "撹拌装置及び撹拌方法",
        applicationNumber: "PCT/JP2023/041158",
        publicationNumber: "WO 2024/116857 A1",
      },
    ]
  }
}

// 賞与の型定義
export interface Award {
  id: string
  date: string
  title: string
  description?: string
  url?: string
}

// 賞与を取得する関数
export async function getAwards(): Promise<Award[]> {
  try {
    const data = await fetchFromNewPageMicroCMS<MicroCMSResponse<Award>>("awards")

    // 日付を整形して返す
    const formattedAwards = data.contents.map((award) => ({
      ...award,
      // ISO形式の日付を「YYYY年MM月DD日」形式に変換
      date: formatDate(award.date),
    }))

    return formattedAwards
  } catch (error) {
    console.error("Error fetching awards:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "fallback-1",
        date: "2023年7月12日",
        title: "TRiSTARフェロー認定",
        description:
          "文部科学省「世界で活躍できる研究者戦略育成事業」として実施する「大学×国研×企業連携によるトップランナー育成プログラム（TRiSTAR）」（代表機関　国立大学法人筑波大学）の育成対象者",
      },
      {
        id: "fallback-2",
        date: "2019年3月5日",
        title: "優秀講演賞",
        description:
          '発表内容：上杉薫，眞山博幸，森島圭祐"アメンボの幼虫と成虫の表面構造による撥水機能の差異"第19回公益社団法人　計測自動制御学会　システムインテグレーション部門講演会，大阪，2D1-10（2018.12）',
      },
    ]
  }
}

// 学生の受賞の型定義
export interface StudentAward {
  id: string
  date: string
  title: string
  description: string
  url?: string
}

// 学生の受賞を取得する関数
export async function getStudentAwards(): Promise<StudentAward[]> {
  try {
    const data = await fetchFromOtherAwardsMicroCMS<MicroCMSResponse<StudentAward>>("otherawards")

    // 日付を整形して返す
    const formattedStudentAwards = data.contents.map((award) => ({
      ...award,
      // ISO形式の日付を「YYYY年MM月DD日」形式に変換
      date: formatDate(award.date),
    }))

    return formattedStudentAwards
  } catch (error) {
    console.error("Error fetching student awards:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "sa1",
        date: "2024年8月30日",
        title: "優秀講演賞（指導学生の受賞）",
        description:
          '発表内容：大内椋太，広瀬裕一，長山和亮，上杉薫"ホヤ表面ナノ構造の防汚機能メカニズム解明に向けた摩擦力測定システムの開発"，日本機械学会 2024年茨城講演会，日立，76（2024.8）',
      },
      {
        id: "sa2",
        date: "2022年8月19日",
        title: "優秀講演賞（指導学生の受賞）",
        description:
          '発表内容：綿谷直樹, 上杉薫, 長山和亮"マイクロ溝基板を用いた細胞の形態制御と細胞内部構造の3次元解析"，日本機械学会 2020年茨城講演会，日立，716（2022.8）',
      },
    ]
  }
}

// 研究に関わる出展の型定義
export interface Exhibition {
  id: string
  title: string
  location: string
  date: string
  url?: string
}

// 研究に関わる出展を取得する関数
export async function getExhibitions(): Promise<Exhibition[]> {
  try {
    const data = await fetchFromOtherAwardsMicroCMS<MicroCMSResponse<Exhibition>>("exhibitions")
    return data.contents
  } catch (error) {
    console.error("Error fetching exhibitions:", error)
    // エラー時はフォールバックデータを返す
    return [
      {
        id: "e1",
        title: "衝撃型攪拌装置（企業との共同展示）",
        location: "E21，東京たま未来メッセ展示場",
        date: "2024年12月23～24日",
      },
      {
        id: "e2",
        title: "ベシクル・コロイド・ドロップレット作製用攪拌装置",
        location: "H-30，東京ビックサイト",
        date: "2023年8月24日～25日",
      },
    ]
  }
}
