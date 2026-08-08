import React, { useState } from 'react';
import { PlatformStats, MentorProfile, BookingRequest, User } from '../../types';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Search,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  stats: PlatformStats;
  mentors: MentorProfile[];
  bookings: BookingRequest[];
  users: User[];
  onApproveMentor: (mentorId: string, status: 'active' | 'suspended') => void;
  onUpdateBookingStatus: (bookingId: string, status: any) => void;
}

const WEEKLY_GMV_DATA = [
  { week: 'Wk 1', gmv: 6200, fee: 930 },
  { week: 'Wk 2', gmv: 8400, fee: 1260 },
  { week: 'Wk 3', gmv: 9800, fee: 1470 },
  { week: 'Wk 4', gmv: 12100, fee: 1815 },
  { week: 'Wk 5', gmv: 12450, fee: 1867 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  mentors,
  bookings,
  users,
  onApproveMentor,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'bookings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionRate, setCommissionRate] = useState(stats.platformCommissionPercent || 15);

  const pendingMentors = mentors.filter((m) => m.status === 'pending');
  const activeMentors = mentors.filter((m) => m.status === 'active');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Admin Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Marketplace Control Center</h1>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Platform telemetry, mentor vetting & dispute management</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="admin-tab-overview"
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'mentors' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="admin-tab-mentors"
          >
            Mentors Queue
            {pendingMentors.length > 0 && (
              <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[10px]">
                {pendingMentors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="admin-tab-bookings"
          >
            All Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Total Marketplace GMV</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18.4% vs last month</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Platform Commission ({commissionRate}%)</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">
            ${stats.platformEarnings.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Net platform revenue</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Active Mentors</span>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeMentors.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">{pendingMentors.length} pending review</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Total Sessions</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalBookings}</div>
          <div className="text-[11px] text-slate-400 mt-1">98.4% completion rate</div>
        </div>
      </div>

      {/* Tab Render */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Weekly Gross Marketplace Volume (GMV)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_GMV_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Volume']} />
                  <Bar dataKey="gmv" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="fee" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Settings */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              Platform Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Take-Rate Commission (%)
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Applied automatically on all Stripe booking payouts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Stripe Connect Status
              </div>
              <p className="text-[11px] leading-relaxed">
                Platform Stripe Connect account active. Auto-transfers enabled for verified mentors.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="space-y-6">
          {/* Pending Approval Section */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Pending Mentor Verification Queue ({pendingMentors.length})
              </h3>
            </div>

            {pendingMentors.length === 0 ? (
              <p className="text-xs text-slate-500">No pending mentor applications to review.</p>
            ) : (
              <div className="space-y-3">
                {pendingMentors.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="h-10 w-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.title} at {m.company}</div>
                        <div className="text-[11px] text-indigo-600 mt-0.5">${m.pricePerHour}/hr rate</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onApproveMentor(m.id, 'active')}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                        id={`btn-approve-mentor-${m.id}`}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve Profile
                      </button>
                      <button
                        onClick={() => onApproveMentor(m.id, 'suspended')}
                        className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                        id={`btn-reject-mentor-${m.id}`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Mentors List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Approved Mentors ({activeMentors.length})</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-3">Mentor</th>
                    <th className="p-3">Title & Company</th>
                    <th className="p-3">Hourly Rate</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeMentors.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <img src={m.avatar} alt="" className="h-7 w-7 rounded-lg object-cover" />
                        {m.name}
                      </td>
                      <td className="p-3">{m.title} ({m.company})</td>
                      <td className="p-3 font-bold">${m.pricePerHour}/hr</td>
                      <td className="p-3 font-semibold text-amber-600">{m.rating} ★</td>
                      <td className="p-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onApproveMentor(m.id, 'suspended')}
                          className="text-[11px] font-semibold text-rose-600 hover:underline"
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">All Marketplace Bookings ({bookings.length})</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Mentee</th>
                  <th className="p-3">Mentor</th>
                  <th className="p-3">Scheduled Date</th>
                  <th className="p-3">Amount Paid</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{b.id}</td>
                    <td className="p-3 font-semibold">{b.menteeName}</td>
                    <td className="p-3 font-semibold">{b.mentorName}</td>
                    <td className="p-3">{b.date} ({b.timeSlot})</td>
                    <td className="p-3 font-bold text-slate-900">${b.pricePaid}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          b.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'accepted')}
                          className="text-xs font-bold text-emerald-600 hover:underline mr-2"
                        >
                          Force Approve
                        </button>
                      )}
                      {b.paymentStatus === 'succeeded' && (
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'declined')}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Issue Stripe Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
