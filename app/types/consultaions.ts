interface ConsultationResponse {
    message: string
    returnedData: {
      count: number
      consultes: Consultation[]
    }
  }
  
  interface Consultation {
    _id: string
    type: 'zoom' | 'google_meet' | 'whatsapp'
    selectedDay: string
    phone: string
  }

  export type { ConsultationResponse, Consultation }