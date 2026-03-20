import React from 'react';

export default function CollectorView() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-forest-dark mb-4">Batch Selection</h3>
        <select className="w-full p-4 bg-earth-bg border border-gray-200 rounded-xl outline-none font-medium text-gray-700">
           <option>CROP-700236 — Farmer: Ramesh (Stage 4)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-forest-dark mb-4">Evidence Timeline</h3>
           <p className="text-sm text-gray-500 mb-6">Stages 1-4 IPFS Ledger</p>
           <ul className="space-y-4 border-l-2 border-leaf ml-2 pl-4">
             <li className="relative">
               <div className="absolute -left-[21px] top-1 w-3 h-3 bg-forest rounded-full"></div>
               <p className="font-bold text-gray-800">Stage 1: Sowing</p>
               <p className="text-xs text-forest-light font-medium">ipfs://QmXyZ...</p>
             </li>
             <li className="relative">
               <div className="absolute -left-[21px] top-1 w-3 h-3 bg-forest rounded-full"></div>
               <p className="font-bold text-gray-800">Stage 2: Sprouting</p>
               <p className="text-xs text-forest-light font-medium">ipfs://QmAbc...</p>
             </li>
           </ul>
         </div>

         <div className="bg-earth-bg p-8 rounded-2xl border border-gray-200 flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-bold text-forest-dark mb-2">Stage 5 Final Verification</h3>
             <p className="text-sm text-gray-600 mb-6">Upload leaf for AI verification (EfficientNetV2).</p>
           </div>
           
           <div className="space-y-4">
             <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:font-bold file:bg-white file:text-forest hover:file:bg-gray-50" />
             <button className="w-full py-4 bg-forest text-white font-bold rounded-xl shadow-md hover:bg-forest-light transition-colors">
               Verify & Pin 
             </button>
           </div>
         </div>
      </div>
    </div>
  );
}
