import React from 'react'
import { CheckCircle } from 'lucide-react'

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="p-10 max-w-md w-full bg-white rounded-2xl shadow-2xl border-blue-100 border text-center flex flex-col items-center gap-6">
        <CheckCircle size={56} className="text-green-500 mb-2" />
        <p className="text-3xl font-extrabold text-blue-800">Thank You!</p>
        <p className="text-lg text-gray-700">✅ Attendance marked. You can now close this tab.</p>
      
      </div>
    </div>
  )
}

export default ThankYou