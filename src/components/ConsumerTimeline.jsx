import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, FlaskConical, FileText, Factory, ChevronLeft, ChevronRight, Activity, Leaf, Home } from 'lucide-react';
import axios from 'axios';

export default function ConsumerTimeline() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
        const res = await axios.get(`${apiUrl}/verify/${batchId}`);
        if (res.data?.success) {
          setData(res.data.data);
          setTimeline(res.data.data.timeline || []);
        } else {
          setError('Timeline data not found.');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to authenticate this product.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center space-y-4">
        <Leaf className="text-[#2E7D32] animate-pulse" size={48} />
        <p className="text-[#2E7D32] font-bold tracking-widest text-sm uppercase">Authenticating Ledger...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <ShieldCheck className="text-red-500" size={64} />
        <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
        <p className="text-gray-500">{error || 'Invalid QR code or unverified product.'}</p>
        <button onClick={() => navigate('/')} className="mt-8 px-8 py-4 bg-[#2E7D32] text-white rounded-xl font-bold w-full max-w-sm">Back to Home</button>
      </div>
    );
  }

  const growthStages = timeline.filter(t => t.event?.startsWith('Crop Growth'));
  const aiStage = timeline.find(t => t.event === 'AI Species Verification');
  const labStage = timeline.find(t => t.event === 'Lab Quality Certification');
  const mfgStage = timeline.find(t => t.event === 'Product Manufacturing');

  const productName = mfgStage?.productName || data.speciesName || 'Ayurvedic Botanical';

  return (
    <div className="min-h-screen bg-[#FDFDFB] font-sans pb-28 relative">
      {/* 1. The Header */}
      <div className="bg-[#2E7D32] text-white p-8 pt-12 pb-16 shadow-lg rounded-b-[40px] relative overflow-hidden">
         <div className="relative z-10 flex flex-col items-center text-center">
           <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 inline-flex shadow-sm">
             <ShieldCheck size={40} className="text-white" />
           </div>
           <p className="text-green-100 font-bold uppercase tracking-widest text-xs mb-2">Verified Authentic</p>
           <h1 className="text-3xl font-extrabold tracking-tight mb-3 capitalize">{productName}</h1>
           <p className="text-white/80 tracking-wider text-sm font-semibold bg-black/20 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
             Batch ID: {data.batchId}
           </p>
         </div>
         <Leaf size={180} className="absolute -right-10 -bottom-10 text-white opacity-5" />
      </div>

      {/* Vertical Life-Cycle */}
      <div className="max-w-lg mx-auto w-full relative mt-10">
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-green-200 rounded-full" />

        <div className="space-y-12 pb-6">
          {/* Phase 1: Origin */}
          {growthStages.length > 0 && (
            <TimelineBlock icon={MapPin} title="Phase 1: Origin (Farmer)">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4 text-[#2E7D32]">
                  <MapPin size={18} />
                  <span className="font-bold text-sm">Grown in Anonymized Region</span>
                </div>
                <GrowthCarousel stages={growthStages} />
              </div>
            </TimelineBlock>
          )}

          {/* Phase 2: AI Validation */}
          {aiStage && (
            <TimelineBlock icon={Activity} title="Phase 2: AI Validation (Collector)">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                {aiStage.leafPhotoUrl ? (
                  <img src={aiStage.leafPhotoUrl} alt="Stage 5 Leaf Verification" className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-100 bg-gray-50" />
                ) : (
                  <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-xs font-bold text-center">Leaf Photo<br/>Processing...</span>
                  </div>
                )}
                <div className="bg-green-50 px-4 py-3 rounded-xl border border-green-200 text-center">
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Species Confirmed</p>
                  <p className="text-sm font-extrabold text-[#2E7D32] flex items-center justify-center">
                    <span>{aiStage.identifiedSpecies || data.speciesName}</span>
                    <span className="bg-white px-2 py-1 rounded text-xs shadow-sm ml-2">{(aiStage.confidenceScore * 100).toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </TimelineBlock>
          )}

          {/* Phase 3: Scientific Integrity (Lab) */}
          {labStage && (
            <TimelineBlock icon={FlaskConical} title="Phase 3: Scientific Integrity (Lab)">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-5 border-b border-gray-100 bg-gray-50 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Lab Certificate</p>
                    <p className="text-sm font-bold text-[#2E7D32] mt-1">Tested: {new Date(labStage.date).toLocaleDateString()}</p>
                 </div>
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <tbody className="divide-y divide-gray-50">
                     <tr className="hover:bg-green-50/30">
                       <td className="px-5 py-3 font-semibold text-gray-700 text-xs text-center pr-2">LOD</td>
                       <td className="px-5 py-3 font-bold text-[#2E7D32] text-center text-xs pl-2">{labStage.identityTests?.lod || '-'}%</td>
                     </tr>
                     <tr className="hover:bg-green-50/30">
                       <td className="px-5 py-3 font-semibold text-gray-700 text-xs text-center pr-2">Total Ash</td>
                       <td className="px-5 py-3 font-bold text-[#2E7D32] text-center text-xs pl-2">{labStage.identityTests?.totalAsh || '-'}%</td>
                     </tr>
                     <tr className="hover:bg-green-50/30">
                       <td className="px-5 py-3 font-semibold text-gray-700 text-xs text-center pr-2">Alc. Extractive</td>
                       <td className="px-5 py-3 font-bold text-[#2E7D32] text-center text-xs pl-2">{labStage.physicochemical?.alcoholExtractive || '-'}%</td>
                     </tr>
                     <tr className="hover:bg-green-50/30">
                       <td className="px-5 py-3 font-semibold text-gray-700 text-xs text-center pr-2">Water Ext.</td>
                       <td className="px-5 py-3 font-bold text-[#2E7D32] text-center text-xs pl-2">{labStage.physicochemical?.waterExtractive || '-'}%</td>
                     </tr>
                   </tbody>
                 </table>
                 {labStage.pdfReportUrl && (
                   <div className="p-4 border-t border-gray-100">
                     <a 
                       href={labStage.pdfReportUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full flex justify-center items-center bg-[#2E7D32] text-white px-5 py-4 rounded-xl font-bold shadow-md hover:bg-green-800 transition-all text-base"
                     >
                       <FileText size={20} className="mr-2" /> View Full Lab PDF
                     </a>
                   </div>
                 )}
               </div>
            </TimelineBlock>
          )}

          {/* Phase 4: Manufacturer */}
          {mfgStage && (
            <TimelineBlock icon={Factory} title="Phase 4: Manufacturer">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Procured & Packed By</p>
                  <h3 className="text-xl font-extrabold text-[#2E7D32]">{mfgStage.manufacturerName || 'Verified Manufacturer'}</h3>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Date of Packaging</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(mfgStage.date).toLocaleDateString()}</p>
                  </div>
               </div>
            </TimelineBlock>
          )}
        </div>
      </div>

      {/* 3. Mobile Optimization: Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 z-50">
         <button onClick={() => navigate('/')} className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center transition-colors text-lg">
            <Home size={24} className="mr-3" /> Back to Home
         </button>
      </div>
    </div>
  );
}

const TimelineBlock = ({ icon: Icon, title, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    className="relative pl-[60px] pr-6"
  >
    <div className="absolute left-[4px] top-1 w-10 h-10 bg-[#FDFDFB] border-[3px] border-green-200 text-[#2E7D32] rounded-full flex items-center justify-center z-10 shadow-sm">
      <Icon size={18} />
    </div>
    <h2 className="text-xl font-extrabold text-gray-800 mb-4 tracking-tight leading-none pt-2">{title}</h2>
    {children}
  </motion.div>
);

const GrowthCarousel = ({ stages }) => {
  const [idx, setIdx] = useState(0);
  const current = stages[idx];

  return (
    <div className="flex flex-col">
       <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden mb-3 relative border border-gray-100">
         {current.photoUrl ? (
           <img src={current.photoUrl} alt="Growth Stage" className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-400">
             <span className="text-xs font-bold text-center px-4">Photo unavailable<br/>Stage {idx + 1}</span>
           </div>
         )}
         <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="p-2 bg-black/40 text-white rounded-full disabled:opacity-30 backdrop-blur-md active:scale-95 transition-transform"><ChevronLeft size={20}/></button>
            <button onClick={() => setIdx(Math.min(stages.length - 1, idx + 1))} disabled={idx === stages.length - 1} className="p-2 bg-black/40 text-white rounded-full disabled:opacity-30 backdrop-blur-md active:scale-95 transition-transform"><ChevronRight size={20}/></button>
         </div>
       </div>
       <div className="text-center bg-gray-50 py-2 rounded-lg">
         <p className="text-sm font-bold text-gray-800">{current.event}</p>
         <p className="text-xs font-medium text-gray-500 mt-0.5">{new Date(current.date).toLocaleDateString()}</p>
       </div>
    </div>
  );
};
