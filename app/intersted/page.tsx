'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface InterestedUser {
  _id: string
  fullName: string
  phone: number
  email: string
  categoryId: {
    title: string
    Image: {
      secure_url: string
    }
    location: string
  }
  unitId: {
    title: string
    type: string
    price: number
    images: {
      secure_url: string
    }[]
    status: string
  }
  createdAt: string
}

export default function InterestedPage() {
  const router = useRouter()

  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/interested')
        const data = await response.json()
        setInterestedUsers(data.interested)
      } catch (error) {
        console.error('Error fetching interested users:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Interested Users</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interestedUsers.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{user.fullName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">Phone: {user.phone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Interested In:</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">مشروع:</span> {user.categoryId.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">الوحدة:</span> {user.unitId.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">السعر:</span> ${user.unitId.price}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">الحالة:</span> {user.unitId.status}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">الموقع:</span> {user.categoryId.location}
                  </p>
                </div>
              </div>
              <div className="mt-4">
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
