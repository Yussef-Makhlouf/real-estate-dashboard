import "./globals.css"
import { Noto_Kufi_Arabic } from "next/font/google"
import { SidebarProvider } from "@/components/SidebarProvider"
import type React from "react"
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


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
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  )
}

