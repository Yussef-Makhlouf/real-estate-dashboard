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
  const cleanedText = stripHtml(text);
  const arabicRegex = /^[\u0600-\u06FF\s،؛؟٠-٩<>\/]+$/;
  const englishRegex = /^[A-Za-z\s.,!?0-9؟؛،<>\/]+$/;
  return lang === 'ar' ? arabicRegex.test(text) : englishRegex.test(text)
}

// // 
// const validateLanguage = (text: string, lang: 'ar' | 'en') => {
//   const arabicRegex = /^[\u0600-\u06FF\s0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
//   const englishRegex = /^[A-Za-z\s0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
//   return lang === 'ar' ? arabicRegex.test(text) : englishRegex.test(text);
// };

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, ''); // إزالة جميع علامات HTML
};

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
      .refine(text => validateLanguage(text,"ar"), { // سيتم تنظيفه تلقائيًا
        message: "يجب أن يحتوي التعليق على حروف عربية فقط (بدون تنسيق)"
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
      .refine(text => validateLanguage(stripHtml(text), 'en'), {
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
      .refine(text => validateLanguage(stripHtml(text), 'ar'), {
        message: "يجب أن تحتوي الإجابة على حروف عربية فقط"
      }),
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
  })
]);

// export const reviewSchema = z.discriminatedUnion('lang', [
//   z.object({
//     lang: z.literal('ar'),
//     name: z.string()
//       .min(1, "الاسم مطلوب")
//       .refine(text => validateLanguage(text, 'ar'), {
//         message: "يجب أن يحتوي الاسم على حروف عربية فقط"
//       }),
//     comment: z.string()
//       .min(1, "التعليق مطلوب")
//       .refine(text => validateLanguage(text, 'ar'), {
//         message: "يجب أن يحتوي التعليق على حروف عربية فقط"
//       }),
//     rating: z.number().min(1).max(5),
//     image: z.any().optional(),
//   }),
//   z.object({
//     lang: z.literal('en'),
//     name: z.string()
//       .min(1, "Name is required")
//       .refine(text => validateLanguage(text, 'en'), {
//         message: "Name must contain only English characters"
//       }),
//     comment: z.string()
//       .min(1, "Comment is required")
//       .refine(text => validateLanguage(text, 'en'), {
//         message: "Comment must contain only English characters"
//       }),
//     rating: z.number().min(1).max(5),
//     image: z.any().optional(),
//   })
// ]);

export const reviewSchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    name: z.string()
      .min(1, "الاسم مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي الاسم على حروف عربية فقط"
      }),
   
    country: z.string().min(1, "الدولة مطلوبة"),
    description: z.string()
      .min(1, "التعليق مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي التعليق على حروف عربية فقط"
      }),
    rate: z.number().min(1).max(5),
    image: z.object({
      secure_url: z.string().url("رابط الصورة غير صحيح"),
      public_id: z.string().min(1, "معرف الصورة مطلوب")
    }).optional(),
    // createdBy: z.string().min(1, "معرف المُنشئ مطلوب"),
    // customId: z.string().min(1, "معرف مخصص مطلوب"),
    // createdAt: z.string().datetime(),
    // updatedAt: z.string().datetime(),
  }),
  z.object({
    lang: z.literal('en'),
    name: z.string()
      .min(1, "Name is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Name must contain only English characters"
      }),
   
    country: z.string().min(1, "Country is required"),
    description: z.string()
      .min(1, "Comment is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Comment must contain only English characters"
      }),
    rate: z.number().min(1).max(5),
    image: z.object({
      secure_url: z.string().url("Invalid image URL"),
      public_id: z.string().min(1, "Public ID is required")
    }).optional(),
    // createdBy: z.string().min(1, "CreatedBy is required"),
    // customId: z.string().min(1, "Custom ID is required"),
    // createdAt: z.string().datetime(),
    // updatedAt: z.string().datetime(),
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


export const categorySchema = z.discriminatedUnion('lang', [
  z.object({
    lang: z.literal('ar'),
    title: z.string()
      .min(1, "العنوان مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي العنوان على حروف عربية فقط"
      }),
    area: z.number().min(0, "المساحة مطلوبة"),
    location: z.string()
      .min(1, "الموقع مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي الموقع على حروف عربية فقط"
      }),
    description: z.string()
      .min(1, "الوصف مطلوب")
      .refine(text => validateLanguage(text, 'ar'), {
        message: "يجب أن يحتوي الوصف على حروف عربية فقط"
      }),
    image: z.instanceof(File, { message: "الصورة مطلوبة" })
      .refine(file => file.size > 0, { message: "حجم الصورة غير صالح" })
      .refine(file => file.type.startsWith('image/'), { 
        message: "يجب أن يكون الملف صورة" 
      }),
      coordinates: z.object({
        latitude: z.number({
          required_error: "خط العرض مطلوب",
          invalid_type_error: "يجب أن يكون رقمًا"
        }),
        longitude: z.number({
          required_error: "خط الطول مطلوب",
          invalid_type_error: "يجب أن يكون رقمًا"
        })
      })
  }),
  z.object({
    lang: z.literal('en'),
    title: z.string()
      .min(1, "Title is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Title must contain only English characters"
      }),
    area: z.number().min(0, "Area is required"),
    location: z.string()
      .min(1, "Location is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Location must contain only English characters"
      }),
    description: z.string()
      .min(1, "Description is required")
      .refine(text => validateLanguage(text, 'en'), {
        message: "Description must contain only English characters"
      }),
    image: z.instanceof(File, { message: "Image is required" })
      .refine(file => file.size > 0, { message: "Invalid image size" })
      .refine(file => file.type.startsWith('image/'), { 
        message: "File must be an image" 
      }),
    coordinates: z.object({
      latitude: z.number().refine(val => val !== undefined, { message: "Latitude is required" }),
  longitude: z.number().refine(val => val !== undefined, { message: "Longitude is required" })
    }),
  })
]);
