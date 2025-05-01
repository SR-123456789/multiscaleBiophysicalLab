/* app/(blog)/[slug]/page.tsx
   ─────────────────────────
   Server Component (SSR) 版
*/
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SectionAnimation from "@/components/section-animation";
import PageContainer from "@/components/page-container";
import { getNewPageBySlug, type NewPageItem } from "@/lib/api";

/* ───── ヘルパー関数 ─────────────────────────────── */
const extractThumbnail = (html: string): string => {
  const eyecatch = html.match(/eyecatch: "([^"]+)"/)?.[1];
  if (eyecatch) return eyecatch;
  const img = html.match(/<img[^>]+src="([^"]+)"/)?.[1];
  if (img) return img;
  const url = html.match(/https?:\/\/[^"\s]+\.(?:jpe?g|png|gif|webp)/)?.[0];
  return url ?? "/diverse-blog-community.png";
};

const extractTags = (html: string): string[] =>
  html
    .match(/tags:\s*\n([\s\S]*?)(?:\n\n|\n---)/m)?.[1]
    ?.split("\n")
    .map((l) => l.match(/\s*-\s*"([^"]+)"/)?.[1] ?? null)
    .filter(Boolean) as string[] ?? [];

const extractCategory = (html: string): string | null =>
  html.match(/category:\s*"([^"]+)"/)?.[1] ?? null;

/* フロントマターを落とす等、必要ならここで整形 */
const formatContent = (html: string): string => html;

/* ───── Server Component ───────────────────────── */
export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let page: NewPageItem | null = null;

  try {
    page = await getNewPageBySlug(params.slug);
  } catch {
    /* フェッチ失敗 → null のまま */
  }

  if (!page) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <PageContainer>
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              ブログ一覧に戻る
            </Link>
          </div>
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">ページが見つかりません。</p>
            <Link
              href="/blog"
              className="inline-block bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              ブログ一覧に戻る
            </Link>
          </div>
        </PageContainer>
      </div>
    );
  }

  /* ─── HTML 解析 ─────────────────────────────── */
  const thumbnailUrl = extractThumbnail(page.content);
  const tags = extractTags(page.content);
  const category = extractCategory(page.content);
  const formattedContent = formatContent(page.content);

  /* ─── 画面描画 ─────────────────────────────── */
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <PageContainer>
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ブログ一覧に戻る
          </Link>
        </div>

        <SectionAnimation>
          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {category && (
                  <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium">
                    {category}
                  </span>
                )}
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <time className="text-gray-500 text-xs px-3 py-1 rounded-full bg-gray-100">
                  {new Date(page.publishedAt).toLocaleDateString("ja-JP")}
                </time>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {page.title}
              </h1>

              {page.author && (
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{page.author}</p>
                    <p className="text-xs text-gray-500">著者</p>
                  </div>
                </div>
              )}

              {/* サムネイルを使う場合はここを戻す */}
            </header>

            {/* 本文 */}
            <div className="bg-white rounded-xl p-6 md:p-10">
              <article
                className="cms-body"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ブログ一覧に戻る
              </Link>
            </div>
          </article>
        </SectionAnimation>
      </PageContainer>
    </div>
  );
}
