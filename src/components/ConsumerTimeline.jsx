import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ShieldCheck, MapPin, FlaskConical, Link2, Factory, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export default function ConsumerTimeline() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Fetching Data
  useEffect(() => {
    setTimeout(() => {
      setData({
        batchId: batchId || 'CROP-700236',
        farmerName: 'Anonymous Network Partner',
        species: 'Withania somnifera (Ashwagandha)',
        mlConfidence: '99.2%',
        labCid: 'QmXY123labReport...',
        manufacturer: 'Dabur India Ltd.',
        finalizationDate: 'Feb 10, 2024',
        stages: [
          { stage: 1, name: 'The Seed', date: 'Oct 10, 2023', geo: '24.123, 76.543', photo: 'ipfs://QmStage1...' },
          { stage: 2, name: 'Sprouting', date: 'Nov 02, 2023', geo: '24.124, 76.543', photo: 'ipfs://QmStage2...' },
          { stage: 3, name: 'Vegetative', date: 'Dec 15, 2023', geo: '24.124, 76.544', photo: 'ipfs://QmStage3...' },
          { stage: 4, name: 'Flowering', date: 'Jan 10, 2024', geo: '24.125, 76.545', photo: 'ipfs://QmStage4...' },
        ],
        labResults: [
          { name: 'Loss on Drying (LOD)', value: '4.2%' },
          { name: 'Total Ash', value: '6.8%' },
          { name: 'Acid Insoluble Ash', value: '1.2%' },
          { name: 'Alcohol Soluble Extractive', value: '18.5%' },
          { name: 'Water Soluble Extractive', value: '22.1%' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-bg flex items-center justify-center flex-col space-y-4">
        <Leaf className="text-leaf animate-bounce" size={48} />
        <p className="text-forest font-bold tracking-widest text-sm uppercase">Authenticating Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-bg font-sans pt-10 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="bg-forest text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">Transparency Engine</h1>
             <p className="text-leaf tracking-wider uppercase text-xs sm:text-sm font-semibold inline-block bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
               Batch Trace: {data.batchId}
             </p>
           </div>
           <ShieldCheck size={140} className="absolute -right-6 -bottom-10 text-white opacity-10" />
        </div>

        {/* The Vertical Life-Cycle Timeline */}
        <div className="space-y-10 relative">
          <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-1 bg-green-200/50 rounded-full" />

          {/* Section 1: The Seed */}
          <TimelineBlock icon={Leaf} title="1. The Seed (Stage 1)">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 space-y-3">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Initial Origin</p>
                <h4 className="text-xl font-bold text-forest-dark">{data.farmerName}</h4>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{data.stages[0].date}</span>
                  <span className="flex items-center ml-4"><MapPin size={14} className="mr-1 text-leaf"/> {data.stages[0].geo}</span>
                </div>
              </div>
              <div className="w-full sm:w-32 h-32 bg-green-50 rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center text-green-600/50">
                <p className="text-xs font-bold text-center px-4 break-all">Farm Photo<br/>{data.stages[0].photo}</p>
              </div>
            </div>
          </TimelineBlock>

          {/* Section 2: The Growth (Stages 2-4) */}
          <TimelineBlock icon={Activity} title="2. The Growth (Stages 2-4)">
            <GrowthCarousel stages={data.stages.slice(1)} />
          </TimelineBlock>

          {/* Section 3: AI Validation (Stage 5) */}
          <TimelineBlock icon={ShieldCheck} title="3. AI Validation (Stage 5)">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-8 rounded-2xl border border-green-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={100} /></div>
               <p className="text-sm font-bold tracking-widest text-green-700 uppercase mb-2">Species Verified by AI</p>
               <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-4">{data.species}</h3>
               <div className="inline-flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-green-100">
                 <span className="text-sm font-bold text-gray-600 mr-3">Confidence Score</span>
                 <span className="text-lg font-black text-green-600">{data.mlConfidence}</span>
               </div>
            </div>
          </TimelineBlock>

          {/* Section 4: Lab Certification */}
          <TimelineBlock icon={FlaskConical} title="4. Lab Certification">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-earth-bg border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-xs">Parameter</th>
                     <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-xs text-right">Result</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {data.labResults.map((res, i) => (
                     <tr key={i} className="hover:bg-green-50/30 transition-colors">
                       <td className="px-6 py-4 font-semibold text-gray-800">{res.name}</td>
                       <td className="px-6 py-4 font-bold text-forest text-right">{res.value}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               <div className="p-6 bg-earth-bg/50 border-t border-gray-100 flex justify-end">
                 <a 
                   href={`https://gateway.pinata.cloud/ipfs/${data.labCid}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center bg-forest text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-forest-light transition-all text-sm"
                 >
                   <Link2 size={16} className="mr-2" /> View Original PDF
                 </a>
               </div>
             </div>
          </TimelineBlock>

          {/* Section 5: Final Product */}
          <TimelineBlock icon={Factory} title="5. Final Product">
             <div className="bg-forest-dark text-white p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <p className="text-sm text-leaf font-bold uppercase tracking-widest mb-1">Procured By</p>
                  <h3 className="text-2xl font-bold">{data.manufacturer}</h3>
                  <p className="text-sm mt-2 text-gray-300">Finalized: {data.finalizationDate}</p>
                </div>
                <div className="bg-white p-2 rounded-xl">
                   {/* QR Code Placeholder */}
                   <div className="w-20 h-20 bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                     <span className="text-[10px] font-bold">BASE64</span>
                     <span className="text-[10px] font-bold">QR</span>
                   </div>
                </div>
             </div>
          </TimelineBlock>

        </div>
      </div>
    </div>
  );
}

const TimelineBlock = ({ icon: Icon, title, children }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-16 sm:pl-24"
  >
    <div className="absolute left-0 top-1 w-12 h-12 bg-white border-4 border-green-200 text-forest rounded-full shadow-md flex items-center justify-center sm:left-4 z-10">
      <Icon size={20} />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-forest-dark mb-6">{title}</h2>
    {children}
  </motion.div>
);

const GrowthCarousel = ({ stages }) => {
  const [idx, setIdx] = useState(0);

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{stages[idx].name}</h4>
          <p className="text-sm text-gray-500 font-medium">{stages[idx].date} • Geo: {stages[idx].geo}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="p-2 bg-earth-bg rounded-lg disabled:opacity-50 text-forest hover:bg-green-100 transition"><ChevronLeft size={20}/></button>
          <button onClick={() => setIdx(Math.min(stages.length - 1, idx + 1))} disabled={idx === stages.length - 1} className="p-2 bg-earth-bg rounded-lg disabled:opacity-50 text-forest hover:bg-green-100 transition"><ChevronRight size={20}/></button>
        </div>
      </div>
      <div className="w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 break-all px-4 text-center">
        <span className="font-bold text-sm">Carousel Photo Slot</span>
        <span className="text-xs">{stages[idx].photo}</span>
      </div>
    </div>
  );
};
