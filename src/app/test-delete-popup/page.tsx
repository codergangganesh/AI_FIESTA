'use client'

import { useState } from 'react'
import DeleteAccountDialog from '@/components/auth/DeleteAccountDialog'

export default function TestDeletePopup() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Delete Account Popup Test</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Click the button below to test the improved delete account popup.
        </p>
        
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          Open Delete Account Dialog
        </button>
        
        <DeleteAccountDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
        />
      </div>
    </div>
  )
}