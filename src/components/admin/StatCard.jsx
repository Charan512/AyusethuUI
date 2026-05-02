import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'blue', sublabel }) {
  const colorMap = {
    blue:  { card: 'bg-[#0a1628] border-blue-900', val: 'text-blue-400', label: 'text-blue-300', icon: 'bg-blue-950 text-blue-400' },
    green: { card: 'bg-[#061a0f] border-green-900', val: 'text-green-400', label: 'text-green-300', icon: 'bg-green-950 text-green-400' },
    white: { card: 'bg-[#0e1117] border-gray-700', val: 'text-white', label: 'text-gray-400', icon: 'bg-gray-800 text-gray-300' },
    cyan:  { card: 'bg-[#04151f] border-cyan-900', val: 'text-cyan-400', label: 'text-cyan-300', icon: 'bg-cyan-950 text-cyan-400' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-xl border p-5 ${c.card} flex items-start gap-4`}>
      {Icon && (
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${c.icon}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${c.label}`}>{label}</p>
        <p className={`text-3xl font-black tracking-tight ${c.val}`}>
          {value ?? <span className="text-xl opacity-40">—</span>}
        </p>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
