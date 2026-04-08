import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Clock, ChevronRight } from 'lucide-react';

// Returns the card accent color based on stage
function getCardStyle(batch) {
  const completedStages = batch?.stages?.map(s => s.stageNumber) || [];
  const latestStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;

  if (batch?.status === 'INITIATED' && latestStage === 0) {
    // Blue: farmer wants to initiate — waiting for Collector visit
    return {
      border: 'border-blue-300',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
      badgeText: 'Initiation Requested',
      dot: 'bg-blue-400',
      barColor: '#3b82f6',
      progress: 0,
    };
  }

  // Stage 1-5: pinkish-red → orange → yellow → lime → green
  const stageColors = [
    null,
    { border: 'border-red-300', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', badgeText: 'Stage 1 — Sowing', dot: 'bg-red-400', barColor: '#ef4444' },
    { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700', badgeText: 'Stage 2 — Sprouting', dot: 'bg-orange-400', barColor: '#f97316' },
    { border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', badgeText: 'Stage 3 — Vegetative', dot: 'bg-yellow-400', barColor: '#eab308' },
    { border: 'border-lime-300', bg: 'bg-lime-50', badge: 'bg-lime-100 text-lime-700', badgeText: 'Stage 4 — Flowering', dot: 'bg-lime-500', barColor: '#84cc16' },
    { border: 'border-green-400', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', badgeText: 'Stage 5 — Harvested ✓', dot: 'bg-green-500', barColor: '#22c55e' },
  ];

  const style = stageColors[latestStage] || stageColors[1];
  return { ...style, progress: Math.round((latestStage / 5) * 100) };
}

export default function FarmerCard({ batch, onClick }) {
  const farmer = batch?.farmerId;
  const style = getCardStyle(batch);
  const completedStages = batch?.stages?.map(s => s.stageNumber) || [];
  const latestStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;

  const daysAgo = batch?.updatedAt
    ? Math.floor((Date.now() - new Date(batch.updatedAt)) / 86400000)
    : null;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={`rounded-2xl border-2 ${style.border} ${style.bg} p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${style.dot} ring-4 ring-white`} />
          <div>
            <p className="font-bold text-gray-800 text-base leading-tight">{farmer?.name || 'Unknown Farmer'}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={11} />{farmer?.farmerProfile?.location || 'No location'}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 flex-shrink-0 mt-1" />
      </div>

      {/* Badge */}
      <div className="mb-3">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
          {style.badgeText}
        </span>
      </div>

      {/* Crop & Batch Info */}
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={13} className="text-forest flex-shrink-0" />
        <span className="text-sm font-semibold text-forest">{batch?.speciesName}</span>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-gray-400 font-mono">{batch?.batchId}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${style.progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: style.barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{style.progress}% complete</span>
        {daysAgo !== null && (
          <span className="flex items-center gap-1">
            <Clock size={11} />{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
        )}
      </div>
    </motion.div>
  );
}
