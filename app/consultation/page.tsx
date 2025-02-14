'use client'

import { FaVideo, FaPhone, FaComments, FaVideoSlash } from 'react-icons/fa'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
interface Consultation{
    _id:string,
type:string
 phone:number
email:string
selectedDay:string
}

const ConsultationPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])

  useEffect(() => {
    const fetchConsultations = async () => {
      const response = await fetch('http://localhost:8080/consultation/')
      const data = await response.json()
      setConsultations(data)
    }
    fetchConsultations()
  }, [])

  const getIcon = (type: string) => {
    switch(type) {
      case 'google-meet':
        return <FaVideo className="h-8 w-8" />
      case 'phone-call':
        return <FaPhone className="h-8 w-8" />
      case 'chat':
        return <FaComments className="h-8 w-8" />
      case 'zoom':
        return <FaVideoSlash className="h-8 w-8" />
      default:
        return null
    }
  }

  const getCardColor = (type: string) => {
    switch(type) {
      case 'google_meet':
        return 'bg-blue-100'
      case 'phone_call':
        return 'bg-green-100'
      case 'whatsapp':
        return 'bg-yellow-100'
      case 'zoom':
        return 'bg-purple-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {consultations.map((consultation) => (
        <Card 
          key={consultation._id}
          className={`p-6 ${getCardColor(consultation.type)} rounded-lg shadow-md`}
        >
          <div className="flex flex-col items-center gap-4">
            {getIcon(consultation.type)}
            <h3 className="font-bold text-lg capitalize">{consultation.type}</h3>
            <p className="capitalize">Day: {consultation.selectedDay}</p>
            <p>Phone: {consultation.phone}</p>
            <p>Email: {consultation.email}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ConsultationPage
