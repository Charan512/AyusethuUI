import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/api';
import { Loader2, FlaskConical, CheckCircle2, ArrowRight, Package } from 'lucide-react';

export default function PendingHarvests() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(null);
  const [done, setDone] = useState({});

  useEffect(() => {
    AdminService.getPendingHarvests()
      .then(res => { if (res.data?.success) setBatches(res.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleRelease = async (batchId) => {
    setReleasing(batchId);
    try {
      await AdminService.releaseForLab(batchId);
      setDone(prev => ({ ...prev, [batchId]: true }));
      setBatches(prev => prev.filter(b => b.batchId !== batchId));
    } catch (err) {
      alert(err?.response?.data?.error || 'Release failed');
    } finally {
      setReleasing(null);
    }
  };

  if (loading) return (
    <div className="bg-[#080d14] border border-blue-950 rounded-xl p-6 flex justify-center py-12">
      <Loader2 size={24} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="bg-[#080d14] border border-blue-950 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-blue-950">
        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Pending Harvest Reviews</p>
        <p className="text-xs text-gray-600 mt-0.5">ML-verified batches awaiting your release to the Lab queue</p>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12 text-gray-600 text-sm">
          <CheckCircle2 size={36} className="mx-auto mb-3 text-green-800" />
          All clear — no pending reviews.
        </div>
      ) : (
        <div className="divide-y divide-blue-950/50">
          {batches.map((batch) => {
            const farmer = batch?.farmerId;
            return (
              <div key={batch._id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-950 rounded-lg mt-0.5">
                    <Package size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{batch.speciesName}</span>
                      <span className="text-xs font-mono text-blue-500">{batch.batchId}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Farmer: {farmer?.name || '—'} · Harvested {new Date(batch.updatedAt).toLocaleDateString('en-IN')}
                    </p>
                    {batch?.mlVerification?.verifiedSpecies && (
                      <p className="text-xs text-green-400 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={11} /> ML Verified: {batch.mlVerification.verifiedSpecies}
                        {' '}({(batch.mlVerification.rawConfidenceScore * 100).toFixed(1)}%)
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRelease(batch.batchId)}
                  disabled={releasing === batch.batchId}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 border border-blue-600 flex-shrink-0"
                >
                  {releasing === batch.batchId
                    ? <><Loader2 size={13} className="animate-spin" /> Releasing...</>
                    : <><FlaskConical size={13} /> Release to Labs <ArrowRight size={13} /></>
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
