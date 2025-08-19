import React from 'react'
import { useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const payment_id = searchParams.get("reference");
  const appointment_id = searchParams.get("appointment-id");

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div className="backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full text-center border border-white/40 animate-fade-in-up">
        
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 shadow-inner border border-green-300">
            ✅
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
          Payment Successful
        </h1>
        <p className="text-gray-500 mt-2 mb-6 text-sm">
          Thank you! Your payment has been processed.
        </p>

        <div className="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg px-4 py-3 mb-4 shadow-sm">
          <div>
            <span className="block font-medium text-gray-600">Reference ID</span>
            <span className="break-all text-green-700 font-mono">{payment_id}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg px-4 py-3 mb-6 shadow-sm">
          <div>
            <span className="block font-medium text-gray-600">Appointment ID</span>
            <span className="break-all text-blue-700 font-mono">{appointment_id}</span>
          </div>
        </div>

        <button
          onClick={() => window.location.href = `/appointments/${appointment_id}`}
          className="transition-all bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg"
        >
          View Appointment
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
