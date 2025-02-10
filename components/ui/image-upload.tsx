import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { toast } from "./use-toast"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  maxImages: number
  language: "ar" | "en"
  initialImages?: string[]
}

export function ImageUpload({ onImagesChange, maxImages, language, initialImages = [] }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(initialImages)

  useEffect(() => {
    // Clean up URLs on unmount
    return () => previews.forEach(preview => URL.revokeObjectURL(preview))
  }, [previews])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxImages) {
        toast.error(
          language === "ar" 
            ? `الحد الأقصى للصور هو ${maxImages}`
            : `Maximum ${maxImages} images allowed`
        )
        return
      }

      const newFiles = acceptedFiles.filter(file => file.size <= 5 * 1024 * 1024) // 5MB limit
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))

      setFiles(prev => [...prev, ...newFiles])
      setPreviews(prev => [...prev, ...newPreviews])
      onImagesChange([...files, ...newFiles])
    },
    [files, maxImages, language, onImagesChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newPreviews)
    onImagesChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
          {isDragActive ? (
            <p className="text-primary font-medium">
              {language === "ar" ? "أفلت الصورة هنا" : "Drop the image here"}
            </p>
          ) : (
            <>
              <p className="font-medium">
                {language === "ar" ? "اسحب وأفلت الصورة هنا" : "Drag and drop image here"}
              </p>
              <p className="text-sm text-gray-500">
                {language === "ar" 
                  ? "أو انقر للاختيار (الحد الأقصى 5 ميجابايت)" 
                  : "or click to select (max 5MB)"}
              </p>
            </>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
