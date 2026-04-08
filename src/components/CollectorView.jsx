import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollectorService } from '../services/api';
import FarmerCard from './collector/FarmerCard';
import FarmerDetailView from './collector/FarmerDetailView';
import InventoryView from './collector/InventoryView';
import { Loader2, Users, Package, RefreshCw, Search, Filter } from 'lucide-react';

const TABS = [
  { id: 'feed', label: 'Active Farmers', icon: Users },
  { id: 'inventory', label: 'Godown Inventory', icon: Package },
];

export default function CollectorView() {
  const [activeTab, setActiveTab] = useState('feed');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [error, setError] = useState('');

  const loadFarmerFeed = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await CollectorService.getActiveFarmers();
      if (res.data?.success) setBatches(res.data.data);
    } catch {
      setError('Failed to load farmer feed. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFarmerFeed(); }, [loadFarmerFeed]);

  // Filter logic
  const filteredBatches = batches.filter(batch => {
    const farmerName = batch.farmerId?.name?.toLowerCase() || '';
    const species = batch.speciesName?.toLowerCase() || '';
    const term = search.toLowerCase();
    const matchesSearch = !search || farmerName.includes(term) || species.includes(term);

    const completedStages = batch.stages?.map(s => s.stageNumber) || [];
    const latestStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;
    const matchesFilter = filterStage === 'ALL'
      || (filterStage === 'PENDING' && latestStage === 0)
      || (filterStage === 'ACTIVE' && latestStage > 0 && latestStage < 5)
      || (filterStage === 'HARVESTED' && batch.status === 'HARVESTED');

    return matchesSearch && matchesFilter;
  });

  // Summary stats
  const pendingCount = batches.filter(b => {
    const stages = b.stages?.map(s => s.stageNumber) || [];
    return stages.length === 0;
  }).length;
  const activeCount = batches.filter(b => {
    const stages = b.stages?.map(s => s.stageNumber) || [];
    const latest = stages.length > 0 ? Math.max(...stages) : 0;
    return latest > 0 && latest < 5;
  }).length;
  const harvestedCount = batches.filter(b => b.status === 'HARVESTED').length;

  if (selectedBatch) {
    return (
      <FarmerDetailView
        batch={selectedBatch}
        onBack={() => { setSelectedBatch(null); loadFarmerFeed(); }}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-white text-forest-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon size={15} />{tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'feed' ? (
          <motion.div key="feed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Initiation Requests" value={pendingCount} color="bg-blue-50 border-blue-200" valueColor="text-blue-600" />
              <StatCard label="Actively Growing" value={activeCount} color="bg-amber-50 border-amber-200" valueColor="text-amber-600" />
              <StatCard label="Harvested (Godown)" value={harvestedCount} color="bg-green-50 border-green-200" valueColor="text-green-600" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by farmer name or crop..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStage}
                  onChange={e => setFilterStage(e.target.value)}
                  className="pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-forest cursor-pointer appearance-none"
                >
                  <option value="ALL">All Stages</option>
                  <option value="PENDING">Initiation Pending</option>
                  <option value="ACTIVE">Currently Growing</option>
                  <option value="HARVESTED">Harvested</option>
                </select>
              </div>
              <button onClick={loadFarmerFeed} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-earth-bg transition-all" title="Refresh">
                <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Farmer Feed */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 size={32} className="animate-spin text-forest" />
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center font-medium">{error}</div>
            ) : filteredBatches.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
                <Users size={52} />
                <p className="font-semibold text-lg">No Farmers Found</p>
                <p className="text-sm">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBatches.map((batch, i) => (
                  <motion.div key={batch._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <FarmerCard batch={batch} onClick={() => setSelectedBatch(batch)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <InventoryView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatCard = ({ label, value, color, valueColor }) => (
  <div className={`rounded-2xl border p-4 ${color}`}>
    <p className={`text-2xl font-black ${valueColor}`}>{value}</p>
    <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
  </div>
);
