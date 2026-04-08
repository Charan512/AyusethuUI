import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Leaf, FlaskConical, Building2,
  BarChart2, Package, Activity, Gavel,
  RefreshCw, Loader2
} from 'lucide-react';
import StatCard from './admin/StatCard';
import { CollectorChart, AuctionChart } from './admin/ActivityCharts';
import AuditLog from './admin/AuditLog';
import AuctionMonitor from './admin/AuctionMonitor';
import PendingHarvests from './admin/PendingHarvests';

const TABS = [
  { id: 'overview',  label: 'Overview',        icon: BarChart2 },
  { id: 'harvests',  label: 'Harvest Reviews',  icon: Leaf },
  { id: 'auctions',  label: 'Auction Monitor',  icon: Gavel },
  { id: 'audit',     label: 'Audit Log',        icon: Activity },
];

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    AdminService.getStats()
      .then(res => { if (res.data?.success) setStats(res.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const u = stats?.users || {};
  const b = stats?.batches || {};
  const charts = stats?.charts || {};

  return (
    <div className="min-h-full bg-[#060a10] rounded-2xl p-1">

      {/* Command Center Header */}
      <div className="bg-[#080d14] border border-blue-950 rounded-xl px-6 py-4 mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-black tracking-tight">AyuSethu Command Center</h1>
          <p className="text-[11px] text-blue-400 uppercase tracking-widest font-bold mt-0.5">Admin Console · Supply Chain Control</p>
        </div>

        <div className="flex items-center gap-3">
          {/* System Health Indicators */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#060a10] border border-blue-950 rounded-lg">
            <Dot color="green" label="MongoDB" />
            <Dot color="green" label="Bhashini" />
            <Dot color="green" label="IPFS" />
          </div>

          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-900 hover:bg-blue-800 border border-blue-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-[#080d14] border border-blue-950 rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white shadow'
                : 'text-blue-400 hover:text-white hover:bg-blue-950'
            }`}>
            <tab.icon size={14} />{tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW TAB ─────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div key="overview"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-5">

            {/* Stat Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Active Farmers" value={loading ? null : u.farmers} icon={Users} color="blue" sublabel="Registered on mobile" />
              <StatCard label="Collectors" value={loading ? null : u.collectors} icon={Leaf} color="green" sublabel="Network partners" />
              <StatCard label="Manufacturers" value={loading ? null : u.manufacturers} icon={Building2} color="cyan" sublabel="Bidding entities" />
              <StatCard label="Labs" value={loading ? null : u.labs} icon={FlaskConical} color="white" sublabel="Certified testers" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard label="Total Batches" value={loading ? null : b.total} icon={Package} color="blue" />
              <StatCard label="Active Cultivations" value={loading ? null : b.active} icon={Activity} color="green" sublabel="In pipeline" />
              <StatCard label="Completed / Sold" value={loading ? null : b.completed} icon={Gavel} color="white" sublabel="Lab tested or auctioned" />
            </div>

            {/* Batch by Status Breakdown */}
            {!loading && b.byStatus && (
              <div className="bg-[#080d14] border border-blue-950 rounded-xl p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-4">Batch Status Breakdown</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(b.byStatus).map(([status, count]) => (
                    <div key={status} className="bg-[#0a1628] border border-blue-900/50 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{status.replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-black text-white">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CollectorChart data={charts.collectorActivity || []} />
              <AuctionChart data={charts.auctionActivity || []} />
            </div>
          </motion.div>
        )}

        {/* ── HARVEST REVIEWS TAB ──────────────────────── */}
        {activeTab === 'harvests' && (
          <motion.div key="harvests"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PendingHarvests />
          </motion.div>
        )}

        {/* ── AUCTION MONITOR TAB ──────────────────────── */}
        {activeTab === 'auctions' && (
          <motion.div key="auctions"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AuctionMonitor />
          </motion.div>
        )}

        {/* ── AUDIT LOG TAB ────────────────────────────── */}
        {activeTab === 'audit' && (
          <motion.div key="audit"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AuditLog />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

const Dot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`} />
    <span className="text-[10px] text-gray-500 font-medium">{label}</span>
  </div>
);
