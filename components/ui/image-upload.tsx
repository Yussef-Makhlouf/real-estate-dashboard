import { useState, useEffect } from "react"
import { Button } from "./button"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "./use-toast"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  language: "ar" | "en"
  initialImages?: {
    secure_url?: string
    public_id?: string
  } | string | null
}

export function ImageUpload({ onImagesChange, language, initialImages }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  useEffect(() => {
    if (initialImages) {
      const imageUrl = typeof initialImages === 'object' && initialImages.secure_url
        ? initialImages.secure_url
        : typeof initialImages === 'string'
          ? initialImages
          : null
      setPreview(imageUrl)
    }
  }, [initialImages])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "حجم الصورة كبير جداً" : "Image size too large",
          description: language === "ar"
            ? "يجب أن يكون حجم الصورة أقل من 5 ميجابايت"
            : "Image must be less than 5MB"
        })
        return
      }

      setSelectedImage(file)
      const newPreview = URL.createObjectURL(file)
      setPreview(newPreview)
      onImagesChange([file])
    }
  }

  const removeImage = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setSelectedImage(null)
    setPreview(null)
    onImagesChange([])
  }

  return (
    <div className="space-y-4 w-full">
          {originalImage && (
        <div className="w-full bg-gray-50 p-4 rounded-lg">
          <div className="max-w-lg mx-auto">
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              {language === "ar" ? "الصورة الحالية:" : "Current Image:"}
            </h3>
            <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget
                  img.src = '/placeholder-image.jpg'
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-full">
        <label className="relative cursor-pointer w-full">
          <div className={`
            w-full min-h-[300px] p-6 border-2 border-dashed rounded-xl
            ${preview ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
            transition-all duration-300 ease-in-out
            flex items-center justify-center
            group hover:shadow-lg
          `}>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            
            {preview ? (
              <div className="relative w-full max-w-lg mx-auto">
                <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={() => setPreview('/placeholder-image.jpg')}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault()
                    removeImage()
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 transition-transform duration-300 group-hover:scale-105">
                <div className="relative">
                  <Upload className="mx-auto h-16 w-16 text-gray-400 animate-bounce" />
                  <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <p className="mt-6 text-lg font-semibold text-gray-700">
                  {language === "ar" ? "انقر لاختيار صورة" : "Click to select an image"}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {language === "ar"
                    ? "PNG, JPG, GIF حتى 5 ميجابايت"
                    : "PNG, JPG, GIF up to 5MB"}
                </p>
                {initialImages && (

                  <p className="mt-4 text-xs text-primary">
                    {language === "ar" ? "اضغط لتغيير الصورة" : "Click to change image"}

                  </p>
                )}
              </div>

            )}
          </div>
        </label>
      </div>
    </div>
  )
}
