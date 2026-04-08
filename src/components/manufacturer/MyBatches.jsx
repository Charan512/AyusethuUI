import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ManufacturerService } from '../../services/api';
import {
  Download, Package, Loader2, CheckCircle,
  X, IndianRupee, FlaskConical, ChevronDown, ExternalLink
} from 'lucide-react';

// ── Product Declaration Modal ─────────────────────────────────────────────────
function DeclarationModal({ batch, onClose, onSuccess }) {
  const [form, setForm] = useState({
    productName: '', productType: 'Capsule', composition: '', marketPrice: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.productType || !form.composition || !form.marketPrice) {
      setError('All fields are required.'); return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await ManufacturerService.finalizeAuction(batch.batchId, form);
      onSuccess(batch.batchId, res.data.data.finalProduct);
    } catch (err) {
      setError(err?.response?.data?.error || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  const LBL = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";
  const INP = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all bg-white";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-black">Product Declaration Form</p>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{batch.batchId} · {batch.speciesName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} className="text-gray-300" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className={LBL}>Product Name *</label>
            <input name="productName" value={form.productName} onChange={handleChange}
              placeholder="e.g. Ashwagandha Root Extract"
              className={INP} required />
          </div>

          <div>
            <label className={LBL}>Product Type *</label>
            <select name="productType" value={form.productType} onChange={handleChange} className={INP}>
              {['Capsule', 'Powder', 'Oil', 'Raw', 'Tablet'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={LBL}>Composition / Ingredients *</label>
            <textarea name="composition" value={form.composition} onChange={handleChange}
              placeholder="e.g. Withania somnifera root extract 500mg, Magnesium stearate 5mg…"
              rows={3}
              className={`${INP} resize-none`} required />
          </div>

          <div>
            <label className={LBL}>Market Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IndianRupee size={14} />
              </span>
              <input name="marketPrice" type="number" min="0" step="0.01"
                value={form.marketPrice} onChange={handleChange}
                placeholder="499.00"
                className={`${INP} pl-8`} required />
            </div>
          </div>

          {/* linking note */}
          <p className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            This declaration will be permanently linked to the full supply chain: <span className="font-semibold text-gray-600">Farmer → Collector → Lab → Manufacturer</span> and encoded in the QR certificate.
          </p>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" />Generating…</> : '🔒 Declare & Generate QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MyBatches({ batches, onRefresh }) {
  const [activeModal, setActiveModal] = useState(null); // batchId
  const [results, setResults] = useState({}); // batchId → finalProduct
  const canvasRefs = useRef({});

  const handleSuccess = (batchId, finalProduct) => {
    setResults(prev => ({ ...prev, [batchId]: finalProduct }));
    setActiveModal(null);
    onRefresh?.();
  };

  const handleDownloadQR = (batchId, productName) => {
    const canvas = canvasRefs.current[batchId];
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `AyuSethu-QR-${batchId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (batches.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <Package size={40} className="mx-auto mb-3 opacity-30" />
      <p className="font-semibold">No batches won yet.</p>
      <p className="text-sm mt-1">Win an auction to see your batches here.</p>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {batches.map(({ bid, batch, finalProduct: existingFP, labReport }) => {
          const batchId = batch?.batchId;
          const fp = results[batchId] || existingFP;
          const verifyUrl = fp?.verificationUrl || (fp?.finalBatchId
            ? `${window.location.origin}/verify/${fp.finalBatchId}`
            : null);

          return (
            <div key={bid._id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">

              {/* Batch summary row */}
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                <div>
                  <p className="font-bold text-gray-900">{batch?.speciesName}</p>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{batchId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Winning Bid</p>
                  <p className="text-sm font-bold text-green-700">₹{bid.bidAmount?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Lab Result</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    labReport?.finalDecision === 'PASS'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {labReport?.finalDecision || '—'}
                  </span>
                </div>
                <div className="flex justify-end">
                  {fp ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-700 font-bold">
                      <CheckCircle size={14} /> Product Declared
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveModal(batchId)}
                      className="flex items-center gap-1.5 text-xs font-bold border border-green-600 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                      <FlaskConical size={13} /> Generate Final Product
                    </button>
                  )}
                </div>
              </div>

              {/* Product details + QR — shown after declaration */}
              {fp && (
                <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                  {/* Declaration summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 mb-4">
                    <InfoCell label="Product Name" value={fp.productName} />
                    <InfoCell label="Type" value={fp.productType} />
                    <InfoCell label="Market Price" value={fp.marketPrice ? `₹${fp.marketPrice.toLocaleString('en-IN')}` : '—'} />
                    <InfoCell label="Final Batch ID" value={fp.finalBatchId} mono />
                  </div>
                  {fp.composition && (
                    <div className="mb-4 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Composition: </span>
                      {fp.composition}
                    </div>
                  )}

                  {/* QR code */}
                  {verifyUrl && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="bg-white p-3 border-2 border-gray-200 rounded-xl inline-block">
                        <QRCodeCanvas
                          ref={el => { if (el) canvasRefs.current[batchId] = el; }}
                          value={verifyUrl}
                          size={128}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Verification URL</p>
                        <p className="text-xs font-mono text-gray-500 break-all">{verifyUrl}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => handleDownloadQR(batchId, fp.productName)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                            <Download size={13} /> Download QR (PNG)
                          </button>
                          <a href={verifyUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            <ExternalLink size={12} /> Preview
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Declaration Modal */}
      {activeModal && (() => {
        const row = batches.find(r => r.batch?.batchId === activeModal);
        return row ? (
          <DeclarationModal
            batch={row.batch}
            onClose={() => setActiveModal(null)}
            onSuccess={handleSuccess}
          />
        ) : null;
      })()}
    </>
  );
}

const InfoCell = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
  </div>
);
