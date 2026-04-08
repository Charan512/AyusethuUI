import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManufacturerView() {
  const [qrModal, setQrModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMintQR = async (batchId) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const res = await axios.post(`${apiUrl}/manufacturer/auction/${batchId}/finalize`, {}, {
         headers: { Authorization: `Bearer ${localStorage.getItem('ayusethu_token')}` }
      });
      setQrModal(res.data.data.qrCode);
    } catch (err) {
      alert('Error finalizing or already finalized');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
      <h3 className="text-2xl font-bold text-forest-dark mb-6">Auction & Procurement</h3>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Batch ID</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Species</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Lab Grade</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-earth-bg/50 transition-colors border-b border-gray-100">
            <td className="p-4 font-semibold text-gray-800">CROP-100923</td>
            <td className="p-4 text-gray-600">Ashwagandha</td>
            <td className="p-4"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Grade A+</span></td>
            <td className="p-4">
              <div className="flex space-x-2">
                <input type="number" placeholder="Bid (₹)" className="w-24 p-2 border border-gray-200 rounded outline-none focus:border-forest" />
                <button 
                   onClick={() => handleMintQR('CROP-100923')}
                   disabled={loading}
                   className="px-4 py-2 bg-forest text-white rounded font-bold hover:bg-forest-dark text-sm disabled:bg-gray-400"
                >
                  {loading ? 'Minting...' : 'Mint QR Base64'}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* QR Modal */}
      <AnimatePresence>
         {qrModal && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
           >
              <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center">
                 <h2 className="text-2xl font-bold text-forest-dark mb-2">QR Minted Successfully</h2>
                 <p className="text-sm text-gray-500 mb-6 text-center max-w-xs break-all">Links to: {qrModal.verificationUrl}</p>
                 <img src={qrModal.dataUri} alt="Base64 QR Code" className="w-64 h-64 border-4 border-gray-100 rounded-xl mb-6 shadow-sm" />
                 <button onClick={() => setQrModal(null)} className="px-8 py-3 bg-earth-bg border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100">
                    Close Document
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
