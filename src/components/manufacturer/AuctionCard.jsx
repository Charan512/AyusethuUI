import React, { useState, useEffect, useRef } from 'react';
import { ManufacturerService } from '../../services/api';
import { IndianRupee, TrendingUp, Clock, FlaskConical, ChevronDown, ChevronUp, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// ── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(endsAt) {
  const [msLeft, setMsLeft] = useState(() => endsAt ? Math.max(0, new Date(endsAt) - Date.now()) : null);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => setMsLeft(Math.max(0, new Date(endsAt) - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (msLeft === null) return { display: '—', urgent: false, expired: false };
  const mins = Math.floor(msLeft / 60000);
  const secs = Math.floor((msLeft % 60000) / 1000);
  return {
    display: `${mins}:${String(secs).padStart(2, '0')}`,
    urgent: msLeft < 60000,
    expired: msLeft === 0,
  };
}

// ── Lab Report Modal ──────────────────────────────────────────────────────────
function LabModal({ report, onClose }) {
  if (!report) return null;
  const Section = ({ title, children }) => (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 rounded px-3 py-1.5 mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">{children}</div>
    </div>
  );
  const Row = ({ label, value }) => (
    <><p className="text-xs text-gray-500">{label}</p><p className="text-xs font-semibold text-gray-800">{value ?? '—'}</p></>
  );
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-green-700" />
            <h3 className="font-black text-gray-800">Lab Certification Report</h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${report.finalDecision === 'PASS' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-700 border-red-200'}`}>
            {report.finalDecision}
          </span>
        </div>
        <Section title="Identity Tests">
          <Row label="Color" value={report.identityTests?.color} />
          <Row label="Odor" value={report.identityTests?.odor} />
          <Row label="Taste" value={report.identityTests?.taste} />
          <Row label="Texture" value={report.identityTests?.texture} />
          <Row label="Foreign Matter" value={`${report.identityTests?.foreignMatterPercent ?? 0}%`} />
        </Section>
        <Section title="Physicochemical">
          <Row label="Moisture %" value={report.physicochemical?.moisturePercent} />
          <Row label="Total Ash %" value={report.physicochemical?.totalAsh} />
          <Row label="pH Level" value={report.physicochemical?.phLevel} />
          <Row label="Alcohol Extract %" value={report.physicochemical?.alcoholExtractPercent} />
          <Row label="Water Extract %" value={report.physicochemical?.waterExtractPercent} />
        </Section>
        <Section title="Phytochemical">
          <Row label="Marker Compound" value={report.phytochemical?.markerCompound} />
          <Row label="Active Compound %" value={report.phytochemical?.activeCompoundPercent} />
          <Row label="Phenolic Content" value={report.phytochemical?.phenolicContent} />
          <Row label="Flavonoid Content" value={report.phytochemical?.flavonoidContent} />
        </Section>
        <Section title="Contaminants">
          <Row label="Salmonella" value={report.contaminants?.salmonella} />
          <Row label="E. Coli" value={report.contaminants?.eColi} />
          <Row label="Lead (ppm)" value={report.contaminants?.leadPpm} />
          <Row label="Arsenic (ppm)" value={report.contaminants?.arsenicPpm} />
        </Section>
        {report.labComments && <p className="text-xs text-gray-500 mt-2 italic">"{report.labComments}"</p>}
        <button onClick={onClose} className="mt-4 w-full py-2 border border-gray-200 rounded text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
      </div>
    </div>
  );
}

// ── Main Auction Card ─────────────────────────────────────────────────────────
export default function AuctionCard({ auction, onBidPlaced }) {
  const { bids = [], highestBid, labReport, startingPrice, auctionEndsAt } = auction;
  const { display, urgent, expired } = useCountdown(auctionEndsAt);

  const [bidInput, setBidInput] = useState('');
  const [intendedProduct, setIntendedProduct] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const farmer = auction.farmerId;

  const currentTop = highestBid?.bidAmount || startingPrice || 0;

  const handleBid = async () => {
    if (!bidInput || !intendedProduct) { setError('Fill in both the bid amount and intended product.'); return; }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      await ManufacturerService.submitBid({
        cropBatchId: auction._id,
        bidAmount: parseFloat(bidInput),
        intendedProduct,
      });
      setSuccess(`Bid of ₹${parseFloat(bidInput).toLocaleString('en-IN')} placed!`);
      setBidInput(''); setIntendedProduct('');
      onBidPlaced?.();
    } catch (e) {
      setError(e?.response?.data?.error || 'Bid failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${expired ? 'border-gray-200 opacity-60' : urgent ? 'border-orange-300' : 'border-gray-200'}`}>
        {/* Header */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            <p className="font-black text-gray-900 text-base">{auction.speciesName}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{auction.batchId}</p>
            <p className="text-xs text-gray-500 mt-0.5">Farmer: {farmer?.name} · {farmer?.farmerProfile?.location || '—'}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {expired ? (
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-gray-200 text-gray-600">CLOSED</span>
            ) : (
              <div className={`text-2xl font-black tabular-nums ${urgent ? 'text-orange-500' : 'text-green-700'}`}>
                <Clock size={12} className="inline mr-1 mb-0.5" />{display}
              </div>
            )}
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Time Remaining</p>
          </div>
        </div>

        {/* Pricing row */}
        <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
          <Metric icon={<IndianRupee size={12} />} label="Starting Price" value={`₹${(startingPrice || 0).toLocaleString('en-IN')}`} />
          <Metric icon={<TrendingUp size={12} />} label="Highest Bid" value={currentTop ? `₹${currentTop.toLocaleString('en-IN')}` : 'No bids'} highlight />
          <Metric icon={<TrendingUp size={12} />} label="Total Bids" value={bids.length} />
        </div>

        {/* Top bids list */}
        {bids.length > 0 && (
          <div className="px-5 py-3 space-y-1.5 border-b border-gray-100">
            {bids.slice(0, 3).map((bid, i) => (
              <div key={bid._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white ${i === 0 ? 'bg-green-600' : 'bg-gray-400'}`}>{i + 1}</span>
                  <span className="text-gray-700 font-medium">{bid.manufacturerId?.name || 'Bidder'}</span>
                  <span className="text-gray-400">· {bid.intendedProduct}</span>
                </div>
                <span className={`font-bold ${i === 0 ? 'text-green-700' : 'text-gray-600'}`}>₹{bid.bidAmount?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
          {labReport && (
            <button onClick={() => setShowLab(true)}
              className="flex items-center gap-1.5 text-xs font-semibold border border-green-300 text-green-700 px-3 py-1.5 rounded hover:bg-green-50 transition-colors">
              <FlaskConical size={13} /> View Lab Results
            </button>
          )}
          {!expired && (
            <button onClick={() => setShowBidForm(!showBidForm)}
              className="flex items-center gap-1.5 text-xs font-bold bg-green-700 text-white px-4 py-1.5 rounded hover:bg-green-800 transition-colors ml-auto">
              {showBidForm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Place Bid
            </button>
          )}
        </div>

        {/* Bid form */}
        {showBidForm && !expired && (
          <div className="px-5 pb-4 space-y-3 border-t border-gray-100 pt-3">
            {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
            {success && <p className="text-xs text-green-700 flex items-center gap-1"><CheckCircle size={12} />{success}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bid Amount (₹) *</label>
                <input type="number" value={bidInput} onChange={e => setBidInput(e.target.value)}
                  placeholder={`Min ₹${currentTop + 1}`}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Intended Product *</label>
                <input type="text" value={intendedProduct} onChange={e => setIntendedProduct(e.target.value)}
                  placeholder="e.g. Ashwagandha Extract 500mg"
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
              </div>
            </div>
            <button onClick={handleBid} disabled={submitting}
              className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Confirm Bid'}
            </button>
          </div>
        )}
      </div>

      {showLab && <LabModal report={labReport} onClose={() => setShowLab(false)} />}
    </>
  );
}

const Metric = ({ icon, label, value, highlight }) => (
  <div>
    <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">{icon}{label}</p>
    <p className={`text-sm font-bold ${highlight ? 'text-green-700 text-base' : 'text-gray-800'}`}>{value}</p>
  </div>
);
