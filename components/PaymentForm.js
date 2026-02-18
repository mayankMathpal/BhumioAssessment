"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PaymentRecords from './PaymentRecords'; // Import the new component

export default function PaymentForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  
  // State for the history list
  const [history, setHistory] = useState([]);

  const activeKey = useRef(null);
  const MAX_RETRIES = 3;

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('paymentHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'loading' || status === 'retrying') return;

    // Client-side Duplicate Check
    const isDuplicate = history.some(item => 
      item.email === email && item.amount === amount
    );

    if (isDuplicate) {
      setStatus('error');
      setMsg('Duplicate: You have already paid this amount.');
      return;
    }

    activeKey.current = crypto.randomUUID();
    setStatus('loading');
    setMsg('Processing payment...');
    
    makeRequest(0);
  };

  const makeRequest = async (attemptCount) => {
    try {
      await axios.post('/api/payment', {
        email,
        amount,
        idempotencyKey: activeKey.current
      });

      // On Success: Update History & LocalStorage
      const newRecord = { 
        email, 
        amount, 
        date: new Date().toLocaleString() 
      };
      
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('paymentHistory', JSON.stringify(updatedHistory));

      setStatus('success');
      setMsg('Payment successful!');
      setEmail('');
      setAmount('');

    } catch (err) {
      const code = err.response?.status;

    //   retry logic if server throws 503
      if (code === 503 && attemptCount < MAX_RETRIES) {
        const next = attemptCount + 1;
        setStatus('retrying');
        setMsg(`Server busy... Retrying (${next}/${MAX_RETRIES})`);
        setTimeout(() => makeRequest(next), 2000);
      } else {
        setStatus('error');
        setMsg('Payment failed. Please try again.');
      }
    }
  };


// styling helper for different api status
  const getColor = () => {
    if (status === 'success') return 'bg-green-100 text-green-700 border-green-300';
    if (status === 'error') return 'bg-red-100 text-red-700 border-red-300';
    if (status === 'retrying') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      
      {/* Form Container */}
      <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pay Invoice</h2>
        
        {status !== 'idle' && (
          <div className={`p-3 mb-5 rounded border text-sm font-medium ${getColor()}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'retrying'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <input 
              type="number" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={status === 'loading' || status === 'retrying'}
            />
          </div>

          <button 
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            disabled={status === 'loading' || status === 'retrying'}
          >
            {status === 'loading' ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>

      {/* Render the separate History Component */}
      <PaymentRecords payments={history} />

    </div>
  );
}