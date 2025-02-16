'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, PhoneCall, Video, VideoIcon,
  Calendar, Mail, Search, Trash2, CheckCircle, XCircle,
  Clock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Consultation {
  _id: string
  type: string
  phone: number
  email: string
  selectedDay: string
  status: 'قيد الانتظار' | 'مكتملة' | 'ملغية'
}

const ConsultationPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchConsultations = async () => {
    try {
      const response = await fetch('http://localhost:8080/consultation/')
      const data = await response.json()
      console.log(data);
      
      setConsultations(data.map((item: Consultation) => ({
        ...item,
        status: item.status || 'pending'
      })))
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchConsultations()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/consultation/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setConsultations(prev => prev.filter(item => item._id !== id))
        toast.success('تم حذف الاستشارة بنجاح')
      } else {
        toast.error('فشل في حذف الاستشارة')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف')
    }
  }
  const handleMarkAsCompleted = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8080/consultation/markAsCompleted/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update consultation status');
        }

        const updatedConsultation = await response.json();
        setConsultations(prev => prev.map(item => 
            item._id === id ? { ...item, status: 'مكتملة' } : item
        ));
        toast.success('تم تغيير الحالة إلى مكتمل');
    } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء تحديث الحالة');
    }
};

const handleMarkAsCanceled = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8080/consultation/markAsCanceled/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update consultation status');
        }

        const updatedConsultation = await response.json();
        setConsultations(prev => prev.map(item => 
            item._id === id ? { ...item, status: 'ملغية' } : item
        ));
        toast.success('تم تغيير الحالة إلى ملغي');
    } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء تحديث الحالة');
    }
};

  const getIcon = (type: string) => {
    const iconProps = "h-8 w-8"
    const iconStyles = {
      'google_meet': 'bg-blue-100 text-blue-600',
      'phone_call': 'bg-green-100 text-green-600',
      'whatsapp': 'bg-yellow-100 text-yellow-600',
      'zoom': 'bg-purple-100 text-purple-600'
    }[type] || 'bg-gray-100 text-gray-600'

    const icons = {
      'google_meet': Video,
      'phone_call': PhoneCall,
      'whatsapp': MessageCircle,
      'zoom': VideoIcon
    }

    const IconComponent = icons[type as keyof typeof icons]
    return IconComponent ? <IconComponent className={`${iconProps} ${iconStyles}`} /> : null
  }

  const getStatusBadge = (status: string) => {
    const badgeConfig = {
      'قيد الانتظار': {
        icon: <Clock className="h-4 w-4" />,
        class: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        text: 'قيد الانتظار'
      },
      'مكتملة': {
        icon: <CheckCircle className="h-4 w-4" />,
        class: 'bg-green-100 text-green-800 border-green-300',
        text: 'مكتملة'
      },
      'ملغية': {
        icon: <XCircle className="h-4 w-4" />,
        class: 'bg-red-100 text-red-800 border-red-300',
        text: 'ملغية'
      }
    }
  
    const badge = badgeConfig[status as keyof typeof badgeConfig] || badgeConfig['قيد الانتظار']
  
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.class}`}>
        {badge.icon}
        {badge.text}
      </div>
    )
  }

  const ActionButtons = ({ consultation }: { consultation: Consultation }) => {
    if (consultation.status === 'قيد الانتظار') {
      return (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleMarkAsCompleted(consultation._id)}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            إكمال
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleMarkAsCanceled(consultation._id)}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            إلغاء
          </Button>
        </div>
      )
    }
  
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(consultation._id)}
        className="w-full mt-4 flex items-center justify-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        حذف
      </Button>
    )
  }

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = (
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesType = typeFilter === 'all' || consultation.type === typeFilter
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })
  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">لوحة الاستشارات</h1>
              <div className="flex gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {consultations.filter(c => c.status === 'قيد الانتظار').length} قيد الانتظار
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {consultations.filter(c => c.status === 'مكتملة').length} مكتملة
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="بحث في الاستشارات..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  className="p-2 rounded-lg border border-gray-200 bg-white"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="google_meet">Google Meet</option>
                  <option value="phone_call">مكالمة هاتفية</option>
                  <option value="whatsapp">واتساب</option>
                  <option value="zoom">Zoom</option>
                </select>

                <select
                  className="p-2 rounded-lg border border-gray-200 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="completed">مكتملة</option>
                  <option value="cancelled">ملغية</option>
                </select>
              </div>
            </div>
          </div>

          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredConsultations.map((consultation, index) => (
                <motion.div
                  key={consultation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-full bg-gray-50 shadow-inner">
                          {getIcon(consultation.type)}
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold text-xl text-gray-800">
                          {consultation.type === 'google_meet' ? 'Google Meet' :
                           consultation.type === 'phone_call' ? 'مكالمة هاتفية' :
                           consultation.type === 'whatsapp' ? 'واتساب' : 'Zoom'}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span>{consultation.selectedDay}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <PhoneCall className="h-5 w-5 text-primary" />
                            <span>{consultation.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="h-5 w-5 text-primary" />
                            <span className="truncate">{consultation.email}</span>
                          </div>
                        </div>

                        <ActionButtons consultation={consultation} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default ConsultationPage