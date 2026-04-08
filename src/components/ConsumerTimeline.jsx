import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, MapPin, Cpu, FlaskConical, Factory, Leaf,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  FileText, IndianRupee, Pill, CheckCircle2, XCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const GREEN = '#1B5E20';
const LIGHT_GREEN = '#2E7D32';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#F7FBF7] flex flex-col items-center justify-center gap-5 p-8">
      <div className="relative">
        <Leaf size={52} className="text-green-300 animate-pulse" />
        <div className="absolute inset-0 animate-ping opacity-20">
          <Leaf size={52} className="text-green-400" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-green-800 font-black text-lg tracking-wide">Verifying Authenticity</p>
        <p className="text-green-600 text-sm mt-1">Cross-referencing supply chain ledger…</p>
      </div>
      <div className="w-full max-w-sm space-y-3 mt-4">
        {[80, 60, 90, 70].map((w, i) => (
          <div key={i} className="h-3 bg-green-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Error State
// ─────────────────────────────────────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className="min-h-screen bg-[#F7FBF7] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <XCircle size={56} className="text-red-400" />
      <h2 className="text-2xl font-black text-gray-800">Verification Failed</h2>
      <p className="text-gray-500 max-w-xs">{message || 'Invalid QR code or unrecognised product.'}</p>
      <a href="/" className="mt-4 px-8 py-3 bg-green-700 text-white rounded-xl font-bold text-sm">← Back to Home</a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline node wrapper (animated on scroll)
// ─────────────────────────────────────────────────────────────────────────────
function TNode({ icon: Icon, label, step, color = GREEN, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="relative pl-14 pr-4"
    >
      {/* Node icon */}
      <div className="absolute left-0 top-0 w-10 h-10 rounded-full border-[3px] border-green-200 bg-white flex items-center justify-center shadow-sm z-10"
        style={{ borderColor: color }}>
        <Icon size={17} style={{ color }} />
      </div>
      {/* Step label */}
      <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1"
        style={{ color }}>Step {step} — {label}</p>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small data row
// ─────────────────────────────────────────────────────────────────────────────
const DataRow = ({ label, value }) => value !== null && value !== undefined ? (
  <div className="flex justify-between items-start gap-3 py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 font-semibold flex-shrink-0">{label}</span>
    <span className="text-xs font-bold text-gray-800 text-right">{String(value)}</span>
  </div>
) : null;

// ─────────────────────────────────────────────────────────────────────────────
// Crop Photo Carousel
// ─────────────────────────────────────────────────────────────────────────────
function PhotoCarousel({ photos }) {
  const [idx, setIdx] = useState(0);
  if (!photos?.length) return (
    <div className="h-44 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 mb-3">
      <div className="text-center"><Leaf size={28} className="mx-auto mb-1 opacity-30" /><p className="text-xs">Crop photos will appear here</p></div>
    </div>
  );

  const photo = photos[idx];
  return (
    <div className="mb-3">
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        <img src={photo.url} alt={`Stage ${photo.stage}`} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
        {photos.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
            <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
              className="p-1.5 bg-black/40 text-white rounded-full disabled:opacity-30 backdrop-blur-sm active:scale-95 transition-transform">
              <ChevronLeft size={16} />
            </button>
            <span className="self-end text-[10px] font-bold text-white bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {idx + 1} / {photos.length}
            </span>
            <button onClick={() => setIdx(Math.min(photos.length - 1, idx + 1))} disabled={idx === photos.length - 1}
              className="p-1.5 bg-black/40 text-white rounded-full disabled:opacity-30 backdrop-blur-sm active:scale-95 transition-transform">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-xs text-gray-500 font-semibold mt-1.5">
        Stage {photo.stage} · {photo.completedAt ? new Date(photo.completedAt).toLocaleDateString('en-IN') : '—'}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accordion for lab details
// ─────────────────────────────────────────────────────────────────────────────
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mt-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-green-50 transition-colors">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && <div className="px-4 py-3 bg-white">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ConsumerTimeline() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/verify/${batchId}`)
      .then(res => { if (res.data?.success) setData(res.data.data); })
      .catch(err => setError(err.response?.data?.error || 'Failed to authenticate this product.'))
      .finally(() => setLoading(false));
  }, [batchId]);

  if (loading) return <SkeletonLoader />;
  if (error || !data) return <ErrorState message={error} />;

  const { product = {}, nodes = {}, speciesName } = data;
  const { farmOrigin, collectorVerification, labQuality, manufacturer } = nodes;

  const labPassed = labQuality?.finalDecision === 'PASS';

  return (
    <div className="min-h-screen bg-[#F7FBF7] pb-24 font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, ${LIGHT_GREEN} 100%)` }}>
        <Leaf size={220} className="absolute -right-8 -top-8 text-white opacity-[0.04]" />
        <div className="relative z-10 px-5 pt-12 pb-10 max-w-md mx-auto">

          {/* Trust badge */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full">
              <ShieldCheck size={14} />
              100% Traceable · Verified on AyuSethu
            </div>
          </div>

          {/* Product name */}
          <h1 className="text-3xl font-black text-white text-center leading-tight tracking-tight">
            {product.name || speciesName || 'Ayurvedic Botanical'}
          </h1>

          {/* Product type + price chips */}
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {product.type && (
              <span className="flex items-center gap-1 text-xs font-bold bg-white/15 border border-white/20 text-white px-3 py-1.5 rounded-full">
                <Pill size={11} /> {product.type}
              </span>
            )}
            {product.marketPrice != null && (
              <span className="flex items-center gap-1 text-xs font-bold bg-white/15 border border-white/20 text-green-100 px-3 py-1.5 rounded-full">
                <IndianRupee size={11} /> ₹{product.marketPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Composition */}
          {product.composition && (
            <p className="text-center text-white/70 text-xs mt-3 px-4 leading-relaxed">
              {product.composition}
            </p>
          )}

          {/* Final batch ID */}
          {product.finalBatchId && (
            <p className="text-center text-white/40 text-[10px] font-mono mt-3">{product.finalBatchId}</p>
          )}

          {/* Big shield */}
          <div className="flex justify-center mt-5">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck size={32} className="text-green-300" />
              <div>
                <p className="text-white font-black text-sm">AyuSethu Certified</p>
                <p className="text-white/60 text-xs">Supply chain immutably recorded</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto px-4 pt-8 relative">
        {/* Vertical line */}
        <div className="absolute left-[calc(1rem+20px)] top-8 bottom-8 w-0.5 bg-green-200 rounded-full" />

        <div className="space-y-10">

          {/* ── NODE 1: FARM ORIGIN ──────────────────────────────────────── */}
          {farmOrigin && (
            <TNode icon={MapPin} label="Farm Origin" step={1}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-2 border-b border-gray-50">
                  <p className="text-sm font-black text-gray-900">🌱 {speciesName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {farmOrigin.region}
                  </p>
                </div>
                <div className="px-4 pt-3 pb-1">
                  <DataRow label="Farm Size" value={farmOrigin.farmSize} />
                  <DataRow label="Irrigation" value={farmOrigin.irrigationType} />
                  <DataRow label="Soil Type" value={farmOrigin.soilType} />
                  <DataRow label="Estimated Qty" value={farmOrigin.estimatedQuantityKg ? `${farmOrigin.estimatedQuantityKg} Kg` : null} />
                </div>
                {farmOrigin.cropPhotos?.length > 0 && (
                  <div className="px-4 pb-4 pt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Field Progress Photos</p>
                    <PhotoCarousel photos={farmOrigin.cropPhotos} />
                  </div>
                )}
              </div>
            </TNode>
          )}

          {/* ── NODE 2: COLLECTOR / AI ───────────────────────────────────── */}
          {collectorVerification && (
            <TNode icon={Cpu} label="Collector Verification" step={2}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 pt-3 pb-1">
                  <DataRow label="Harvest Date" value={collectorVerification.harvestDate ? new Date(collectorVerification.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                  <DataRow label="Crop Yield" value={collectorVerification.estimatedYieldKg ? `${collectorVerification.estimatedYieldKg} Kg` : null} />
                </div>

                {/* AI verification badge */}
                {collectorVerification.aiVerification && (
                  <div className="mx-4 mb-4 mt-2 bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                    {collectorVerification.aiVerification.leafPhotoUrl && (
                      <img src={collectorVerification.aiVerification.leafPhotoUrl} alt="Leaf verification"
                        className="w-full h-36 object-cover border-b border-green-200"
                        onError={e => e.currentTarget.style.display = 'none'} />
                    )}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu size={14} className="text-green-700" />
                        <p className="text-xs font-black text-green-800 uppercase tracking-widest">AI Species Verified</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-green-900">
                          {collectorVerification.aiVerification.identifiedSpecies}
                        </p>
                        {collectorVerification.aiVerification.confidenceScore != null && (
                          <span className="text-xs font-black bg-green-700 text-white px-2 py-0.5 rounded-full">
                            {(collectorVerification.aiVerification.confidenceScore * 100).toFixed(1)}% match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TNode>
          )}

          {/* ── NODE 3: LAB QUALITY ──────────────────────────────────────── */}
          {labQuality && (
            <TNode icon={FlaskConical} label="Scientific Quality Assurance" step={3}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Grade banner */}
                <div className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 ${labPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lab Decision</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {labPassed
                        ? <CheckCircle2 size={18} className="text-green-700" />
                        : <XCircle size={18} className="text-red-500" />}
                      <span className={`text-base font-black ${labPassed ? 'text-green-800' : 'text-red-700'}`}>
                        {labQuality.finalDecision}
                      </span>
                    </div>
                  </div>
                  {labQuality.testDate && (
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tested On</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">
                        {new Date(labQuality.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-4 pt-3 pb-1">
                  <DataRow label="Testing Agency / Technician" value={labQuality.technicianName} />
                  {labQuality.labComments && (
                    <p className="text-xs text-gray-500 italic mt-2 mb-1">"{labQuality.labComments}"</p>
                  )}
                </div>

                {/* Detailed test results accordion */}
                <div className="px-4 pb-4">
                  <Accordion title="Identity & Physical Results">
                    <DataRow label="Color" value={labQuality.identity?.color} />
                    <DataRow label="Odor" value={labQuality.identity?.odor} />
                    <DataRow label="Taste" value={labQuality.identity?.taste} />
                    <DataRow label="Texture" value={labQuality.identity?.texture} />
                    <DataRow label="Foreign Matter %" value={labQuality.identity?.foreignMatterPercent} />
                  </Accordion>
                  <Accordion title="Physicochemical Results">
                    <DataRow label="Moisture %" value={labQuality.physicochemical?.moisturePercent} />
                    <DataRow label="Total Ash %" value={labQuality.physicochemical?.totalAsh} />
                    <DataRow label="Acid Insoluble Ash %" value={labQuality.physicochemical?.acidInsolubleAsh} />
                    <DataRow label="Alcohol Extract %" value={labQuality.physicochemical?.alcoholExtractPercent} />
                    <DataRow label="Water Extract %" value={labQuality.physicochemical?.waterExtractPercent} />
                    <DataRow label="pH Level" value={labQuality.physicochemical?.phLevel} />
                  </Accordion>
                  <Accordion title="Phytochemical Screening">
                    <DataRow label="Marker Compound" value={labQuality.phytochemical?.markerCompound} />
                    <DataRow label="Active Compound %" value={labQuality.phytochemical?.activeCompoundPercent} />
                    <DataRow label="Phenolic Content" value={labQuality.phytochemical?.phenolicContent} />
                    <DataRow label="Flavonoid Content" value={labQuality.phytochemical?.flavonoidContent} />
                  </Accordion>
                  <Accordion title="Microbial & Contaminant Tests">
                    <DataRow label="Total Plate Count" value={labQuality.microbial?.totalPlateCount} />
                    <DataRow label="Yeast & Mold" value={labQuality.microbial?.yeastMoldCount} />
                    <DataRow label="Salmonella" value={labQuality.microbial?.salmonella} />
                    <DataRow label="E. Coli" value={labQuality.microbial?.eColi} />
                    <DataRow label="Lead (ppm)" value={labQuality.microbial?.leadPpm} />
                    <DataRow label="Arsenic (ppm)" value={labQuality.microbial?.arsenicPpm} />
                  </Accordion>

                  {labQuality.pdfUrl && (
                    <a href={labQuality.pdfUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                      <FileText size={15} /> View Full Lab Certificate
                    </a>
                  )}
                </div>
              </div>
            </TNode>
          )}

          {/* ── NODE 4: MANUFACTURER ─────────────────────────────────────── */}
          {manufacturer && (
            <TNode icon={Factory} label="Formulation" step={4}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-xl">
                    <Factory size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manufactured by</p>
                    <p className="font-black text-gray-900 mt-0.5">{manufacturer.organizationName}</p>
                    {manufacturer.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {manufacturer.location}
                      </p>
                    )}
                    {manufacturer.manufacturingDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Produced: {new Date(manufacturer.manufacturingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TNode>
          )}

        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto px-4 mt-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <div className="flex justify-center mb-2">
            <ShieldCheck size={28} className="text-green-600" />
          </div>
          <p className="font-black text-gray-800">AyuSethu Supply Chain</p>
          <p className="text-xs text-gray-500 mt-1">Every node of this product's journey — from seed to shelf — is recorded and immutable.</p>
          <p className="text-[10px] text-gray-400 font-mono mt-3">
            Verified at {new Date(data.verifiedAt).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* ── STICKY BOTTOM ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-xs font-bold text-green-800">AyuSethu Verified</span>
          </div>
          <a href="https://ayusethu.com" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 font-semibold hover:text-green-700 transition-colors">
            ayusethu.com <ExternalLink size={10} />
          </a>
        </div>
      </div>

    </div>
  );
}
