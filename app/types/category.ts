interface CategoryResponse {
    message: string
    returnedData: {
      count: number
      categories: Category[]
    }
  }
  
  interface Category {
    _id: string
    title: string
    description: string
    location: string
    Image: {
      secure_url: string
      public_id: string
    }
  }
  

  export type { CategoryResponse, Category}
  