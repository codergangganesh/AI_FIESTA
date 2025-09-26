'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

interface PasswordSuccessMessageProps {
  onClose: () => void
}

export default function PasswordSuccessMessage({ onClose }: PasswordSuccessMessageProps) {
  const router = useRouter()

  useEffect(() => {
    // Automatically close the message and redirect to compare after 3 seconds
    const timer = setTimeout(() => {
      onClose()
      router.push('/compare')
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose, router])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Password Created Successfully!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This password will be used for deleting your account.
          </p>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            Redirecting to compare...
          </p>
        </div>
      </div>
    </div>
  )
}