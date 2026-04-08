import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ManufacturerService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Gavel, FlaskConical, Package,
  TrendingUp, Award, QrCode, RefreshCw, Loader2, Building2, Wifi, WifiOff
} from 'lucide-react';
import AuctionCard from './manufacturer/AuctionCard';
import MyBatches from './manufacturer/MyBatches';

const TABS = [
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'auctions',  label: 'Live Auctions',   icon: Gavel },
  { id: 'batches',   label: 'My Batches',      icon: Package },
];

export default function ManufacturerView() {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const profile = user?.manufacturerProfile;

  // ── Socket.io real-time updates ───────────────────────────────────────────
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5001';
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => { setConnected(true); socket.emit('joinRole', 'MANUFACTURER'); });
    socket.on('disconnect', () => setConnected(false));

    // Live bid update — update the relevant auction card's bid list
    socket.on('bid_update', (data) => {
      setAuctions(prev => prev.map(a => {
        if (a._id?.toString() !== data.batchId && a.batchId !== data.batchStringId) return a;
        const updatedBids = [data.newBid, ...a.bids.filter(b => b._id !== data.newBid._id)];
        return { ...a, bids: updatedBids, highestBid: data.newBid };
      }));
    });

    // Auction opened — refresh list
    socket.on('auction_opened', () => { loadAuctions(); });

    // Auction closed — move batch out of auctions, refresh my-batches
    socket.on('auction_closed', () => { loadAuctions(); loadMyBatches(); });

    return () => socket.disconnect();
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await ManufacturerService.getDashboard();
      if (res.data?.success) setDashboard(res.data.data);
    } catch {}
  }, []);

  const loadAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ManufacturerService.getAuctions();
      if (res.data?.success) setAuctions(res.data.data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  const loadMyBatches = useCallback(async () => {
    try {
      const res = await ManufacturerService.getMyBatches();
      if (res.data?.success) setMyBatches(res.data.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadDashboard();
    loadAuctions();
    loadMyBatches();
  }, []);

  useEffect(() => {
    if (tab === 'auctions') loadAuctions();
    if (tab === 'batches') loadMyBatches();
    if (tab === 'dashboard') loadDashboard();
  }, [tab]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Portal header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 rounded-lg">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {profile?.organizationName || user?.name || 'Manufacturer Portal'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              {connected
                ? <><Wifi size={11} className="text-green-600" /><span className="text-green-600 font-semibold">Live · Real-time updates active</span></>
                : <><WifiOff size={11} className="text-gray-400" /> Connecting to live feed…</>}
            </p>
          </div>
        </div>
        <button onClick={() => { loadAuctions(); loadDashboard(); loadMyBatches(); }}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold flex-1 justify-center transition-all ${tab === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div key="dashboard"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DashCard icon={<Award size={20} className="text-green-700" />} label="Auctions Won" value={dashboard?.wonCount ?? '—'} bg="bg-green-50 border-green-200" />
              <DashCard icon={<Package size={20} className="text-gray-700" />} label="Products Created" value={dashboard?.qrCount ?? '—'} bg="bg-gray-50 border-gray-200" />
              <DashCard icon={<QrCode size={20} className="text-blue-700" />} label="QR Codes Generated" value={dashboard?.qrCount ?? '—'} bg="bg-blue-50 border-blue-200" />
            </div>

            {/* Profile card */}
            {profile && (
              <div className="border border-gray-200 rounded-xl bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Organization Profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <ProfileRow label="Organisation" value={profile.organizationName} />
                  <ProfileRow label="Location" value={profile.location} />
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Products Manufactured</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile.productsManufactured || []).map((p, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent QRs */}
            {dashboard?.recentQRs?.length > 0 && (
              <div className="border border-gray-200 rounded-xl bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Recent QR Codes</p>
                <div className="space-y-2">
                  {dashboard.recentQRs.map((fp) => (
                    <div key={fp._id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                      <div>
                        <p className="font-semibold text-gray-800">{fp.productName}</p>
                        <p className="text-xs text-gray-400 font-mono">{fp.finalBatchId} · {fp.cropBatchId?.speciesName}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(fp.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── LIVE AUCTIONS ── */}
        {tab === 'auctions' && (
          <motion.div key="auctions"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {auctions.length} active auction{auctions.length !== 1 ? 's' : ''} · Bidding windows open at 10:00 AM & 4:00 PM IST
              </p>
              {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
            </div>

            {auctions.length === 0 && !loading ? (
              <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center text-gray-400">
                <Gavel size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No live auctions right now.</p>
                <p className="text-sm mt-1">Auctions open automatically after Lab certification. Check back at 10 AM or 4 PM IST.</p>
              </div>
            ) : (
              auctions.map(auction => (
                <AuctionCard key={auction._id} auction={auction} onBidPlaced={loadAuctions} />
              ))
            )}
          </motion.div>
        )}

        {/* ── MY BATCHES ── */}
        {tab === 'batches' && (
          <motion.div key="batches"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <MyBatches batches={myBatches} onRefresh={loadMyBatches} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

const DashCard = ({ icon, label, value, bg }) => (
  <div className={`border rounded-xl p-5 ${bg}`}>
    <div className="flex items-center gap-2 mb-2">{icon}<p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p></div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
  </div>
);

const ProfileRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
  </div>
);
