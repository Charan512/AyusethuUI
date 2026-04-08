import React, { useState } from 'react';
import { FileCheck, Activity, Microscope, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LabView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [batchId, setBatchId] = useState('');

  const [formData, setFormData] = useState({
    color: '', odour: '', taste: '', texture: '',
    lod: '', totalAsh: '', acidInsolubleAsh: '',
    alcoholExtractive: '', waterExtractive: '',
    alkaloids: false, flavonoids: false, steroids: false, 
    tannins: false, saponins: false, glycosides: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!batchId) {
      alert("Please enter a Batch ID");
      return;
    }
    setLoading(true);
    setSuccess('');
    
    try {
      const payload = {
        physicochemical: JSON.stringify({
          color: formData.color,
          odour: formData.odour,
          taste: formData.taste,
          texture: formData.texture,
          alcoholExtractive: formData.alcoholExtractive,
          waterExtractive: formData.waterExtractive
        }),
        identityTests: JSON.stringify({
          lod: formData.lod,
          totalAsh: formData.totalAsh,
          acidInsolubleAsh: formData.acidInsolubleAsh
        }),
        phytochemical: JSON.stringify({
          alkaloids: formData.alkaloids,
          flavonoids: formData.flavonoids,
          steroids: formData.steroids,
          tannins: formData.tannins,
          saponins: formData.saponins,
          glycosides: formData.glycosides
        }),
        technicianName: 'Network Partner Lab',
        testDate: new Date().toISOString().split('T')[0],
        finalDecision: 'APPROVED'
      };

      const submitData = new FormData();
      Object.keys(payload).forEach(key => submitData.append(key, payload[key]));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const token = localStorage.getItem('ayusethu_token');
      
      const res = await axios.post(`${apiUrl}/lab/batch/${batchId}/results`, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
         setSuccess(`PDF Report Generated & Pinned! IPFS CID: ${res.data.data.ipfs.cid.substring(0, 12)}...`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit lab results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative">
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
           <div className="p-4 bg-earth-bg rounded-2xl">
             <Microscope className="text-forest" size={32} />
           </div>
           <div>
             <h3 className="text-3xl font-extrabold text-forest-dark tracking-tight">Pharmacognostic Assessment</h3>
             <p className="text-gray-500 mt-1 font-medium">Capture comprehensive lab testing data according to AYUSH standards.</p>
           </div>
        </div>

        <form onSubmit={handleGenerateReport} className="space-y-12">
          
          <section>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Batch ID to Test</label>
              <input 
                type="text" required value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="e.g. CROP-123456"
                className="w-full sm:w-1/2 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none font-medium"
              />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3 mt-8">
              <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">1</span>
              <span>Physical Parameters</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Pale Green" />
              <InputCard label="Odour" name="odour" value={formData.odour} onChange={handleChange} placeholder="e.g. Characteristic" />
              <InputCard label="Taste" name="taste" value={formData.taste} onChange={handleChange} placeholder="e.g. Bitter" />
              <InputCard label="Texture" name="texture" value={formData.texture} onChange={handleChange} placeholder="e.g. Fine Powder" />
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">2</span>
               <span>Identity / Purity (%)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Loss on Drying (LOD)" name="lod" value={formData.lod} onChange={handleChange} type="number" step="0.01" />
              <InputCard label="Total Ash" name="totalAsh" value={formData.totalAsh} onChange={handleChange} type="number" step="0.01" />
              <InputCard label="Acid Insoluble Ash" name="acidInsolubleAsh" value={formData.acidInsolubleAsh} onChange={handleChange} type="number" step="0.01" />
            </div>
          </section>

           <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">3</span>
               <span>Extractive Values (%)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Alcohol Soluble Ext." name="alcoholExtractive" value={formData.alcoholExtractive} onChange={handleChange} type="number" step="0.01" />
              <InputCard label="Water Soluble Ext." name="waterExtractive" value={formData.waterExtractive} onChange={handleChange} type="number" step="0.01" />
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">4</span>
               <span>Phytochemical Screening</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <CheckboxCard label="Alkaloids" name="alkaloids" checked={formData.alkaloids} onChange={handleChange} />
              <CheckboxCard label="Flavonoids" name="flavonoids" checked={formData.flavonoids} onChange={handleChange} />
              <CheckboxCard label="Steroids" name="steroids" checked={formData.steroids} onChange={handleChange} />
              <CheckboxCard label="Tannins" name="tannins" checked={formData.tannins} onChange={handleChange} />
              <CheckboxCard label="Saponins" name="saponins" checked={formData.saponins} onChange={handleChange} />
              <CheckboxCard label="Glycosides" name="glycosides" checked={formData.glycosides} onChange={handleChange} />
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-8 border-t border-gray-200 gap-4">
            <div className="w-full sm:w-auto">
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-5 py-3 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center text-sm font-bold shadow-sm">
                  <FileCheck className="mr-3 text-green-600" size={20} /> {success}
                </motion.div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-3 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-forest hover:bg-forest-light hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <> <Activity className="animate-spin" size={20} /> <span>Generating PDF...</span> </>
              ) : (
                <> <UploadCloud size={20} /> <span>Generate Lab PDF & Pin</span> </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const InputCard = ({ label, name, value, onChange, type = "text", placeholder, step }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
    <input 
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} step={step}
      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none text-gray-800 transition-all shadow-sm font-medium"
      required={type === 'number'}
    />
  </div>
);

const CheckboxCard = ({ label, name, checked, onChange }) => (
  <label className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-forest hover:bg-green-50/30 transition-all shadow-sm group">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-6 h-6 accent-forest rounded cursor-pointer mb-3" />
    <span className="font-bold text-sm text-gray-700 text-center">{label}</span>
  </label>
);
