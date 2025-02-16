interface BlogResponse {
    message: string
    returnData: {
      count: number
      blogs: Blog[]
    }
  }
  
  interface Blog {
    _id: string
    title: string
    createdAt: string
    Image: {
      secure_url: string
      public_id: string
    }
  }
  export type {  BlogResponse ,Blog}
  