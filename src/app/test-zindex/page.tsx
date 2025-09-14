'use client'

import { useState } from 'react'

export default function TestZIndexPage() {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Z-Index Test Page</h1>
      
      <button
        onClick={() => setShowPopup(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Show Test Popup
      </button>
      
      {/* Test Popup with high z-index */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Test Popup</h2>
              <p className="mb-6">This popup should appear on top of everything.</p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-gray-600">
        <p>Click the button above to test if the popup appears correctly.</p>
      </div>
    </div>
  )
}