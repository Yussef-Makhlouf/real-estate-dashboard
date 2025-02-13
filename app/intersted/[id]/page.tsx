'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type InterestedUser = {
  fullName: string;
  email: string;
  phone: string;
  categoryId: {
    title: string;
    location: string;
    Image: {
      secure_url: string;
    };
  };
  unitId: {
    title: string;
    type: string;
    price: number;
    status: string;
  };
};

export default function InterestedUserPage() {
  const { id } = useParams()
  const [userData, setUserData] = useState<InterestedUser | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/interested/${id}`)
        const data = await response.json()
        setUserData(data.interested[0])
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [id])

  if (!userData) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Details</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {userData.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{userData.fullName}</h2>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-gray-500">Phone: {userData.phone}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Project Details</h3>
              <div className="grid gap-3">
                <p><span className="font-medium">Project Title:</span> {userData.categoryId.title}</p>
                <p><span className="font-medium">Location:</span> {userData.categoryId.location}</p>
                <img 
                  src={userData.categoryId.Image.secure_url} 
                  alt="Project"
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Unit Details</h3>
              <div className="grid gap-3">
                <p><span className="font-medium">Unit Title:</span> {userData.unitId.title}</p>
                <p><span className="font-medium">Type:</span> {userData.unitId.type}</p>
                <p><span className="font-medium">Price:</span> ${userData.unitId.price}</p>
                <p><span className="font-medium">Status:</span> {userData.unitId.status}</p>
                <div className="grid grid-cols-2 gap-4">
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
