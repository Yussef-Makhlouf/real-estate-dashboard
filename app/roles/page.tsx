import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const roles = [
  { id: 1, name: "مدير", permissions: "كامل الصلاحيات" },
  { id: 2, name: "وكيل عقاري", permissions: "إدارة العقارات، التواصل مع العملاء" },
  { id: 3, name: "محاسب", permissions: "إدارة المدفوعات، التقارير المالية" },
  // يمكنك إضافة المزيد من الأدوار هنا
]

export default function Roles() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">إدارة الأدوار</h2>
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الدور</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.permissions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

