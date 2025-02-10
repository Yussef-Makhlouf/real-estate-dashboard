import * as z from "zod"

const saudiPhoneRegex = /^((?:\+?966)|0)5[0-9]{8}$/

export const userSchema = z.object({
  firstName: z.string()
    .min(2, "الاسم الأول يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأول طويل جداً"),
  middleName: z.string()
    .min(2, "الاسم الأوسط يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأوسط طويل جداً"),
  lastName: z.string()
    .min(2, "الاسم الأخير يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأخير طويل جداً"),
  email: z.string()
    .email("البريد الإلكتروني غير صالح"),
  phoneNumber: z.string()
    .regex(saudiPhoneRegex, "يجب إدخال رقم هاتف سعودي صالح"),
  role: z.enum(["Admin", "SuperAdmin"], {
    required_error: "يرجى اختيار نوع المستخدم",
  }),
  verificationCode: z.string(),
  password: z.string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز خاصة"),


})


export const userEditSchema = z.object({
  firstName: z.string()
    .min(2, "الاسم الأول يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأول طويل جداً"),
  middleName: z.string()
    .min(2, "الاسم الأوسط يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأوسط طويل جداً"),
  lastName: z.string()
    .min(2, "الاسم الأخير يجب أن يكون أكثر من حرفين")
    .max(50, "الاسم الأخير طويل جداً"),
  phoneNumber: z.string()
    .regex(saudiPhoneRegex, "يجب إدخال رقم هاتف سعودي صالح"),
});
