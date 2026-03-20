import React, { useState } from 'react';
import { FileCheck, Activity, Microscope, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LabView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('PDF Report successfully generated and pinned to IPFS (QmXa12B...)');
    }, 2500);
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
          
          {/* Section 1: Physical Parameters */}
          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">1</span>
              <span>Physical Parameters</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Color" placeholder="e.g. Pale Green" />
              <InputCard label="Odour" placeholder="e.g. Characteristic" />
              <InputCard label="Taste" placeholder="e.g. Bitter / Sweet" />
              <InputCard label="Texture" placeholder="e.g. Fine Powder" />
            </div>
          </section>

          {/* Section 2: Identity / Purity */}
          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">2</span>
               <span>Identity / Purity (%)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Loss on Drying (LOD)" type="number" step="0.01" />
              <InputCard label="Total Ash" type="number" step="0.01" />
              <InputCard label="Acid Insoluble Ash" type="number" step="0.01" />
            </div>
          </section>

          {/* Section 3: Extractive Values */}
           <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">3</span>
               <span>Extractive Values (%)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <InputCard label="Alcohol Soluble Ext." type="number" step="0.01" />
              <InputCard label="Water Soluble Ext." type="number" step="0.01" />
            </div>
          </section>

          {/* Section 4: Phytochemical */}
          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center space-x-3">
               <span className="w-8 h-8 rounded-full bg-forest text-white text-sm font-bold flex justify-center items-center shadow-md">4</span>
               <span>Phytochemical Screening</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-earth-bg/50 p-8 rounded-2xl border border-gray-100">
              <CheckboxCard label="Alkaloids" />
              <CheckboxCard label="Flavonoids" />
              <CheckboxCard label="Steroids" />
              <CheckboxCard label="Tannins" />
              <CheckboxCard label="Saponins" />
              <CheckboxCard label="Glycosides" />
            </div>
          </section>

          {/* Submission */}
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

const InputCard = ({ label, type = "text", placeholder, step }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      step={step}
      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none text-gray-800 transition-all shadow-sm font-medium"
      required
    />
  </div>
);

const CheckboxCard = ({ label }) => (
  <label className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-forest hover:bg-green-50/30 transition-all shadow-sm group">
    <input type="checkbox" className="w-6 h-6 accent-forest rounded cursor-pointer mb-3" />
    <span className="font-bold text-sm text-gray-700 text-center">{label}</span>
  </label>
);
