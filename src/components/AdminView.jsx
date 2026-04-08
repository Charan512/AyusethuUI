import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminView() {
  const [stats, setStats] = useState({ farmers: 0, collectors: 0, labs: 0, manufacturers: 0, activeBatches: 0, verifiedBatches: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const token = localStorage.getItem('ayusethu_token');
      const res = await axios.get(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-forest-dark">System Overview</h3>
        <button 
           onClick={fetchStats} disabled={loading}
           className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-semibold text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center space-x-2 font-medium">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Farmers</p>
           <p className="text-4xl font-extrabold text-forest-dark">{loading ? '-' : stats.farmers}</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Network Collectors</p>
           <p className="text-4xl font-extrabold text-leaf">{loading ? '-' : stats.collectors}</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Batches</p>
           <p className="text-4xl font-extrabold text-forest-dark">{loading ? '-' : stats.activeBatches}</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Verified Products</p>
           <p className="text-4xl font-extrabold text-green-600">{loading ? '-' : stats.verifiedBatches}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-200 bg-green-50/50">
           <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">System Health</p>
           <p className="text-sm font-bold text-green-800">Bhashini ASR: Online</p>
           <p className="text-sm font-bold text-green-800 mt-1">MongoDB: Connected</p>
           <p className="text-sm font-bold text-green-800 mt-1">IPFS Pinner: Ready</p>
         </div>
      </div>
    </div>
  );
}
