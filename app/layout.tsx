import "./globals.css"
import { Noto_Kufi_Arabic } from "next/font/google"
import { SidebarProvider } from "@/components/SidebarProvider"
import type React from "react"

const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"] })

export const metadata = {
  title: "لوحة تحكم العقارات",
  description: "لوحة تحكم عصرية للعقارات",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={notoKufiArabic.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  )
}

