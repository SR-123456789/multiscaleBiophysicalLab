import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Serif_JP } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })
const notoSerifJP = Noto_Serif_JP({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
})

export const metadata: Metadata = {
  title: "上杉研究室 | マルチスケール・階層的生物物理応用研究室",
  description: "生物に関する不思議を機械工学的に理解し、応用を目指します",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`scroll-smooth ${notoSerifJP.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}
