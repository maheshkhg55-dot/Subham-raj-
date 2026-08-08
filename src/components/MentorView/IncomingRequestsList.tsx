import React, { useState } from 'react';
import { BookingRequest } from '../../types';
import { Check, X, Calendar, Clock, DollarSign, MessageSquare, AlertCircle, FileText } from 'lucide-react';

interface IncomingRequestsListProps {
  bookings: BookingRequest[];
  onUpdateStatus: (bookingId: string, status: 'accepted' | 'declined', reason?: string) => void;
  onOpenChat: (bookingId: string) => void;
}

export const IncomingRequestsList: React.FC<IncomingRequestsListProps> = ({
  bookings,
  onUpdateStatus,
  onOpenChat,
}) => {
  const [declineModalBookingId, setDeclineModalBookingId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const acceptedBookings = bookings.filter((b) => b.status === 'accepted');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const handleConfirmDecline = () => {
    if (declineModalBookingId) {
      onUpdateStatus(declineModalBookingId, 'declined', declineReason);
      setDeclineModalBookingId(null);
      setDeclineReason('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Incoming Mentorship Requests</h2>
            <p className="text-xs text-slate-500">Accept or decline mentee session requests</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            {pendingBookings.length} Pending
          </span>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <Check className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-slate-800">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">No pending session requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm hover:border-amber-300 transition-all"
                id={`request-card-${b.id}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.menteeAvatar}
                    alt={b.menteeName}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{b.menteeName}</h3>
                      <span className="text-xs text-slate-500">({b.menteeEmail})</span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                      Topic: {b.sessionTopic}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {b.timeSlot}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <DollarSign className="h-3.5 w-3.5" />
                        ${b.pricePaid - b.platformFee} net payout
                      </span>
                    </div>

                    {b.menteeNotes && (
                      <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                        "{b.menteeNotes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onUpdateStatus(b.id, 'accepted')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
                    id={`btn-accept-${b.id}`}
                  >
                    <Check className="h-4 w-4" />
                    Accept Request
                  </button>
                  <button
                    onClick={() => setDeclineModalBookingId(b.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
                    id={`btn-decline-${b.id}`}
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Upcoming Sessions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Confirmed Upcoming Sessions</h2>
        {acceptedBookings.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No confirmed upcoming sessions yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.menteeAvatar}
                      alt={b.menteeName}
                      className="h-10 w-10 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{b.menteeName}</div>
                      <div className="text-xs text-slate-500">{b.sessionTopic}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl">
                  <span>{b.date}</span>
                  <span>{b.timeSlot}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenChat(b.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    id={`btn-chat-mentee-${b.id}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Open Chat
                  </button>
                  <button
                    onClick={() => onUpdateStatus(b.id, 'completed' as any)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {declineModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Decline Request</h3>
            <p className="text-xs text-slate-500">
              Please state why you are declining so we can notify the mentee and issue a full Stripe refund.
            </p>

            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
              placeholder="e.g. Schedule conflict or topic outside my expertise area..."
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeclineModalBookingId(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
                id="btn-confirm-decline-submit"
              >
                Confirm Decline & Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
