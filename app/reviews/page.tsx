"use client";


import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { Edit, Trash2, Star } from "lucide-react";
import { useRouter } from 'next/navigation'
// Define the type for a review
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

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8080/review/");
      const data = await response.json();
      //  console.log("API Response:", data); // Debugging line
 
      if (data.message === "Done") {
        const reviewData = Array.isArray(data.reviews) ? data.reviews : [data.review];
        // console.log(reviewData);
        
        setReviews(reviewData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };


  
  useEffect(() => {
          fetchReviews();
        }, []);

        // Handle delete button click
              const router = useRouter();

              const handleDelete = (id: string) => {
                setReviewToDelete(id);
                setDeleteDialogOpen(true);
              };

              // Handle edit button click
              const handleEdit = (id: string) => {
                router.push(`/reviews/edit/${id}`);
              };

  // Confirm delete (API call should be added here)
  const confirmDelete = () => {
    if (reviewToDelete) {
      console.log("Deleting review:", reviewToDelete);
      // TODO: Make an API call to delete the review from the backend
    }
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

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
                    <img
                      src={review.Image.secure_url || "/placeholder.svg"}
                      alt={review.name}
                      className="w-10 h-10 rounded-full"
                    />
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
