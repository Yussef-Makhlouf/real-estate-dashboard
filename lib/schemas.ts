import * as z from "zod"

export const blogPostSchema = z.object({
  titleAr: z.string().min(1, "العنوان بالعربية مطلوب"),
  titleEn: z.string().min(1, "العنوان بالإنجليزية مطلوب"),
  contentAr: z.string().min(1, "المحتوى بالعربية مطلوب"),
  contentEn: z.string().min(1, "المحتوى بالإنجليزية مطلوب"),
  keywords: z.array(z.string()),
  image: z.any().optional(),
})

export const faqSchema = z.object({
  questionAr: z.string().min(1, "السؤال بالعربية مطلوب"),
  questionEn: z.string().min(1, "السؤال بالإنجليزية مطلوب"),
  answerAr: z.string().min(1, "الإجابة بالعربية مطلوبة"),
  answerEn: z.string().min(1, "الإجابة بالإنجليزية مطلوبة"),
  keywords: z.array(z.string()),
  image: z.any().optional(),
})

export const reviewSchema = z.object({
  nameAr: z.string().min(1, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
  commentAr: z.string().min(1, "التعليق بالعربية مطلوب"),
  commentEn: z.string().min(1, "التعليق بالإنجليزية مطلوب"),
  rating: z.number().min(1).max(5),
  image: z.any().optional(),
})

export const propertySchema = z.object({
  titleAr: z.string().min(1, "العنوان بالعربية مطلوب"),
  titleEn: z.string().min(1, "العنوان بالإنجليزية مطلوب"),
  descriptionAr: z.string().min(1, "الوصف بالعربية مطلوب"),
  descriptionEn: z.string().min(1, "الوصف بالإنجليزية مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون أكبر من صفر"),
  location: z.string().min(1, "الموقع مطلوب"),
  type: z.string().min(1, "نوع العقار مطلوب"),
  images: z.array(z.any()),
  keywords: z.array(z.string()),
})

