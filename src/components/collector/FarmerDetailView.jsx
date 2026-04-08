import React, { useState, useEffect } from 'react';
import { CollectorService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, CalendarDays, Layers, CheckCircle2,
  Clock, Image, ExternalLink, Loader2
} from 'lucide-react';
import StageInitForm from './StageInitForm';
import Stage5Form from './Stage5Form';

const STAGE_LABELS = ['', 'Sowing', 'Sprouting', 'Vegetative Growth', 'Flowering / Fruiting', 'Harvest'];

function stageColor(stageNum) {
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  return colors[stageNum] || '#9ca3af';
}

export default function FarmerDetailView({ batch: initialBatch, onBack }) {
  const [batch, setBatch] = useState(initialBatch);
  const [showStage1, setShowStage1] = useState(false);
  const [showStage5, setShowStage5] = useState(false);

  const completedStages = batch?.stages?.map(s => s.stageNumber) || [];
  const latestStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;
  const progress = latestStage === 0 ? 0 : Math.round((latestStage / 5) * 100);
  const farmer = batch?.farmerId;

  const refresh = async () => {
    try {
      const res = await CollectorService.getBatchDetail(batch.batchId);
      setBatch(res.data.data);
    } catch (e) {}
  };

  const canInitStage1 = batch?.status === 'INITIATED' && !completedStages.includes(1);
  const canFinalVerify = completedStages.includes(4) && !completedStages.includes(5);

  const nextVisitDate = () => {
    const base = new Date(batch?.updatedAt || batch?.createdAt);
    base.setDate(base.getDate() + 21);
    return base.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-forest-dark transition-colors mb-6 font-medium text-sm group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Farmer Feed
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-forest-dark">{farmer?.name}</h2>
            <p className="text-sm text-gray-500">📞 {farmer?.phone} · {farmer?.farmerProfile?.location || 'Location not set'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-forest/10 text-forest text-xs font-bold rounded-full">{batch?.speciesName}</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full font-mono">{batch?.batchId}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-forest-dark">{progress}%</p>
            <p className="text-xs text-gray-400 font-medium">Crop Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-400 font-medium mb-1">
            <span>Stage 1</span>
            <span>Stage 5 (Harvest)</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full transition-all"
              style={{ background: `linear-gradient(to right, #ef4444, #22c55e ${progress}%)` }}
            />
          </div>
        </div>

        {/* Meta Info Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
          <MetaItem icon={<Layers size={14} />} label="Current Stage" value={latestStage === 0 ? 'Not Started' : STAGE_LABELS[latestStage]} />
          <MetaItem icon={<CalendarDays size={14} />} label="Initiated" value={batch?.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-IN') : '—'} />
          <MetaItem icon={<CalendarDays size={14} />} label="Next Visit" value={latestStage > 0 ? nextVisitDate() : '—'} />
          <MetaItem icon={<MapPin size={14} />} label="Location" value={farmer?.farmerProfile?.location || '—'} />
        </div>
      </div>

      {/* Stage Action Buttons */}
      {(canInitStage1 || canFinalVerify) && (
        <div className="flex gap-4 mb-6">
          {canInitStage1 && (
            <button onClick={() => setShowStage1(true)}
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
              🌱 Perform Stage 1 Visit (Initiate Crop)
            </button>
          )}
          {canFinalVerify && (
            <button onClick={() => setShowStage5(true)}
              className="flex-1 py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
              🔬 Perform Stage 5 Final Harvest & Verify
            </button>
          )}
        </div>
      )}

      {/* Stages Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-forest-dark mb-5 flex items-center gap-2">
          <Layers size={18} className="text-leaf" /> Stage Evidence Timeline
        </h3>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(num => {
            const stageData = batch?.stages?.find(s => s.stageNumber === num);
            const completed = !!stageData;
            const isMlStage = num === 5;

            return (
              <div key={num} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${completed ? 'border-forest/20 bg-green-50/50' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {completed ? (
                    <CheckCircle2 size={22} className="text-forest" />
                  ) : (
                    <Clock size={22} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-gray-800">{`Stage ${num}: ${STAGE_LABELS[num]}`}</p>
                      {completed && <p className="text-xs text-gray-400 mt-0.5">Completed {new Date(stageData.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>}
                    </div>
                    {completed && stageData.photoIpfsCid && stageData.photoIpfsCid !== 'no-photo-uploaded' && (
                      <a href={`https://gateway.pinata.cloud/ipfs/${stageData.photoIpfsCid}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-forest font-semibold hover:underline">
                        <Image size={13} /> View IPFS Photo <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  {isMlStage && batch?.mlVerification?.verifiedSpecies && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <span className="px-2 py-0.5 bg-forest/10 text-forest rounded font-bold">ML Verified</span>
                      <span>{batch.mlVerification.verifiedSpecies} ({(batch.mlVerification.rawConfidenceScore * 100).toFixed(1)}%)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage 1 Modal */}
      <AnimatePresence>
        {showStage1 && (
          <Modal onClose={() => setShowStage1(false)}>
            <StageInitForm batch={batch} onClose={() => setShowStage1(false)} onSuccess={() => { setShowStage1(false); refresh(); }} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Stage 5 Modal */}
      <AnimatePresence>
        {showStage5 && (
          <Modal onClose={() => setShowStage5(false)}>
            <Stage5Form batch={batch} onClose={() => setShowStage5(false)} onSuccess={() => { setShowStage5(false); refresh(); }} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

const MetaItem = ({ icon, label, value }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-0.5">{icon}{label}</p>
    <p className="font-semibold text-gray-700 text-sm">{value}</p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto"
    >
      {children}
    </motion.div>
  </motion.div>
);
