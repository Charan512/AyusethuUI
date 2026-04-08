import React, { useState, useEffect } from 'react';
import { CollectorService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Leaf, CalendarDays, Scale, ExternalLink, Loader2, Box } from 'lucide-react';

const STATUS_LABELS = {
  HARVESTED: { label: 'In Godown', color: 'bg-amber-100 text-amber-800' },
  IN_TRANSIT: { label: 'In Transit', color: 'bg-blue-100 text-blue-700' },
};

export default function InventoryView() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    CollectorService.getInventory()
      .then(res => { if (res.data?.success) setBatches(res.data.data); })
      .catch(() => setError('Failed to load inventory.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 size={32} className="animate-spin text-forest" />
    </div>
  );

  if (error) return <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">{error}</div>;

  if (batches.length === 0) return (
    <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
      <Box size={52} />
      <p className="font-semibold text-lg">Godown is Empty</p>
      <p className="text-sm">Harvested crops will appear here once Stage 5 is completed.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-forest-dark">Godown Inventory</h3>
          <p className="text-sm text-gray-500 mt-0.5">Harvested & verified crops awaiting Lab testing</p>
        </div>
        <span className="px-4 py-1.5 bg-forest/10 text-forest text-sm font-bold rounded-full">{batches.length} Batches</span>
      </div>

      <div className="space-y-4">
        {batches.map((batch, i) => {
          const farmer = batch?.farmerId;
          const statusInfo = STATUS_LABELS[batch.status] || { label: batch.status, color: 'bg-gray-100 text-gray-600' };
          const mlVerified = !!batch?.mlVerification?.verifiedSpecies;

          return (
            <motion.div
              key={batch._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Package size={22} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-800">{batch.speciesName}</h4>
                      <span className="text-xs font-mono text-gray-400">{batch.batchId}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Farmer: <span className="font-semibold text-gray-700">{farmer?.name}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {mlVerified && (
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">✓ ML Verified</span>
                  )}
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <MetaItem icon={<Leaf size={12} />} label="Species" value={batch?.mlVerification?.verifiedSpecies || batch.speciesName} />
                <MetaItem icon={<Scale size={12} />} label="Estimated Qty" value={`${batch?.cultivationDetails?.estimatedQuantityKg || '—'} Kg`} />
                <MetaItem icon={<CalendarDays size={12} />} label="Harvested On" value={batch?.updatedAt ? new Date(batch.updatedAt).toLocaleDateString('en-IN') : '—'} />
                <MetaItem icon={<ExternalLink size={12} />} label="Leaf IPFS" value={
                  batch?.mlVerification?.leafPhotoCid ? (
                    <a href={`https://gateway.pinata.cloud/ipfs/${batch.mlVerification.leafPhotoCid}`} target="_blank" rel="noreferrer"
                      className="text-forest hover:underline font-semibold">View on IPFS ↗</a>
                  ) : '—'
                } />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const MetaItem = ({ icon, label, value }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-0.5">{icon}{label}</p>
    <div className="font-semibold text-gray-700 text-sm">{value}</div>
  </div>
);
