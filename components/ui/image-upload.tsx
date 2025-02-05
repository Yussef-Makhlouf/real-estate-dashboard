"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload } from "lucide-react"


export interface ImageUploadProps {

  onImagesChange: (images: File[]) => void

  maxImages: number

  initialImages?: string[]

}


export function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      setImages(updatedImages)
      onImagesChange(updatedImages)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline">
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            اختر الصور
          </label>
        </Button>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} صور مختارة
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image) || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

