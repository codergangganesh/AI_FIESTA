'use client'

import { CheckCircle } from 'lucide-react'

interface DeleteAccountSuccessDialogProps {
  isOpen: boolean
}

export default function DeleteAccountSuccessDialog({ isOpen }: DeleteAccountSuccessDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-0 z-10 border border-gray-200 dark:border-gray-700">
        {/* Content */}
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Account deleted
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your account and all associated data have been successfully deleted.
          </p>
          <div className="mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will be redirected to the homepage shortly...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}