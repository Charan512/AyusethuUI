import React, { useState, useEffect, useCallback } from 'react';
import { LabService } from '../../services/api';
import { Loader2, Inbox, CheckCircle2, Clock, FlaskConical, Package, RefreshCw, AlertTriangle } from 'lucide-react';

export default function JobBoard({ onOpenForm }) {
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [avRes, myRes] = await Promise.all([
        LabService.getAvailableSamples(),
        LabService.getMyBatches(),
      ]);
      if (avRes.data?.success) setAvailable(avRes.data.data);
      if (myRes.data?.success) setMine(myRes.data.data);
    } catch {
      setError('Failed to load samples. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAccept = async () => {
    setAccepting(true);
    setError('');
    try {
      await LabService.acceptBatch();
      await load(); // reload both lists
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not claim sample. Try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 size={28} className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* MY ASSIGNED BATCHES (ACTIVE) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">My Active Samples</h3>
          <button onClick={load} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <RefreshCw size={13} className="text-gray-500" />
          </button>
        </div>

        {mine.filter(m => m.batch.status === 'LAB_ASSIGNED').length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-8 text-center text-gray-400 mb-8">
            <Inbox size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No active samples require your attention right now.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {mine.filter(m => m.batch.status === 'LAB_ASSIGNED').map(({ batch, draftReport }) => {
              const farmer = batch?.farmerId;
              const hasDraft = !!draftReport;
              return (
                <div key={batch._id}
                  className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex items-start justify-between gap-4 flex-wrap shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-700 rounded-lg">
                      <FlaskConical size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{batch.speciesName}</span>
                        <span className="text-xs font-mono text-gray-400">{batch.batchId}</span>
                        {hasDraft && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded">
                            DRAFT SAVED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Farmer: <span className="font-semibold text-gray-700">{farmer?.name}</span>
                        {' · '}{farmer?.farmerProfile?.location || 'Unknown location'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenForm({ batch, draftReport })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded transition-colors flex-shrink-0 shadow-sm">
                    <FlaskConical size={13} />
                    {hasDraft ? 'Continue Entry Form' : 'Open Entry Form'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COMPLETED TESTS (HISTORY) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">Past Tested Samples (Log)</h3>
        {mine.filter(m => m.batch.status !== 'LAB_ASSIGNED').length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-6 text-center text-gray-400 mb-8">
            <p className="text-sm">No historical log found.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {mine.filter(m => m.batch.status !== 'LAB_ASSIGNED').map(({ batch }) => {
              const farmer = batch?.farmerId;
              const isAuction = ['IN_AUCTION', 'SOLD'].includes(batch.status);
              return (
                <div key={batch._id}
                  className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex items-start justify-between gap-4 flex-wrap opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-400 rounded-lg">
                      <CheckCircle2 size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{batch.speciesName}</span>
                        <span className="text-xs font-mono text-gray-500">{batch.batchId}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded flex items-center gap-1">
                          <CheckCircle2 size={10} /> TEST COMPLETED
                        </span>
                        {isAuction && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-300 rounded">
                            SENT TO MARKETPLACE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Farmer: <span className="font-semibold text-gray-700">{farmer?.name}</span>
                        {' · '}{farmer?.farmerProfile?.location || 'Unknown location'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AVAILABLE SAMPLES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            Available Samples
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{available.length}</span>
          </h3>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded flex items-center gap-2">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {available.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-10 text-center text-gray-400">
            <Package size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No samples in queue.</p>
            <p className="text-xs mt-1">Samples appear here after Admin releases them.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {available.map((batch, i) => {
              const farmer = batch?.farmerId;
              // First in queue gets the Accept button; rest show Queued
              const isFirst = i === 0;
              return (
                <div key={batch._id}
                  className={`border rounded-lg p-4 flex items-start justify-between gap-4 flex-wrap transition-all ${
                    isFirst ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-70'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isFirst ? 'bg-green-700' : 'bg-gray-400'}`}>
                      <Package size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{batch.speciesName}</span>
                        <span className="text-xs font-mono text-gray-400">{batch.batchId}</span>
                        {isFirst && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-800 border border-green-300 rounded">
                            NEXT IN QUEUE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Farmer: <span className="font-semibold text-gray-700">{farmer?.name}</span>
                        {' · '}{farmer?.farmerProfile?.location || '—'}
                        {' · '}<span className="font-mono">{batch.cultivationDetails?.estimatedQuantityKg || '—'} Kg</span>
                      </p>
                    </div>
                  </div>

                  {isFirst ? (
                    <button
                      onClick={handleAccept}
                      disabled={accepting}
                      className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded transition-colors disabled:opacity-60 flex-shrink-0">
                      {accepting ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      {accepting ? 'Claiming…' : 'Accept Sample'}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold flex-shrink-0">
                      <Clock size={12} /> Queued
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
