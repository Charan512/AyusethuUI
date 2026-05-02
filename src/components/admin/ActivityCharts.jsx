import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Flat custom tooltip — no gradients, pure dark
const FlatTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1628] border border-blue-900 rounded-lg px-3 py-2 text-xs">
      <p className="text-blue-300 font-bold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export function CollectorChart({ data = [] }) {
  const formatted = data.map(d => ({ date: d._id?.slice(5) || d._id, batches: d.batches }));

  return (
    <div className="bg-[#0a1628] border border-blue-900 rounded-xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-4">Collector Activity — Batches Logged (14 Days)</p>
      {formatted.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-600 text-sm">No data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={formatted} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#4b7cbd', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b7cbd', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<FlatTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
            <Bar dataKey="batches" fill="#2563eb" radius={[3, 3, 0, 0]} name="Batches" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function AuctionChart({ data = [] }) {
  const formatted = data.map(d => ({ date: d._id?.slice(5) || d._id, bids: d.bids }));

  return (
    <div className="bg-[#061a0f] border border-green-900 rounded-xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-green-300 mb-4">Manufacturer Auction Activity — Bids Placed (14 Days)</p>
      {formatted.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-600 text-sm">No bids yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={formatted} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#133d22" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#4ade80', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4ade80', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<FlatTooltip />} />
            <Line type="monotone" dataKey="bids" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 3 }} name="Bids" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
