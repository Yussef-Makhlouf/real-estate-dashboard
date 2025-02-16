"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { 
  MapPin, 
  Home, 
  Bath, 
  Bed, 
  Car, 
  Camera, 
  Shield, 
   
} from 'lucide-react'
import { motion } from "framer-motion"

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
        const response = await axios.get(`https://tasis-al-bina.onrender.com/unit/getunit/${unitId}`)
        setUnit(response.data.returnedData.unit)
      } catch (err) {
        setError("فشل في جلب بيانات الوحدة")
      } finally {
        setLoading(false)
      }
    }

    fetchUnitDetails()
  }, [unitId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-secondary animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>
  if (!unit) return <div className="text-center py-8">لم يتم العثور على الوحدة</div>
  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            {/* Image Gallery with Animation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {unit?.images.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={image.secure_url}
                    alt={unit.title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
              ))}
            </div>

            {/* Main Details */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b pb-6"
              >
                <h1 className="text-3xl font-bold mb-4">{unit?.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{unit?.description}</p>
              </motion.div>

              {/* Property Details Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                <DetailItem icon={<Home />} label="النوع" value={unit?.type} />
                <DetailItem icon={<MapPin />} label="المساحة" value={`${unit?.area} م²`} />
                <DetailItem icon={<Bed />} label="الغرف" value={unit?.rooms} />
                <DetailItem icon={<Bath />} label="الحمامات" value={unit?.bathrooms} />
                <DetailItem icon={<Car />} label="المواقف" value={unit?.parking} />
                <DetailItem icon={<Camera />} label="الكاميرات" value={unit?.cameras} />
                <DetailItem icon={<Shield />} label="الحراسة" value={unit?.guard} />
                <DetailItem icon={<Bed />} label="المصاعد" value={unit?.elevators} />
              </motion.div>

              {/* Nearby Places */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">الأماكن القريبة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unit?.nearbyPlaces.map((place) => (
                    <div 
                      key={place._id} 
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{place.place}</span>
                      <span className="text-gray-600">{place.timeInMinutes} دقائق</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary text-white rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">السعر</h3>
                <p className="text-3xl font-bold">{unit?.price.toLocaleString()} ريال</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div className="text-gray-600">{label}</div>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}