// "use client";


// import { useState, useEffect } from "react";
// import { Header } from "@/components/Header";
// import { Sidebar } from "@/components/Sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ConfirmDialog } from "@/components/ui/confirm-dialog";
// import Link from "next/link";
// import { Edit, Trash2, Star } from "lucide-react";
// import { useRouter } from 'next/navigation'
// import { toast } from "react-toastify";
// // Define the type for a review
// type Review = {
//   Image: {
//     secure_url: string;
//     public_id: string;
//   };
//   lang: string;
//   name: string;
//   country: string;
//   rate: number;
//   description: string;
//   createdBy: string;
//   customId: string;
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
// };

// export default function Reviews() {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

//   // Fetch reviews from API
//   const fetchReviews = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/review/");
//       const data = await response.json();
//       //  console.log("API Response:", data); // Debugging line

//       if (data.message === "Done") {
//         const reviewData = Array.isArray(data.reviews) ? data.reviews : [data.review];
//         // console.log(reviewData);

//         setReviews(reviewData);
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//   };



//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   // Handle delete button click
//   const router = useRouter();

//   const handleDelete = (id: string) => {
//     setReviewToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   // Handle edit button click
//   const handleEdit = (id: string) => {
//     router.push(`/reviews/edit/${id}`);
//   };

//   // Confirm delete (API call should be added here)
//   const confirmDelete = async () => {
//     if (reviewToDelete) {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`http://localhost:8080/review/delete/${reviewToDelete}`, {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         })
  
//         if (!response.ok) throw new Error("فشل في حذف الرأي")
  
//         // Success case
//         toast.success("تم حذف الرأي بنجاح")
//         fetchReviews() // Refresh the reviews list
//       } catch (error) {
//         toast.error("فشل في حذف الرأي")
//       }
//       setDeleteDialogOpen(false)
//       setReviewToDelete(null)
//     }
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
//             <Card key={review._id}>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                     <img
//                       src={review.Image.secure_url || "/placeholder.svg"}
//                       alt={review.name}
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <div>
//                       <div>{review.name}</div>
//                       <div className="text-sm text-gray-500">{review.country}</div>
//                     </div>
//                   </div>
//                   <div className="flex">
//                     {Array.from({ length: review.rate }).map((_, index) => (
//                       <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-right mb-2">{review.description}</p>
//                 <div className="flex justify-end space-x-2 rtl:space-x-reverse">
//                   <Link href={`/reviews/edit/${review._id}`}>
//                     <Button variant="outline" size="sm">
//                       <Edit className="h-4 w-4 ml-2" />
//                       تعديل
//                     </Button>
//                   </Link>
//                   <Button variant="destructive" size="sm" onClick={() => handleDelete(review._id)}>
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
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { Edit, Trash2, Star, Plus, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

type Review = {
  Image: {
    secure_url: string;
    public_id: string;
  };
  lang: string;
  name: string;
  country: string;
  rate: number;
  description: string;
  createdBy: string;
  customId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8080/review/");
      const data = await response.json();
      if (data.message === "Done") {
        const reviewData = Array.isArray(data.reviews) ? data.reviews : [data.review];
        setReviews(reviewData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (id: string) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/reviews/edit/${id}`);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/review/delete/${reviewToDelete}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("فشل في حذف الرأي");
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const filteredReviews = reviews.filter(review =>
    review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <Sidebar />
      <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-24 pr-0 lg:pr-64 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">آراء العملاء</h2>
                <p className="mt-1 text-gray-500">إدارة وعرض تقييمات وآراء العملاء</p>
              </div>
              <Link href="/reviews/add">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="h-5 w-5 ml-2" />
                  إضافة رأي جديد
                </Button>
              </Link>
            </div>
            <div className="mt-6 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث في الآراء..."
                className="pl-4 pr-10 h-11 w-full sm:w-96 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => (
              <Card key={review._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="relative">
                        <img
                          src={review.Image.secure_url || "/placeholder.svg"}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.country}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.rate
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="mb-4">
                    <p className="text-gray-600 text-right line-clamp-3">{review.description}</p>
                  </div>
                  <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-gray-50"
                      onClick={() => handleEdit(review._id)}
                    >
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-600"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">لا توجد آراء</h3>
              <p className="mt-2 text-gray-500">لم يتم العثور على أي آراء تطابق بحثك</p>
            </div>
          )}

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
            title="تأكيد الحذف"
            description="هل أنت متأكد من حذف هذا الرأي؟ لا يمكن التراجع عن هذا الإجراء."
          />
        </div>
      </main>
    </div>
  );
}
