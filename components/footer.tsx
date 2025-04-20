import Link from "next/link"
import { Mail, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3">上杉研究室</h3>
            <p className="mb-2 text-sm">マルチスケール・階層的生物物理応用研究室</p>
            <p className="text-xs text-gray-300 mb-3">生物に関する不思議を機械工学的に理解し、応用を目指します</p>

            <div className="space-y-1 text-sm">
              <p className="flex items-center">
                <span className="mr-2">
                  <Mail size={14} />
                </span>
                上杉 薫（Kaoru Uesugi）
              </p>
              <p className="flex items-center">
                <span className="mr-2">
                  <Mail size={14} />
                </span>
                <a href="mailto:k-uesugi@fc.ritsumei.ac.jp" className="hover:text-primary transition-colors">
                  k-uesugi(at)fc.ritsumei.ac.jp
                </a>
              </p>
            </div>

            <p className="mt-3 text-xs">
              上杉研では外部からの学生、外部研究機関、企業との共同研究を歓迎します！！
              <br />
              理系・文系は問いません。研究室に興味がある方は是非ご連絡下さい。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">アクセス</h3>
            <div className="space-y-1">
              <p className="flex items-start text-sm">
                <span className="mr-2 mt-1">
                  <MapPin size={14} />
                </span>
                <span>
                  立命館大学　びわこ・くさつキャンパス
                  <br />
                  イーストウィング 712，エクセル3 第1研，第2研
                  <br />
                  （〒525-0058 滋賀県草津市野路東1-1-1）
                </span>
              </p>
            </div>

            <h3 className="text-lg font-bold mt-4 mb-3">リンク</h3>
            <ul className="space-y-1 text-sm">
              {[
                { name: "Researchmap", href: "https://researchmap.jp/" },
                { name: "Google Scholar", href: "https://scholar.google.com/" },
                { name: "KAKEN", href: "https://kaken.nii.ac.jp/" },
                { name: "立命館大学ロボティクス学科", href: "https://www.ritsumei.ac.jp/" },
                { name: "科研費学術変革領域（A）分子サイバネティクス", href: "https://www.jst.go.jp/" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">サイトマップ</h3>
            <ul className="space-y-1 text-sm">
              {[
                { name: "ホーム", href: "/" },
                { name: "メンバー", href: "/members" },
                { name: "研究業績", href: "/achievements" },
                { name: "研究設備", href: "/facilities" },
                { name: "研究理念", href: "/philosophy" },
                { name: "学生向け", href: "/students" },
                { name: "担当科目", href: "/lectures" },
                { name: "研究テーマ", href: "/research" },
                { name: "ニュース", href: "/news" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-xs text-gray-400">Copyright © Uesugi Lab All rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
