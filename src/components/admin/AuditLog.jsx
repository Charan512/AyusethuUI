import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/api';
import { Loader2, FlaskConical, CheckCircle, XCircle, Hourglass } from 'lucide-react';

const ROLE_COLORS = {
  ADMIN:        'text-purple-400 bg-purple-950 border-purple-900',
  LAB:          'text-cyan-400 bg-cyan-950 border-cyan-900',
  MANUFACTURER: 'text-green-400 bg-green-950 border-green-900',
  COLLECTOR:    'text-blue-400 bg-blue-950 border-blue-900',
  FARMER:       'text-yellow-400 bg-yellow-950 border-yellow-900',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getAuditLog()
      .then(res => { if (res.data?.success) setLogs(res.data.data); })
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      AdminService.getAuditLog().then(res => { if (res.data?.success) setLogs(res.data.data); });
    }, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="bg-[#080d14] border border-blue-950 rounded-xl p-6 flex justify-center items-center py-16">
      <Loader2 size={28} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="bg-[#080d14] border border-blue-950 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-blue-950 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Global Audit Log</p>
          <p className="text-xs text-gray-600 mt-0.5">All major system events · Auto-refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-bold">LIVE</span>
        </div>
      </div>

      <div className="divide-y divide-blue-950/60 max-h-[480px] overflow-y-auto">
        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">No audit events yet.</div>
        )}
        {logs.map((log, i) => {
          const roleStyle = ROLE_COLORS[log.recipientRole] || 'text-gray-400 bg-gray-900 border-gray-800';
          const batch = log.batchId;
          return (
            <div key={log._id || i} className="px-5 py-3.5 flex items-start gap-4 hover:bg-blue-950/10 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                <FlaskConical size={15} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-snug">{log.message}</p>
                {batch && (
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {batch.batchId} · {batch.speciesName} · <span className="text-blue-500">{batch.status}</span>
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleStyle}`}>
                  → {log.recipientRole}
                </span>
                <span className="text-[10px] text-gray-600">{timeAgo(log.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
