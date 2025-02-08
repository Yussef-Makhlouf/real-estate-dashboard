import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // هنا يمكنك إضافة منطق التحقق من المستخدم
    // مثال للتوضيح:
    if (body.email === "admin@example.com" && body.password === "123456") {
      const token = "example-auth-token-123"
      return NextResponse.json({ token }, { status: 200 })
    }

    return NextResponse.json(
      { error: "بيانات غير صحيحة" },
      { status: 401 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: "خطأ في الخادم" },
      { status: 500 }
    )
  }
}
