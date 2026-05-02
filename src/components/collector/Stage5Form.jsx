import React, { useState } from 'react';
import { CollectorService } from '../../services/api';
import { X, Upload, Loader2, CheckCircle, AlertCircle, Leaf } from 'lucide-react';

export default function Stage5Form({ batch, onClose, onSuccess }) {
  const farmer = batch?.farmerId;
  const [yield_, setYield] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { passed, species, confidence }
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { setError('A leaf photo is required for ML verification.'); return; }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('finalYieldKg', yield_);
      fd.append('geoTag', JSON.stringify({ lat: 0, lng: 0 }));
      fd.append('leafImage', image);

      const res = await CollectorService.verifyStage5(batch.batchId, fd);
      const mlResult = res.data?.data?.mlResult;
      const passed = mlResult?.verifiedSpecies?.toLowerCase().includes(
        (batch?.speciesName || '').toLowerCase().split(' ')[0]
      );
      setResult({
        passed: passed !== false,
        species: mlResult?.verifiedSpecies,
        confidence: (mlResult?.rawConfidenceScore * 100)?.toFixed(1),
      });
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (result) return (
    <div className="flex flex-col items-center py-8 gap-4 text-center">
      {result.passed ? (
        <><CheckCircle size={60} className="text-forest" />
          <p className="text-xl font-bold text-forest-dark">Verification Passed! ✓</p>
          <p className="text-gray-500">ML identified: <span className="font-bold text-forest">{result.species}</span> ({result.confidence}% confidence)</p>
          <p className="text-xs text-gray-400">Batch is now in the Godown. Admin & Lab have been notified.</p>
        </>
      ) : (
        <><AlertCircle size={60} className="text-red-500" />
          <p className="text-xl font-bold text-red-700">Verification Mismatch!</p>
          <p className="text-gray-500">ML identified: <span className="font-bold">{result.species}</span> — Expected: <span className="font-bold text-forest">{batch?.speciesName}</span></p>
          <p className="text-xs text-gray-400">Batch flagged for manual review.</p>
        </>
      )}
      <button onClick={onClose} className="mt-4 px-8 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Close</button>
    </div>
  );

  return (
    <div className="relative">
      <button onClick={onClose} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-700"><X size={20} /></button>

      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 bg-forest/10 rounded-lg"><Leaf size={18} className="text-forest" /></div>
        <h3 className="text-xl font-bold text-forest-dark">Stage 5 — Final Harvest & ML Verification</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Upload the crop leaf for <span className="font-semibold text-forest">AI species verification</span> before moving to Godown.
      </p>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5 text-sm text-amber-700 font-medium">
        ⚠️ Ensure you are physically present at the farm. This verification is permanent and triggers Lab notifications.
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-xs">Final Crop Yield (Kg)</label>
          <input type="number" step="0.1" value={yield_} onChange={e => setYield(e.target.value)} required placeholder="e.g. 450" className="input-field" />
        </div>

        <div>
          <label className="label-xs">Leaf Verification Photo — Take a clear close-up of 2-3 leaves</label>
          <label className="block border-2 border-dashed border-leaf/40 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-forest hover:bg-earth-bg transition-all">
            {preview ? (
              <img src={preview} alt="Leaf Preview" className="h-40 object-cover rounded-lg w-full" />
            ) : (
              <>
                <Upload size={32} className="text-leaf" />
                <span className="text-sm font-semibold text-gray-600">Upload Leaf Photo for ML Analysis</span>
                <span className="text-xs text-gray-400">JPG or PNG — Max 10MB</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Running ML Verification...</> : 'Submit & Verify Species'}
        </button>
      </form>

      <style>{`
        .input-field { width: 100%; padding: 0.625rem 0.875rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.625rem; outline: none; font-size: 0.9rem; transition: all 0.15s; }
        .input-field:focus { border-color: #2E5A27; box-shadow: 0 0 0 2px rgba(46,90,39,0.1); }
        .label-xs { display: block; font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.375rem; }
      `}</style>
    </div>
  );
}
