import React, { useState } from 'react';
import { MentorProfile, TimeSlot } from '../../types';
import {
  X,
  Star,
  Briefcase,
  Globe,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  Linkedin,
  Github,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface MentorDetailModalProps {
  mentor: MentorProfile | null;
  onClose: () => void;
  onProceedToBooking: (mentor: MentorProfile, slot?: TimeSlot, customDate?: string) => void;
}

export const MentorDetailModal: React.FC<MentorDetailModalProps> = ({
  mentor,
  onClose,
  onProceedToBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'schedule'>('overview');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  if (!mentor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        {/* Header Cover Banner */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-800 px-6 py-4 flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-all"
            id="btn-close-mentor-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mentor Basic Info Overlay */}
        <div className="px-6 sm:px-8 pb-4 -mt-12 sm:-mt-16 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{mentor.name}</h2>
                {mentor.badge && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                    {mentor.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium mt-1">
                <Briefcase className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{mentor.title}</span>
                <span>•</span>
                <span className="font-semibold text-slate-900">{mentor.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-slate-900">
                ${mentor.pricePerHour}
                <span className="text-xs font-medium text-slate-500"> / hour</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">{mentor.rating.toFixed(2)}</span>
                <span className="text-slate-400">({mentor.reviewCount} reviews)</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToBooking(mentor, selectedSlot || undefined)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
              id="btn-modal-book-direct"
            >
              <span>Book Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
            id="tab-mentor-overview"
          >
            Overview & Background
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
            id="tab-mentor-schedule-modal"
          >
            Available Slots ({mentor.availableSlots.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
            id="tab-mentor-reviews"
          >
            Mentee Reviews
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Full Bio */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  About {mentor.name}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {mentor.fullBio || mentor.bio}
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100/80">
                  <div className="text-xs text-indigo-700 font-medium">Experience</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{mentor.experienceYears}+ Years</div>
                </div>
                <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100/80">
                  <div className="text-xs text-emerald-700 font-medium">Sessions Taught</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{mentor.sessionsCompleted} Sessions</div>
                </div>
                <div className="rounded-2xl bg-purple-50/60 p-4 border border-purple-100/80">
                  <div className="text-xs text-purple-700 font-medium">Mentees Coached</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{mentor.totalMenteesCount}+ People</div>
                </div>
                <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-100/80">
                  <div className="text-xs text-amber-700 font-medium">Languages</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{mentor.languages.join(', ')}</div>
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Core Mentorship Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                {mentor.linkedinUrl && (
                  <a
                    href={mentor.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                {mentor.githubUrl && (
                  <a
                    href={mentor.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Select an Open Time Slot</div>
                    <div className="text-xs text-slate-600">All sessions are 60 minutes long via embedded video link</div>
                  </div>
                </div>
              </div>

              {mentor.availableSlots.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Calendar className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 font-medium">No pre-set weekly slots listed.</p>
                  <p className="text-xs text-slate-500 mt-1">You can still proceed to submit a custom booking request!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentor.availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedSlot?.id === slot.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/30'
                          : slot.isBooked
                          ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                      id={`modal-slot-${slot.id}`}
                    >
                      <div>
                        <div className="text-xs font-bold text-indigo-700">{slot.dayOfWeek}</div>
                        <div className="text-sm font-bold text-slate-900">{slot.timeSlot}</div>
                      </div>
                      <div className="text-right">
                        {slot.isBooked ? (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Booked</span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onProceedToBooking(mentor, selectedSlot || undefined)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
                  id="btn-confirm-slot-booking"
                >
                  <span>Continue with {selectedSlot ? selectedSlot.timeSlot : 'Custom Request'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">What Mentees Say</h3>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{mentor.rating.toFixed(2)} out of 5.0</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                        alt="Mentee"
                        className="h-8 w-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Alexis Miller</div>
                        <div className="text-[10px] text-slate-500">System Design Prep</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "Exceptionally valuable hour! Pinpointed architectural flaws in my distributed cache proposal and helped me structure my Staff Engineer promo deck."
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
                        alt="Mentee"
                        className="h-8 w-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Brandon Scott</div>
                        <div className="text-[10px] text-slate-500">Career Roadmap</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "Clear, structured, and no BS. Gave me actionable frameworks for navigating cross-functional stakeholder friction."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
