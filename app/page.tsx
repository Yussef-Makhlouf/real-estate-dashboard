"use client"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, CreditCard, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"

const stats = [
  { 
    title: "إجمالي العقارات", 
    value: "1,234", 
    icon: Building, 
    change: "+5.25%",
    trend: "up"
  },
  { 
    title: "المستأجرين النشطين", 
    value: "567", 
    icon: Users, 
    change: "+2.74%",
    trend: "up"
  },
  { 
    title: "الإيرادات الشهرية", 
    value: "123,456 ريال", 
    icon: CreditCard, 
    change: "+10.15%",
    trend: "up"
  },
  { 
    title: "معدل الإشغال", 
    value: "94%", 
    icon: TrendingUp, 
    change: "+1.23%",
    trend: "up"
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out lg:pr-64">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">لوحة التحكم الرئيسية</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="flex items-center text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`font-medium ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 mr-1">من الشهر الماضي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  أحدث العقارات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Placeholder for latest properties */}
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <CreditCard className="h-5 w-5 text-primary mr-2" />
                  آخر المعاملات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Placeholder for latest transactions */}
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 w-28 bg-gray-200 rounded"></div>
                          <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
                        </div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
