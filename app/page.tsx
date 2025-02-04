import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, CreditCard, TrendingUp } from "lucide-react"

const stats = [
  { title: "إجمالي العقارات", value: "1,234", icon: Building, change: "+5.25%" },
  { title: "المستأجرين النشطين", value: "567", icon: Users, change: "+2.74%" },
  { title: "الإيرادات الشهرية", value: "123,456 ريال", icon: CreditCard, change: "+10.15%" },
  { title: "معدل الإشغال", value: "94%", icon: TrendingUp, change: "+1.23%" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">لوحة التحكم الرئيسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} من الشهر الماضي</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>أحدث العقارات</CardTitle>
            </CardHeader>
            <CardContent>{/* هنا يمكنك إضافة قائمة بأحدث العقارات */}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>آخر المعاملات</CardTitle>
            </CardHeader>
            <CardContent>{/* هنا يمكنك إضافة قائمة بآخر المعاملات */}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

