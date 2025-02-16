"use client"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  FileText,
  MessageSquare,
  PieChart,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Category } from "./types/category" // Assuming you have the Category interface defined
import { Blog } from "./types/blog" // Assuming you have the Blog interface defined
import {InterestedUser} from "./types/intersted" // Assuming you have the InterestedUser interface defined
import { Consultation } from "./types/consultaions" // Assuming you have the Consultation interface defined
const stats = [
  {
    title: "إجمالي المشاريع",
    value: "1,234",
    icon: Building,
    change: "+5.25%",
    trend: "up",
  },
  {
    title: "المستخدمين النشطين",
    value: "567",
    icon: Users,
    change: "+2.74%",
    trend: "up",
  },
  {
    title: "المقالات الجديدة",
    value: "30",
    icon: FileText,
    change: "+3.15%",
    trend: "up",
  },
  {
    title: "عدد المهتمين",
    value: "890",
    icon: PieChart,
    change: "+1.23%",
    trend: "up",
  },
  {
    title: "عدد الاستشارات",
    value: "250",
    icon: MessageSquare,
    change: "+7.89%",
    trend: "up",
  },
]

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])

  const getConsultationType = (type: string) => {
    const types = {
      zoom: 'زووم',
      google_meet: 'جوجل ميت',
      whatsapp: 'واتساب'
    }
    return types[type as keyof typeof types] || type
  }

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/category/getLastThreeCategory')
        const data = await response.json()
        setCategories(data.returnedData.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:8080/blog/getLastThreeBlogsforDashboard')
        const data = await response.json()
        setBlogs(data.returnedData.blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    const fetchInterestedUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/interested/getLastThreeIntersted')
        const data = await response.json()
        setInterestedUsers(data.returnedData.intested)
      } catch (error) {
        console.error('Error fetching interested users:', error)
      }
    }
    const fetchConsultations = async () => {
      try {
        const response = await fetch('http://localhost:8080/consultation/getLastThreeConsultes')
        const data = await response.json()
        setConsultations(data.returnedData.consultes)
      } catch (error) {
        console.error('Error fetching consultations:', error)
      }
    }
    fetchBlogs()
    fetchCategories()
    fetchConsultations()
    fetchInterestedUsers()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out lg:pr-64">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">لوحة التحكم الرئيسية</h2>
          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                      <span className={`font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 ml-1">من الشهر الماضي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Latest Projects and Articles Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
 
  {/* Latest Projects */}
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center">
        <Building className="h-5 w-5 text-primary mr-2" />
        المشاريع الجديدة
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={category.Image?.secure_url} 
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{category.title}</div>
                <div className="text-sm text-gray-500">موقع المشروع: {category.location}</div>
              </div>
            </div>
            <div className="text-lg font-semibold text-green-500">جديد</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

            {/* Latest Articles */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="text-xl font-bold flex items-center">
        <FileText className="h-5 w-5 text-primary mr-2" />
          اجمالي المقالات 
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={blog.Image.secure_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{blog.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-green-500">جديد</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
          </div>

          {/* User Interactions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interested Users */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Users className="h-5 w-5 text-primary mr-2" />
          المهتمون بالمشاريع
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {interestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-500">مهتم ب: {user.unitId.title}</div>
                </div>
              </div>
              <div className="text-lg font-semibold text-blue-500">متابع</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>


            {/* Consultations */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <MessageSquare className="h-5 w-5 text-primary mr-2" />
          الاستشارات الأخيرة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div
              key={consultation._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    استشارة عبر {getConsultationType(consultation.type)}
                  </div>
                  <div className="text-sm text-gray-500">
                    اليوم: {consultation.selectedDay} | هاتف: {consultation.phone}
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-orange-500">قيد المعالجة</div>
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