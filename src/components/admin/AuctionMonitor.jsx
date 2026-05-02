import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/api';
import { Loader2, TrendingUp, Users, Package, IndianRupee, CheckCircle2, Clock } from 'lucide-react';

export default function AuctionMonitor() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    AdminService.getAuctionMonitor()
      .then(res => { if (res.data?.success) setAuctions(res.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="bg-[#061a0f] border border-green-900 rounded-xl p-6 flex justify-center items-center py-16">
      <Loader2 size={28} className="animate-spin text-green-500" />
    </div>
  );

  return (
    <div className="bg-[#061a0f] border border-green-900 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-green-900 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-green-300">Live Auction Monitor</p>
          <p className="text-xs text-gray-600 mt-0.5">{auctions.length} active auction{auctions.length !== 1 ? 's' : ''} · Auto-refreshes every 20s</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-bold">LIVE</span>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          No active auctions. Batches appear here after Lab certification.
        </div>
      ) : (
        <div className="divide-y divide-green-900/40">
          {auctions.map((item, i) => {
            const { batch, bids, highestBid, bidCount, qualityGrade, startingPrice } = item;
            const farmer = batch?.farmerId;
            const topBidder = highestBid?.manufacturerId?.name || '—';
            const topAmount = highestBid?.bidAmount;

            return (
              <div key={batch._id || i} className="px-5 py-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold">{batch.speciesName}</span>
                      <span className="text-xs font-mono text-green-600">{batch.batchId}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Farmer: {farmer?.name || '—'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded border flex-shrink-0 ${
                    qualityGrade === 'PASS' ? 'bg-green-950 text-green-400 border-green-800' : 'bg-gray-900 text-gray-400 border-gray-800'
                  }`}>
                    {qualityGrade === 'PASS' ? '✓ CERTIFIED' : qualityGrade}
                  </span>
                </div>

                {/* Bid Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <BidMetric
                    icon={<IndianRupee size={12} />}
                    label="Starting Price"
                    value={startingPrice > 0 ? `₹${startingPrice.toLocaleString('en-IN')}` : '—'}
                    color="text-green-300"
                  />
                  <BidMetric
                    icon={<TrendingUp size={12} />}
                    label="Highest Bid"
                    value={topAmount ? `₹${topAmount.toLocaleString('en-IN')}` : 'No bids yet'}
                    color={topAmount ? 'text-green-400 font-black' : 'text-gray-500'}
                  />
                  <BidMetric
                    icon={<Users size={12} />}
                    label="Top Bidder"
                    value={topBidder}
                    color="text-white"
                  />
                  <BidMetric
                    icon={<Package size={12} />}
                    label="Total Bids"
                    value={bidCount}
                    color="text-green-300"
                  />
                </div>

                {/* Bid List (top 3) */}
                {bids.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {bids.slice(0, 3).map((bid, j) => (
                      <div key={bid._id || j} className="flex items-center justify-between text-xs px-3 py-1.5 bg-green-950/30 border border-green-900/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {j === 0 ? <CheckCircle2 size={12} className="text-green-400" /> : <Clock size={12} className="text-gray-600" />}
                          <span className={j === 0 ? 'text-green-300 font-semibold' : 'text-gray-400'}>{bid.manufacturerId?.name || 'Manufacturer'}</span>
                          {bid.intendedProduct && <span className="text-gray-600 hidden sm:inline">· {bid.intendedProduct}</span>}
                        </div>
                        <span className={j === 0 ? 'text-green-400 font-bold' : 'text-gray-400'}>₹{bid.bidAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {bids.length > 3 && (
                      <p className="text-xs text-gray-600 text-center pt-1">+{bids.length - 3} more bids</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const BidMetric = ({ icon, label, value, color = 'text-white' }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1 mb-0.5">{icon}{label}</p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);
