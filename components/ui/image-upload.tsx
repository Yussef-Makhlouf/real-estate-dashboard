// import { useState, useEffect } from "react"
// import { Button } from "./button"
// import { Upload, X, ImageIcon } from "lucide-react"
// import { toast } from "./use-toast"

// interface ImageUploadProps {
//   onImagesChange: (files: File[]) => void
//   language: "ar" | "en"
//   maxImages:number
//   existingImages: []
//   initialImages?: {
//     secure_url?: string
//     public_id?: string
//   } | string | null
// }

// export function ImageUpload({ onImagesChange, language, initialImages }: ImageUploadProps) {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null)
//   const [preview, setPreview] = useState<string | null>(null)
//   const [originalImage, setOriginalImage] = useState<string | null>(null)

//   useEffect(() => {
//     if (initialImages) {
//       const imageUrl = typeof initialImages === 'object' && initialImages.secure_url
//         ? initialImages.secure_url
//         : typeof initialImages === 'string'
//           ? initialImages
//           : null
//       setPreview(imageUrl)
//     }
//   }, [initialImages])

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           variant: "destructive",
//           title: language === "ar" ? "حجم الصورة كبير جداً" : "Image size too large",
//           description: language === "ar"
//             ? "يجب أن يكون حجم الصورة أقل من 5 ميجابايت"
//             : "Image must be less than 5MB"
//         })
//         return
//       }

//       setSelectedImage(file)
//       const newPreview = URL.createObjectURL(file)
//       setPreview(newPreview)
//       onImagesChange([file])
//     }
//   }

//   const removeImage = () => {
//     if (preview?.startsWith('blob:')) {
//       URL.revokeObjectURL(preview)
//     }
//     setSelectedImage(null)
//     setPreview(null)
//     onImagesChange([])
//   }

//   return (
//     <div className="space-y-4 w-full">
//           {originalImage && (
//         <div className="w-full bg-gray-50 p-4 rounded-lg">
//           <div className="max-w-lg mx-auto">
//             <h3 className="text-sm font-medium mb-2 text-gray-700">
//               {language === "ar" ? "الصورة الحالية:" : "Current Image:"}
//             </h3>
//             <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md">
//               <img
//                 src={originalImage}
//                 alt="Original"
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   const img = e.currentTarget
//                   img.src = '/placeholder-image.jpg'
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="flex items-center justify-center w-full">
//         <label className="relative cursor-pointer w-full">
//           <div className={`
//             w-full min-h-[300px] p-6 border-2 border-dashed rounded-xl
//             ${preview ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
//             transition-all duration-300 ease-in-out
//             flex items-center justify-center
//             group hover:shadow-lg
//           `}>
//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
            
//             {preview ? (
//               <div className="relative w-full max-w-lg mx-auto">
//                 <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
//                   <div className="relative w-full h-full">
//                     <img
//                       src={preview}
//                       alt="Preview"
//                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
//                       onError={() => setPreview('/placeholder-image.jpg')}
//                     />
//                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                 </div>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   className="absolute -top-3 -right-3 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     removeImage()
//                   }}
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>
//             ) : (
//               <div className="text-center p-8 transition-transform duration-300 group-hover:scale-105">
//                 <div className="relative">
//                   <Upload className="mx-auto h-16 w-16 text-gray-400 animate-bounce" />
//                   <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
//                 </div>
//                 <p className="mt-6 text-lg font-semibold text-gray-700">
//                   {language === "ar" ? "انقر لاختيار صورة" : "Click to select an image"}
//                 </p>
//                 <p className="mt-2 text-sm text-gray-500">
//                   {language === "ar"
//                     ? "PNG, JPG, GIF حتى 5 ميجابايت"
//                     : "PNG, JPG, GIF up to 5MB"}
//                 </p>
//                 {initialImages && (

//                   <p className="mt-4 text-xs text-primary">
//                     {language === "ar" ? "اضغط لتغيير الصورة" : "Click to change image"}

//                   </p>
//                 )}
//               </div>

//             )}
//           </div>
//         </label>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from "react"
import { Button } from "./button"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "./use-toast"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  language: "ar" | "en"
  maxImages: number

  existingImages: string[]
  initialImages?: {
    secure_url?: string
    public_id?: string
  }[] | string[] | null
}

export function ImageUpload({ onImagesChange, language, maxImages, initialImages }: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    if (initialImages) {
      const imageUrls = initialImages.map(img => 
        typeof img === 'object' && img.secure_url ? img.secure_url : 
        typeof img === 'string' ? img : null
      ).filter(Boolean) as string[]
      
      setPreviews(imageUrls)
    }
  }, [initialImages])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length + previews.length > maxImages) {
      toast({
        variant: "destructive",
        title: language === "ar" 
          ? `الحد الأقصى للصور هو ${maxImages}`
          : `Maximum ${maxImages} images allowed`,
      })
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "حجم الصورة كبير جداً" : "Image size too large",
          description: language === "ar"
            ? "يجب أن يكون حجم الصورة أقل من 5 ميجابايت"
            : "Image must be less than 5MB"
        })
        return false
      }
      return true
    })

    setSelectedImages(prev => [...prev, ...validFiles])
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    onImagesChange([...selectedImages, ...validFiles])
  }

  const removeImage = (index: number) => {
    if (previews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previews[index])
    }
    
    const newSelectedImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    setSelectedImages(newSelectedImages)
    setPreviews(newPreviews)
    onImagesChange(newSelectedImages)
  }

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const img = e.currentTarget
                  img.src = '/placeholder-image.jpg'
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {previews.length < maxImages && (
          <label className="cursor-pointer">
            <div className={`
              aspect-square rounded-lg border-2 border-dashed
              ${previews.length > 0 ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
              transition-all duration-300 ease-in-out
              flex flex-col items-center justify-center
              group hover:shadow-lg
            `}>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              
              <div className="text-center p-4 transition-transform duration-300 group-hover:scale-105">
                <Upload className="mx-auto h-10 w-10 text-gray-400 animate-bounce" />
                <p className="mt-4 text-sm font-medium text-gray-700">
                  {language === "ar" ? "انقر لإضافة صور" : "Click to add images"}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {language === "ar"
                    ? `${maxImages - previews.length} صور متبقية`
                    : `${maxImages - previews.length} images remaining`}
                </p>
              </div>
            </div>
          </label>
        )}
      </div>
    </div>
  )
}
