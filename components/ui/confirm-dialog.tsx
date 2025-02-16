// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// interface ConfirmDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onConfirm: () => void
//   title: string
//   description: string
//   confirmText?: string
//   cancelText?: string
// }

// export function ConfirmDialog({
//   open,
//   onOpenChange,
//   onConfirm,
//   title,
//   description,
//   confirmText = "تأكيد",
//   cancelText = "إلغاء",
// }: ConfirmDialogProps) {
//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>{description}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>{cancelText}</AlertDialogCancel>
//           <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-gray-900 shadow-lg rounded-md p-6">
        <AlertDialogHeader>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Trash2 className="text-red-500 h-6 w-6" />
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-4 text-gray-700 dark:text-gray-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex justify-end space-x-4 rtl:space-x-reverse">
          <AlertDialogCancel className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}