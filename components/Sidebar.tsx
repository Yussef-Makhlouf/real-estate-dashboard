// "use client"

// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { Home, Building, Users, FileQuestion, Star, BookOpen, LogOut, X, ChevronDown } from "lucide-react"
// import { useSidebar } from "./SidebarProvider"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// const menuItems = [
//   { name: "لوحة التحكم", icon: Home, href: "/" },
//   { name: "العقارات", icon: Building, href: "/category" },
//   { name: "الأسئلة الشائعة", icon: FileQuestion, href: "/faq" },
//   { name: "آراء العملاء", icon: Star, href: "/reviews" },
//   { name: "المدونة", icon: BookOpen, href: "/blog" },
// ]

// const userManagementItems = [
//   { name: "الأدوار", href: "/roles" },
//   { name: "المستخدمين", href: "/users" },
//   { name: "المشرفين", href: "/users/list" },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { isOpen, toggle } = useSidebar()
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false)

//   const isUserManagementActive = userManagementItems.some(item => pathname === item.href)


//   const handleLogout = async () => {
//     const token = localStorage.getItem('token')
  
//     if (!token) {
//       console.warn("لا يوجد توكن لتسجيل الخروج!")
//       return
//     }
  
//     try {
//       const response = await fetch("http://localhost:8080/auth/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token }),
//       })
  
//       const result = await response.json()
//       console.log("نتيجة الطلب:", result)
  
//       if (response.ok) {
//         // Remove token from both localStorage and cookies
//         localStorage.removeItem("token")
//         document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
//         router.push("/login")
//       } else {
//         console.error("فشل تسجيل الخروج:", result.message)
//       }
//     } catch (error) {
//       console.error("خطأ في الاتصال بالخادم:", error)
//     }
//   }
  
  

//   return (
//     <>
//       <aside className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed top-0 right-0 transition-all duration-300 ease-in-out z-50 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       }`}>
//         <Button variant="ghost" size="icon" onClick={toggle} className="absolute left-4 top-4 text-white">
//           <X className="h-6 w-6" />
//         </Button>
//         <nav className="mt-8">
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   href={item.href}
//                   className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
//                     pathname === item.href ? "bg-gray-700" : ""
//                   }`}
//                 >
//                   <item.icon className="h-5 w-5 ml-2" />
//                   <span>{item.name}</span>
//                 </Link>
//               </li>
//             ))}

//             {/* User Management Dropdown */}
//             <li>
//               <button
//                 onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
//                 className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-700 ${
//                   isUserManagementActive ? "bg-gray-700" : ""
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <Users className="h-5 w-5 ml-2" />
//                   <span>إدارة المستخدمين</span>
//                 </div>
//                 <ChevronDown className={`h-4 w-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
//               </button>
              
//               {isUserDropdownOpen && (
//                 <ul className="mt-2 space-y-1 pr-6">
//                   {userManagementItems.map((item) => (
//                     <li key={item.name}>
//                       <Link
//                         href={item.href}
//                         className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
//                           pathname === item.href ? "bg-gray-700" : ""
//                         }`}
//                       >
//                         <span>{item.name}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           </ul>
//         </nav>
        
//         <div className="absolute bottom-4 w-full left-0 px-4">
//           <button 
//             onClick={() => setShowLogoutDialog(true)}
//             className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full p-2 rounded-lg hover:bg-gray-700"
//           >
//             <LogOut className="h-5 w-5 ml-2" />
//             <span>تسجيل الخروج</span>
//           </button>
//         </div>
//       </aside>

//       <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>تأكيد تسجيل الخروج</DialogTitle>
//             <DialogDescription>
//               هل أنت متأكد من رغبتك في تسجيل الخروج؟
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="gap-2">
//             <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
//               إلغاء
//             </Button>
//             <Button variant="destructive" onClick={handleLogout}>
//               تسجيل الخروج
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggle} />}
//     </>
//   )
// }
"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, Building, Users, FileQuestion, Star, BookOpen, LogOut, X, 
  ChevronDown, Settings, LayoutDashboard, UserPlus, Shield,
  Newspaper,
  Send,
  BookCheck,
  Type,
  TimerIcon
} from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { link } from "fs"

const menuItems = [
  { name: "لوحة التحكم", icon: LayoutDashboard, href: "/" },
  { name: "العقارات", icon: Building, href: "/category" },
  { name: "الأسئلة الشائعة", icon: FileQuestion, href: "/faq" },
  { name: "آراء العملاء", icon: Star, href: "/reviews" },
  { name: "المدونة", icon: BookOpen, href: "/blog" },
  { name: "المشتركين", icon: Newspaper, href: "/subscribers" },
  { name: "المهتمين بالعقار", icon: Send, href: "/intersted" },
  { name: "الاستشارات المحجوزة", icon: TimerIcon , href: "/consultation" },
]

const userManagementItems = [
  { name: "الأدوار", icon: Shield, href: "/roles" },
  { name: "اضافة مستخدم", icon: Users, href: "/users" },
  // { name: "المشرفين", icon: UserPlus, href: "/users/list" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, toggle } = useSidebar()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const isUserManagementActive = userManagementItems.some(item => pathname === item.href)

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      })
      console.log(token);
      

      if (response.ok) {
        localStorage.removeItem("token")
        document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/login")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <>
      <aside 
        className={`
          fixed top-0 right-0 h-full w-64
          bg-gradient-to-b from-gray-800 to-gray-900
          text-gray-100 shadow-xl
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggle}
              className="absolute left-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${pathname === item.href 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}

              <li className="mt-4">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${isUserManagementActive 
                      ? "bg-gray-700 text-white" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>إدارة المستخدمين</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <ul className="mt-1 mr-4 space-y-1">
                    {userManagementItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            flex items-center gap-3 px-4 py-2 rounded-lg
                            transition-colors duration-200
                            ${pathname === item.href 
                              ? "bg-gray-700 text-white" 
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                          `}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                text-red-400 hover:bg-gray-700 hover:text-red-300
                transition-colors duration-200
              "
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد تسجيل الخروج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" 
          onClick={toggle}
        />
      )}
    </>
  )
}
