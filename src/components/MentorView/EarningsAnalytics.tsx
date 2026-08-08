import React, { useState } from 'react';
import { MentorProfile, BookingRequest } from '../../types';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface EarningsAnalyticsProps {
  mentor: MentorProfile;
  bookings: BookingRequest[];
}

const MONTHLY_EARNINGS_DATA = [
  { month: 'Mar', earnings: 420 },
  { month: 'Apr', earnings: 680 },
  { month: 'May', earnings: 950 },
  { month: 'Jun', earnings: 1100 },
  { month: 'Jul', earnings: 1350 },
  { month: 'Aug', earnings: 1440 },
];

export const EarningsAnalytics: React.FC<EarningsAnalyticsProps> = ({
  mentor,
  bookings,
}) => {
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [balance, setBalance] = useState(mentor.payoutBalance || 1260);

  const completed = bookings.filter((b) => b.status === 'completed' || b.status === 'accepted');
  const grossRevenue = completed.reduce((sum, b) => sum + b.pricePaid, 0);
  const netEarnings = Math.round(grossRevenue * 0.85);

  const handleInstantPayout = () => {
    if (balance <= 0) return;
    setPayoutLoading(true);

    setTimeout(() => {
      setPayoutLoading(false);
      setPayoutSuccess(true);
      setBalance(0);
      setTimeout(() => setPayoutSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Earnings & Stripe Payouts</h2>
          <p className="text-xs text-slate-500">Track mentorship revenues and direct bank deposits</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
          <CreditCard className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">Stripe Express Connected</span>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Available for Payout</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">${balance}.00</div>
          <div className="mt-4">
            <button
              onClick={handleInstantPayout}
              disabled={payoutLoading || balance <= 0}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
              id="btn-instant-payout"
            >
              {payoutSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Transfer Sent to Bank!</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Instant Stripe Payout (${balance})</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Lifetime Net Income</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">${netEarnings + 1260}.00</div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            After 15% platform commission
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Completed Sessions</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{mentor.sessionsCompleted}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            {mentor.totalMenteesCount} unique mentees taught
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Monthly Revenue Growth</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_EARNINGS_DATA}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip formatter={(val) => [`$${val}`, 'Monthly Net']} />
              <Area type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
