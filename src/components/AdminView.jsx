import React from 'react';

export default function AdminView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Registered Farmers</p>
           <p className="text-4xl font-extrabold text-forest-dark">4,209</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Batches</p>
           <p className="text-4xl font-extrabold text-leaf">812</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-200 bg-green-50/50">
           <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">System Health</p>
           <p className="text-sm font-bold text-green-800">Bhashini ASR: Online</p>
           <p className="text-sm font-bold text-green-800 mt-1">FastAPI ML: Online</p>
         </div>
      </div>
    </div>
  );
}
