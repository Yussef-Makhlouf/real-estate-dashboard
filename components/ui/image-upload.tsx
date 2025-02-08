import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  maxImages: number
  language: "ar" | "en"
  initialImages?: string[]
}

export function ImageUpload({ onImagesChange, maxImages, language }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxImages - files.length)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      onImagesChange([...files, ...newFiles])
    },
    [files, maxImages, onImagesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } })

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onImagesChange(newFiles)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>{language === "ar" ? "أفلت الصورة هنا" : "Drop the image here"}</p>
        ) : (
          <p>
            {language === "ar"
              ? "اسحب وأفلت الصورة هنا، أو انقر للاختيار"
              : "Drag and drop image here, or click to select"}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt={`Uploaded ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-0 right-0 rounded-full"
              onClick={() => removeImage(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

