"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import Link from "next/link"
import { Edit, Trash2, Home, MapPin, DollarSign } from "lucide-react"

const properties = [
  {
    id: 1,
    titleAr: "فيلا فاخرة مع حمام سباحة",
    titleEn: "Luxury Villa with Swimming Pool",
    type: "فيلا",
    location: "الرياض",
    price: 2500000,
    image: "/placeholder.svg?height=200&width=300",
  },
 
]

export default function Properties() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setPropertyToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (propertyToDelete) {
      // Here you would typically make an API call to delete the property
      console.log("Deleting property:", propertyToDelete)
    }
    setDeleteDialogOpen(false)
    setPropertyToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">العقارات</h2>
          <Link href="/properties/add">
            <Button>إضافة عقار جديد</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.titleAr}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col space-y-1">
                    <span className="text-lg">{property.titleAr}</span>
                    <span className="text-sm text-gray-500">{property.titleEn}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    <span>{property.type}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{property.price.toLocaleString()} ريال</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Link href={`/properties/edit/${property.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(property.id)}>
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
    </div>
  )
}

