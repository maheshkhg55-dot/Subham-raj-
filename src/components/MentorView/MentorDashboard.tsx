import React from 'react';
import { MentorProfile, BookingRequest, TimeSlot } from '../../types';
import { IncomingRequestsList } from './IncomingRequestsList';
import { AvailabilityManager } from './AvailabilityManager';
import { ProfileEditor } from './ProfileEditor';
import { EarningsAnalytics } from './EarningsAnalytics';
import { UserCheck, Calendar, User, TrendingUp } from 'lucide-react';

interface MentorDashboardProps {
  mentor: MentorProfile;
  bookings: BookingRequest[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'accepted' | 'declined', reason?: string) => void;
  onSaveSchedule: (slots: TimeSlot[], rate: number) => void;
  onSaveProfile: (updated: Partial<MentorProfile>) => void;
  onOpenChat: (bookingId: string) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  mentor,
  bookings,
  activeTab,
  setActiveTab,
  onUpdateBookingStatus,
  onSaveSchedule,
  onSaveProfile,
  onOpenChat,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Mentor Profile Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-400/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{mentor.name}</h1>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                Mentor Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{mentor.title} at {mentor.company}</p>
          </div>
        </div>

        {/* Dashboard Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mentor-requests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mentor-requests' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
            id="tab-btn-requests"
          >
            <UserCheck className="h-4 w-4" />
            Requests
          </button>
          <button
            onClick={() => setActiveTab('mentor-schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mentor-schedule' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
            id="tab-btn-schedule"
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('mentor-profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mentor-profile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
            id="tab-btn-profile"
          >
            <User className="h-4 w-4" />
            Profile & AI Bio
          </button>
          <button
            onClick={() => setActiveTab('mentor-earnings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mentor-earnings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
            id="tab-btn-earnings"
          >
            <TrendingUp className="h-4 w-4" />
            Earnings
          </button>
        </div>
      </div>

      {/* Tab Render */}
      {activeTab === 'mentor-requests' && (
        <IncomingRequestsList
          bookings={bookings}
          onUpdateStatus={onUpdateBookingStatus}
          onOpenChat={onOpenChat}
        />
      )}

      {activeTab === 'mentor-schedule' && (
        <AvailabilityManager mentor={mentor} onSaveSlots={onSaveSchedule} />
      )}

      {activeTab === 'mentor-profile' && (
        <ProfileEditor mentor={mentor} onSaveProfile={onSaveProfile} />
      )}

      {activeTab === 'mentor-earnings' && (
        <EarningsAnalytics mentor={mentor} bookings={bookings} />
      )}
    </div>
  );
};
