import React, { useState } from 'react';
import { CollectorService } from '../../services/api';
import { X, Upload, MapPin, Loader2, CheckCircle } from 'lucide-react';

export default function StageInitForm({ batch, onClose, onSuccess }) {
  const farmer = batch?.farmerId;
  const [form, setForm] = useState({
    seedBrand: '',
    timing: '',
    sizeAcres: '',
    location: farmer?.farmerProfile?.location || '',
    note: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('farmerId', farmer?._id || batch?.farmerId);
      fd.append('speciesName', batch?.speciesName || farmer?.farmerProfile?.crops?.[0] || 'Unknown');
      fd.append('irrigationType', farmer?.farmerProfile?.irrigationType || 'Unknown');
      fd.append('soilType', farmer?.farmerProfile?.soilType || 'Unknown');
      fd.append('estimatedQuantityKg', batch?.cultivationDetails?.estimatedQuantityKg || 0);
      fd.append('seedBrand', form.seedBrand);
      fd.append('timing', form.timing);
      fd.append('sizeAcres', form.sizeAcres);
      fd.append('location', form.location);
      fd.append('note', form.note);
      fd.append('geoTag', JSON.stringify({ lat: 0, lng: 0 }));
      if (image) fd.append('stageImage', image);

      await CollectorService.initBatch(fd);
      setDone(true);
      setTimeout(() => { onSuccess?.(); onClose?.(); }, 1500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="flex flex-col items-center py-12 gap-4">
      <CheckCircle size={56} className="text-forest" />
      <p className="text-xl font-bold text-forest-dark">Stage 1 Initiated!</p>
      <p className="text-gray-500 text-sm">The crop batch is now registered on the blockchain.</p>
    </div>
  );

  return (
    <div className="relative">
      <button onClick={onClose} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-700 transition-colors">
        <X size={20} />
      </button>

      <h3 className="text-xl font-bold text-forest-dark mb-1">Stage 1 — Crop Initiation</h3>
      <p className="text-sm text-gray-500 mb-6">
        Formally begin cultivation for <span className="font-semibold text-forest">{farmer?.name}</span>
      </p>

      {/* Pre-filled Info */}
      <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-earth-bg rounded-xl border border-leaf/20">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Farmer</p>
          <p className="font-semibold text-gray-800">{farmer?.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Crop</p>
          <p className="font-semibold text-gray-800">{batch?.speciesName || farmer?.farmerProfile?.crops?.[0] || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visit Date</p>
          <p className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Batch ID</p>
          <p className="font-semibold text-gray-800 font-mono">{batch?.batchId || '—'}</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-xs">Seed Brand</label>
            <input name="seedBrand" value={form.seedBrand} onChange={handleChange} required placeholder="e.g. Bayer CropScience" className="input-field" />
          </div>
          <div>
            <label className="label-xs">Timing</label>
            <input name="timing" value={form.timing} onChange={handleChange} required placeholder="e.g. Kharif Season 2025" className="input-field" />
          </div>
          <div>
            <label className="label-xs">Area Planted (acres)</label>
            <input name="sizeAcres" type="number" step="0.1" value={form.sizeAcres} onChange={handleChange} required placeholder="e.g. 2.5" className="input-field" />
          </div>
          <div>
            <label className="label-xs flex items-center gap-1"><MapPin size={12} />Location</label>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="Village / District" className="input-field" />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="label-xs">Field Photo</label>
          <label className="block border-2 border-dashed border-leaf/40 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-forest hover:bg-earth-bg transition-all">
            {preview ? (
              <img src={preview} alt="Preview" className="h-32 object-cover rounded-lg w-full" />
            ) : (
              <>
                <Upload size={28} className="text-leaf" />
                <span className="text-sm text-gray-500">Click to upload field image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="label-xs">Optional Note</label>
          <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="Any observations from the field..." className="input-field resize-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting to Blockchain...</> : 'Confirm Stage 1 Visit'}
        </button>
      </form>

      <style>{`
        .input-field { width: 100%; padding: 0.625rem 0.875rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.625rem; outline: none; font-size: 0.9rem; transition: border-color 0.15s; }
        .input-field:focus { border-color: #2E5A27; box-shadow: 0 0 0 2px rgba(46,90,39,0.1); }
        .label-xs { display: block; font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.375rem; }
      `}</style>
    </div>
  );
}
