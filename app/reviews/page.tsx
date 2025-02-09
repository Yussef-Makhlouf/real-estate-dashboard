// "use client"

// import { useState } from "react"
// import { Header } from "@/components/Header"
// import { Sidebar } from "@/components/Sidebar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ConfirmDialog } from "@/components/ui/confirm-dialog"
// import Link from "next/link"
// import { Edit, Trash2, Star } from "lucide-react"

// const reviews = [
//   {
//     id: 1,
//     nameAr: "أحمد محمد",
//     nameEn: "Ahmed Mohammed",
//     rating: 5,
//     commentAr: "خدمة ممتازة وسريعة في إيجاد العقار المناسب.",
//     commentEn: "Excellent and fast service in finding the right property.",
//     image: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: 2,
//     nameAr: "سارة علي",
//     nameEn: "Sarah Ali",
//     rating: 4,
//     commentAr: "تجربة جيدة جدًا، ولكن كان هناك بعض التأخير في الرد.",
//     commentEn: "Very good experience, but there was some delay in response.",
//     image: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: 3,
//     nameAr: "خالد عمر",
//     nameEn: "Khalid Omar",
//     rating: 5,
//     commentAr: "أفضل وكالة عقارية تعاملت معها. شكرًا لكم!",
//     commentEn: "The best real estate agency I have dealt with. Thank you!",
//     image: "/placeholder.svg?height=100&width=100",
//   },
// ]

// export default function Reviews() {
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)

//   const handleDelete = (id: number) => {
//     setReviewToDelete(id)
//     setDeleteDialogOpen(true)
//   }

//   const confirmDelete = () => {
//     if (reviewToDelete) {
//       // Here you would typically make an API call to delete the review
//       console.log("Deleting review:", reviewToDelete)
//     }
//     setDeleteDialogOpen(false)
//     setReviewToDelete(null)
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <Sidebar />
//       <main className="pt-16 px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">آراء العملاء</h2>
//           <Link href="/reviews/add">
//             <Button>إضافة رأي جديد</Button>
//           </Link>
//         </div>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {reviews.map((review) => (
//             <Card key={review.id}>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                     <img src={review.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full" />
//                     <div>
//                       <div>{review.nameAr}</div>
//                       <div className="text-sm text-gray-500">{review.nameEn}</div>
//                     </div>
//                   </div>
//                   <div className="flex">
//                     {Array.from({ length: review.rating }).map((_, index) => (
//                       <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-right mb-2">{review.commentAr}</p>
//                 <p className="text-left text-gray-500 mb-4">{review.commentEn}</p>
//                 <div className="flex justify-end space-x-2 rtl:space-x-reverse">
//                   <Link href={`/reviews/edit/${review.id}`}>
//                     <Button variant="outline" size="sm">
//                       <Edit className="h-4 w-4 ml-2" />
//                       تعديل
//                     </Button>
//                   </Link>
//                   <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
//                     <Trash2 className="h-4 w-4 ml-2" />
//                     حذف
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <ConfirmDialog
//           open={deleteDialogOpen}
//           onOpenChange={setDeleteDialogOpen}
//           onConfirm={confirmDelete}
//           title="تأكيد الحذف"
//           description="هل أنت متأكد من حذف هذا الرأي؟ لا يمكن التراجع عن هذا الإجراء."
//         />
//       </main>
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { Edit, Trash2, Star } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  country: string;
  rate: number;
  description: string;
  Image: {
    secure_url: string;
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/review")
      .then(response => setReviews(response.data.reviews))
      .catch(error => setError("فشل في جلب البيانات"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        await axios.delete(`http://localhost:8080/review/delete/${reviewToDelete}`);
        setReviews(reviews.filter(review => review._id !== reviewToDelete)); // إزالة العنصر المحذوف
      } catch (error) {
        console.error("خطأ في حذف المراجعة:", error);
      }
    }
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };
  

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">آراء العملاء</h2>
          <Link href="/reviews/add">
            <Button>إضافة رأي جديد</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <img src={review.Image?.secure_url} alt={review.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div>{review.name}</div>
                      <div className="text-sm text-gray-500">{review.country}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rate }).map((_, index) => (
                      <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right mb-2">{review.description}</p>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Link href={`/reviews/edit/${review._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(review._id)}>
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا الرأي؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </main>
    </div>
  );
}
