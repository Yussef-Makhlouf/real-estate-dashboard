interface InterestedResponse {
    message: string
    returnedData: {
      intested: InterestedUser[]
      count: number
    }
  }
  
  interface InterestedUser {
    _id: string
    fullName: string
    phone: number
    email: string
    categoryId: string | null
    unitId: {
      _id: string
      title: string
    }
  }

  export type { InterestedResponse, InterestedUser }