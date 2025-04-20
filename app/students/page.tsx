/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import { useState } from "react"
import Image from "next/image"
import SectionAnimation from "@/components/section-animation"
import PageContainer from "@/components/page-container"

export default function StudentsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="pt-24 pb-16">
      <PageContainer>
        <SectionAnimation>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">学生の方へ</h1>
          <p className="text-lg text-gray-600 mb-12">
            これから研究をしたい、もしくは既に研究をしている学生さんへ（For Students）
          </p>
        </SectionAnimation>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <SectionAnimation>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                皆さんは，中等教育から高等教育に移り，様々な世界で様々な立場になり活動してきたことでしょう．だからこそ，大学や研究室での学びがどのように役に立つのかとても疑問に思っているかと思います．大学での教育が役に立たない云々といった情報を耳にするかもしれません．
              </p>

              <p className="mb-6">では，皆さんは大学で，特に研究室で何を学ぶのでしょうか？</p>

              <p className="mb-6">皆さんには「考えて行動し，広い視野を得る」という行為を体験し学んでもらいます．</p>

              <p className="mb-6">
                これから，企業，大学，フリーランス等の道を進み社会に出ると，様々な疑問，理不尽，差別にぶつかるはずです．しかし，そこに完全な正解，正義，平等はありません．なぜなら，世の中は様々な価値観・宗教観・文化であふれ，多くの要素が影響し合い，かつ非常に流動的に物事が動いているからです．産・学・官がそれぞれの考え方や価値観・宗教観・文化のもと活動し，その場その時でベストな解を得ようと日々苦心しています．このため，我々工学系であっても，解を得るのに研究室での知識が直接的に役に立つことはそう多くないでしょう．
              </p>

              <p className="mb-6">
                しかし，だからこそ皆さんは研究室で研究を行ってください．研究に携わることによって，皆さんはどのように物事を見て，どのよ���に情報を集め，取捨選択し，どのようにその情報を解析し，どのように解釈するか，更にその結果をどのように活かすか，その一連の流れを実践するはずです．そして，その経験こそが今後社会に出てから最も役に立つはずです．外部から来た情報をただ鵜呑みにして振り回され流されるのではなく，評価，吟味し，判断・行動できるようになるのです．複雑な世の中において行動指針を論理的に立て易くなるのです．要は「哲学」を柱にした行動をとれるようになります．これは，理系や文系，更には科学を基礎としない学問分野においても，とにかく研究の世界全体で言えることです．
              </p>

              <p className="mb-6">
                加えて，研究の世界では「独創性（オリジナリティ）」に大きな価値観を置く場でもあります．得られた情報・解釈をもとに何が独創的かを見極め，新しい価値観や知見を生み出す能力こそが研究室で身に着けるべきスキルになります．社会において「独創性」は非常に貴重で強力な武器となります．
              </p>

              <p className="mb-6">
                必ずしも研究室で学んだ人が物事を考え，独創性を生み出すことができて，研究室で学ばなかった人がそれをできないわけではありません．ただ，研究室で学ぶことによって，この能力を獲得，もしくは向上できる確率はかなり上がるはずです．社会で生き残る確率が上がるのです．
              </p>

              <p className="mb-6">
                また，視野や考え方が広がれば人生が豊かになります．例えば道端を歩いていても色々なことに気付くようになるでしょう．例えば，なぜ蟻や草木の表面は硬いことが多いのに，人間の表面は柔らかいのでしょうか？　哺乳類の細胞はプリンの様に柔らかいのに，どうして向こうの歩道でランニングしているおじさんの身体は走る衝撃で崩れ落ちないのでしょうか？　雨粒が何かしらの物体の表面にくっついた際に，表面の種類によって水滴の形状が異なりますが，なぜでしょう？　道を横切っている猫の脚力は人と比べてどのくらいの力で，どのくらいの速さで走ることができるのでしょうか？　ちょっとした道端でこれだけ色々考えることがあるのだから，普通に生きていても退屈しない人生になりそうだと思いませんか？
              </p>

              <p className="mb-6">
                今後待つ長い人生において，少しでも生き残る確率を上げ，なおかつ少しでも退屈しない人生を歩む為にも研究に際しては，理系・文系問わず学んでください．そして様々な考え方や価値観・宗教観・文化があることを知ってください．一つのことを突き詰めることはもちろん良いことでもありますが，一つの知識や経験に凝り固まることは危険も含んでいます．学士号，修士号，博士号は就職するための免許ではありません．ただ漠然と授業単位を取り，指導教官の兵隊になるのではなくいろいろなことを試してみてください．遊んでください．本を読んでください．スポーツや観劇，芸術鑑賞も良いでしょう．そして，考えることを続けてください．漠然とデータ収集をこなしたり，授業を受けることだけは注意しましょう．受け身になってしまうと充足感や安心感は得やすいですが，思考は止まります．また，研究そっちのけで何かに夢中になってみるのも，自堕落に遊び惚けるのも，高等教育だからこそ享受できるあなたの選択です．
              </p>

              <p className="mb-6">
                最後になりましたが，偉そうなことを言っている私自身がこれらを実践できているわけではありません．だからこそ，研究を通して皆さんと一緒に学んでいきたいと思っています．皆さんは，学生という立場ですが，研究室に配属されれば，一人の研究者としても扱われます．私も皆さんを部下とか弟子とかそういうものではなく研究者として扱いたいと思います．もちろん，先人として知識や経験を分けることはあるかもしれませんが，科学的な議論を行う上で上下関係は存在しません．是非一緒に議論しましょう．そして，皆さんが研究を通じて得た経験・知識・価値観を私に教えてください．
              </p>
            </div>
          </SectionAnimation>

          <SectionAnimation>
            <div className="relative">
              <div className="sticky top-24 space-y-8">
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-bold mb-4 text-primary">研究室見学のお申し込み</h3>
                  <p className="mb-4">研究室の見学を希望される方は、以下のメールアドレスまでご連絡ください。</p>
                  <a
                    href="mailto:k-uesugi@fc.ritsumei.ac.jp"
                    className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    メールでのお問い合わせ
                  </a>
                </div>

                <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                  <h3 className="text-xl font-bold mb-4 text-secondary">研究テーマ例</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>生体模倣型マイクロロボット</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>細胞力学の定量解析</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>バイオインスパイアード材料</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>マイクロ流体デバイスによる細胞解析</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <a
                      href="/research"
                      className="text-secondary hover:text-primary transition-colors text-sm font-medium"
                    >
                      研究テーマの詳細を見る →
                    </a>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?key=4d96z"
                    alt="研究室の学生"
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </SectionAnimation>
        </div>
      </PageContainer>
    </div>
  )
}
