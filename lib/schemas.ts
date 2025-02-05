// import * as z from "zod"
// const validateLanguage = (text: string, lang: 'ar' | 'en') => {
//   const arabicRegex = /^[\u0600-\u06FF\s]+$/
//   const englishRegex = /^[A-Za-z\s]+$/
//   return lang === 'ar' ? arabicRegex.test(text) : englishRegex.test(text)
// }

// export const blogPostSchema = z.discriminatedUnion('lang', [
//   z.object({
//     lang: z.literal('ar'),
//     title: z.string()
//       .min(1, "العنوان مطلوب")
//       .refine(text => validateLanguage(text, 'ar'), {
//         message: "يجب أن يحتوي النص على حروف عربية فقط"
//       }),
//     description: z.string()
//       .min(1, "المحتوى مطلوب")
//       .refine(text => validateLanguage(text, 'ar'), {
//         message: "يجب أن يحتوي النص على حروف عربية فقط"
//       }),
//     Keywords: z.array(z.string()).optional(),
//     image: z.union([z.string().url(), z.instanceof(File)]).optional(),
//   }),
//   z.object({
//     lang: z.literal('en'),
//     title: z.string()
//       .min(1, "Title is required")
//       .refine(text => validateLanguage(text, 'en'), {
//         message: "Text must contain only English characters"
//       }),
//     description: z.string()
//       .min(1, "Content is required")
//       .refine(text => validateLanguage(text, 'en'), {
//         message: "Text must contain only English characters"
//       }),
//     Keywords: z.array(z.string()).optional(),
//     image: z.union([z.string().url(), z.instanceof(File)]).optional(),
//   })
// ]);


// export const faqSchema = z.object({
//   question: z.string()
//     .min(1, "السؤال مطلوب")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن يحتوي السؤال على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Question must contain Arabic text only" }
//     ),
//   answer: z.string()
//     .min(1, "الإجابة مطلوبة")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن تحتوي الإجابة على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Answer must contain Arabic text only" }
//     ),
//   keywords: z.array(z.string()),
//   lang: z.string().min(1),
// });

// export const reviewSchema = z.object({
//   name: z.string()
//     .min(1, "الاسم مطلوب")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن يحتوي الاسم على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Name must contain Arabic text only" }
//     ),
//   comment: z.string()
//     .min(1, "التعليق مطلوب")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن يحتوي التعليق على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Comment must contain Arabic text only" }
//     ),
//   rating: z.number().min(1).max(5),
//   image: z.any().optional(),
//   lang: z.string().min(1),
// });

// export const propertySchema = z.object({
//   title: z.string()
//     .min(1, "العنوان مطلوب")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن يحتوي العنوان على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Title must contain Arabic text only" }
//     ),
//   description: z.string()
//     .min(1, "الوصف مطلوب")
//     .refine(
//       (text) => validateLanguage(text, 'ar'),
//       { message: "يجب أن يحتوي الوصف على حروف عربية فقط" }
//     )
//     .refine(
//       (text) => !validateLanguage(text, 'en'),
//       { message: "Description must contain Arabic text only" }
//     ),
//   price: z.number().min(0, "السعر يجب أن يكون أكبر من صفر"),
//   location: z.string().min(1, "الموقع مطلوب"),
//   type: z.string().min(1, "نوع العقار مطلوب"),
//   images: z.array(z.any()),
//   keywords: z.array(z.string()),
//   lang: z.string().min(1),
// });










import * as z from "zod"

const validateLanguage = (text: string, lang: 'ar' | 'en') => {
  const arabicRegex = /^[\u0600-\u06FF\s]+$/
  const englishRegex = /^[A-Za-z\s]+$/
  return lang === 'ar' ? arabicRegex.test(text) : englishRegex.test(text)
}

export const blogPostSchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    title: z.string()
      .min(1, "العنوان مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي النص على حروف عربية فقط"
      }),
    description: z.string()
      .min(1, "المحتوى مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي النص على حروف عربية فقط"
      }),
    Keywords: z.array(z.string()).optional(),
    image: z.union([z.string().url(), z.instanceof(File)]).optional(),
  }),
  z.object({
    lang: z.literal('en'),
    title: z.string()
      .min(1, "Title is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Text must contain only English characters"
      }),
    description: z.string()
      .min(1, "Content is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Text must contain only English characters"
      }),
    Keywords: z.array(z.string()).optional(),
    image: z.union([z.string().url(), z.instanceof(File)]).optional(),
  })
]);

export const faqSchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    question: z.string()
      .min(1, "السؤال مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي السؤال على حروف عربية فقط"
      }),
    answer: z.string()
      .min(1, "الإجابة مطلوبة")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن تحتوي الإجابة على حروف عربية فقط"
      }),
    keywords: z.array(z.string()),
  }),
  z.object({
    lang: z.literal('en'),
    question: z.string()
      .min(1, "Question is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Question must contain only English characters"
      }),
    answer: z.string()
      .min(1, "Answer is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Answer must contain only English characters"
      }),
    keywords: z.array(z.string()),
  })
]);

export const reviewSchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    name: z.string()
      .min(1, "الاسم مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي الاسم على حروف عربية فقط"
      }),
    comment: z.string()
      .min(1, "التعليق مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي التعليق على حروف عربية فقط"
      }),
    rating: z.number().min(1).max(5),
    image: z.any().optional(),
  }),
  z.object({
    lang: z.literal('en'),
    name: z.string()
      .min(1, "Name is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Name must contain only English characters"
      }),
    comment: z.string()
      .min(1, "Comment is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Comment must contain only English characters"
      }),
    rating: z.number().min(1).max(5),
    image: z.any().optional(),
  })
]);

export const propertySchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    title: z.string()
      .min(1, "العنوان مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي العنوان على حروف عربية فقط"
      }),
    description: z.string()
      .min(1, "الوصف مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي الوصف على حروف عربية فقط"
      }),
    price: z.number().min(0, "السعر يجب أن يكون أكبر من صفر"),
    location: z.string().min(1, "الموقع مطلوب"),
    type: z.string().min(1, "نوع العقار مطلوب"),
    images: z.array(z.any()),
    keywords: z.array(z.string()),
  }),
  z.object({
    lang: z.literal('en'),
    title: z.string()
      .min(1, "Title is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Title must contain only English characters"
      }),
    description: z.string()
      .min(1, "Description is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Description must contain only English characters"
      }),
    price: z.number().min(0, "Price must be greater than zero"),
    location: z.string().min(1, "Location is required"),
    type: z.string().min(1, "Property type is required"),
    images: z.array(z.any()),
    keywords: z.array(z.string()),
  })
]);
