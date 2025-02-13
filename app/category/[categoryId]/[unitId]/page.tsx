"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation"

interface Unit {
  _id: string
  title: string
  type: string
  area: number
  price: number
  description: string
  rooms: number
  elevators: number
  images: Array<{ secure_url: string; _id: string }>
  bathrooms: number
  parking: number
  guard: number
  livingrooms: number
  waterTank: number
  maidRoom: number
  status: string
  cameras: number
  nearbyPlaces: Array<{ place: string; timeInMinutes: number; _id: string }>
  location: string
  lang: string
  floor: number
  coordinates: { latitude: number; longitude: number }
}

export default function UnitDetails() {
  const params = useParams()
  const unitId = params.unitId as string
  
  const [unit, setUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/unit/getunit/${unitId}`)
        setUnit(response.data.unit)
      } catch (err) {
        setError("فشل في جلب بيانات الوحدة")
      } finally {
        setLoading(false)
      }
    }

    fetchUnitDetails()
  }, [unitId])

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>
  if (!unit) return <div className="text-center py-8">لم يتم العثور على الوحدة</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {unit.images.map((image) => (
                <img
                  key={image._id}
                  src={image.secure_url}
                  alt={unit.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Main Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{unit.title}</h1>
                <p className="text-gray-600">{unit.description}</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem label="النوع" value={unit.type} />
                <DetailItem label="المساحة" value={`${unit.area} م²`} />
                <DetailItem label="السعر" value={`${unit.price.toLocaleString()} ريال`} />
                <DetailItem label="الغرف" value={unit.rooms} />
                <DetailItem label="الحمامات" value={unit.bathrooms} />
                <DetailItem label="غرف المعيشة" value={unit.livingrooms} />
                <DetailItem label="المصاعد" value={unit.elevators} />
                <DetailItem label="المواقف" value={unit.parking} />
                <DetailItem label="غرف الخدم" value={unit.maidRoom} />
                <DetailItem label="خزانات المياه" value={unit.waterTank} />
                <DetailItem label="الكاميرات" value={unit.cameras} />
                <DetailItem label="الحراسة" value={unit.guard} />
                <DetailItem label="الطابق" value={unit.floor} />
                <DetailItem label="الحالة" value={unit.status} />
              </div>

              {/* Nearby Places */}
              <div>
                <h2 className="text-xl font-semibold mb-3">الأماكن القريبة</h2>
                <div className="grid grid-cols-2 gap-4">
                  {unit.nearbyPlaces.map((place) => (
                    <div key={place._id} className="flex justify-between">
                      <span>{place.place}</span>
                      <span>{place.timeInMinutes} دقائق</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold mb-3">الموقع</h2>
                <p>{unit.location}</p>
                <div className="text-sm text-gray-500">
                  الإحداثيات: {unit.coordinates.latitude}, {unit.coordinates.longitude}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
