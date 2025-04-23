/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Award,
  FlaskRoundIcon as Flask,
  BookOpen,
  Microscope,
  GraduationCap,
  Mail,
} from "lucide-react";
import Carousel from "@/components/carousel";
import SectionAnimation from "@/components/section-animation";
import {
  getNews,
  getResearch,
  getCarouselImages,
  type NewsItem,
  type ResearchItem,
  type CarouselImage,
} from "@/lib/api";
import HorizontalScroll from "@/components/horizontal-scroll";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  // 初期状態でtrueに設定して即時アニメーションを開始
  const [showSlogan, setShowSlogan] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 並列でデータを取得
        const [newsResult, researchData, carouselData] = await Promise.all([
          getNews(5, 0), // ホームページには最新5件だけ表示
          getResearch(),
          getCarouselImages(),
        ]);

        setNews(newsResult.news);
        setResearch(researchData);
        setCarouselImages(carouselData);

        // データ取得成功時にコンソールに出力（デバッグ用）
        console.log("ニュースデータ:", newsResult.news);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // スローガンを文字ごとに分割してアニメーション用の要素を作成
  const sloganText = "生物に関する不思議を機械工学的に理解し、応用を目指します";
  const sloganChars = sloganText.split("").map((char, index) => (
    <span
      key={index}
      className="slogan-char"
      style={{ "--char-index": index } as React.CSSProperties}
    >
      {char}
    </span>
  ));

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // フォーマット不明ならそのまま表示
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen pt-24">
        <div className="container px-4 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Image Carousel Section */}
      <section className="pt-24">
        <div className="container px-4">
          <SectionAnimation>
            <Carousel
              images={carouselImages}
              className="h-[300px] md:h-[400px] lg:h-[500px]"
              autoplay={true}
              interval={5000}
            />
          </SectionAnimation>
        </div>
      </section>

      {/* Slogan Section - カルーセルの下に配置 */}
      <section className="py-10 bg-white relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center">
            {showSlogan && (
              <div className="slogan-animation">
                <p className="text-secondary text-2xl md:text-3xl lg:text-4xl brush-text">
                  {sloganChars}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Section
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <SectionAnimation>
            <h2 className="section-title mb-8">ニュース</h2>
            <div className="touch-pan-x">
              <HorizontalScroll
                className="pb-8"
                itemClassName="w-[300px] md:w-[350px] px-3 first:pl-0 last:pr-0"
                autoScroll={true}
                scrollSpeed={50}
              >
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full"
                  >
                    <time className="text-sm text-gray-500 mb-2 block">{item.date}</time>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.content}</p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                      >
                        詳細を見る
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </HorizontalScroll>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/news"
                className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                すべてのニュースを見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </SectionAnimation>
        </div>
      </section> */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 max-w-6xl mx-auto">
          <SectionAnimation>
            <h2 className="section-title mb-10 text-3xl font-bold text-center">
              ニュース
            </h2>

            <div className="flex flex-col gap-1">
              {news.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex flex-col max-w-[85%] mr-4">
                    <time className="text-xs text-gray-400 mb-1">
                      {formatDate(item.date)}
                    </time>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.content}
                    </p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      詳細
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/news"
                className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full transition shadow hover:shadow-md"
              >
                すべてのニュースを見る
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <SectionAnimation>
            <h2 className="section-title mb-8">研究内容</h2>
            <div className="touch-pan-x">
              <HorizontalScroll
                className="pb-8"
                itemClassName="w-[300px] md:w-[350px] px-3 first:pl-0 last:pr-0"
                autoScroll={true}
                scrollSpeed={70}
              >
                {research.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col"
                  >
                    <div className="h-48 relative">
                      <Image
                        src={
                          item.image &&
                          item.image.length > 0 &&
                          item.image[0].url
                            ? item.image[0].url
                            : "/placeholder.svg"
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1">
                        {item.summary}
                      </p>
                      <Link
                        href={`/research/${item.id}`}
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-auto"
                      >
                        詳細を見る
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/research"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                すべての研究テーマを見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* Quick Navigation Section - 新しく追加 */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4">
          <SectionAnimation>
            <h2 className="section-title mb-12 text-center">研究室について</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {[
                {
                  icon: <Users className="h-8 w-8 mb-3" />,
                  title: "メンバー",
                  href: "/members",
                  color: "primary",
                },
                {
                  icon: <Award className="h-8 w-8 mb-3" />,
                  title: "研究業績",
                  href: "/achievements",
                  color: "secondary",
                },
                {
                  icon: <Microscope className="h-8 w-8 mb-3" />,
                  title: "研究設備",
                  href: "/facilities",
                  color: "primary",
                },
                {
                  icon: <Flask className="h-8 w-8 mb-3" />,
                  title: "研究テーマ",
                  href: "/research",
                  color: "secondary",
                },
                {
                  icon: <BookOpen className="h-8 w-8 mb-3" />,
                  title: "ブログ/特集",
                  href: "/blog",
                  color: "primary",
                },
                {
                  icon: <GraduationCap className="h-8 w-8 mb-3" />,
                  title: "学生の方へ",
                  href: "/students",
                  color: "secondary",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-b-4 border-${item.color} text-center h-full`}
                >
                  <div className={`text-${item.color}`}>{item.icon}</div>
                  <h3 className="font-bold">{item.title}</h3>
                </Link>
              ))}
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* Philosophy Section - 新しく追加 */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/cellular-landscape.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container px-4 relative z-10">
          <SectionAnimation>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="section-title mb-8 inline-block">研究理念</h2>
              <blockquote className="text-xl md:text-2xl italic text-gray-700 mb-8">
                "細胞は豆腐より柔らかいけどプリンより硬い"
              </blockquote>
              <p className="text-gray-600 mb-8">
                上杉研では，生物に関わる「力」を理解し応用するための知識として機械工学が適していると考え，機械工学的知見を中心に研究を進めています。
                これら複合的かつ幅広い視野のもと，生物機能を解明し，更には応用することで新しい知識・価値観を提案することが当研究室の目標です。
              </p>
              <Link
                href="/philosophy"
                className="inline-flex items-center bg-secondary/90 hover:bg-secondary text-white px-6 py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                研究理念の詳細を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* For Students Section - 新しく追加 */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <SectionAnimation>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="section-title mb-6">学生の方へ</h2>
                <p className="text-gray-600 mb-6">
                  上杉研では、生物物理学と機械工学の境界領域で、新しい発見や技術開発に挑戦する意欲的な学生を歓迎します。
                  研究室では「考えて行動し，広い視野を得る」という行為を体験し学んでもらいます。
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full text-primary mr-4 mt-1">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">研究テーマ例</h3>
                      <p className="text-sm text-gray-600">
                        生体模倣型マイクロロボット、細胞力学の定量解析、バイオインスパイアード材料など
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full text-primary mr-4 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">研究室見学</h3>
                      <p className="text-sm text-gray-600">
                        研究室の見学は随時受け付けています。メールでご連絡ください。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/students"
                    className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
                  >
                    学生向け情報を見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/university-lecture.png"
                    alt="学生の研究活動"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* Contact CTA Section - 新しく追加 */}
      <section className="py-16 bg-secondary text-white">
        <div className="container px-4">
          <SectionAnimation>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                お問い合わせ
              </h2>
              <p className="text-lg mb-8">
                上杉研では外部からの学生、外部研究機関、企業との共同研究を歓迎します！
                研究室に興味がある方は是非ご連絡ください。
              </p>
              <a
                href="mailto:k-uesugi@fc.ritsumei.ac.jp"
                className="inline-flex items-center bg-white text-secondary hover:bg-gray-100 px-8 py-4 rounded-md transition-colors shadow-md hover:shadow-lg font-bold text-lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                メールでのお問い合わせ
              </a>
            </div>
          </SectionAnimation>
        </div>
      </section>
    </div>
  );
}
