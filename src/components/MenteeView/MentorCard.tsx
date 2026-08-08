import React from 'react';
import { MentorProfile } from '../../types';
import { Star, ShieldCheck, Calendar, Briefcase, Globe, ArrowRight } from 'lucide-react';

interface MentorCardProps {
  mentor: MentorProfile;
  onSelectMentor: (mentor: MentorProfile) => void;
  onBookNow: (mentor: MentorProfile) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onSelectMentor,
  onBookNow,
}) => {
  return (
    <div
      onClick={() => onSelectMentor(mentor)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl cursor-pointer"
      id={`mentor-card-${mentor.id}`}
    >
      <div>
        {/* Header Avatar & Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-500/30 transition-all"
              referrerPolicy="no-referrer"
            />
            {mentor.featured && (
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm"
                title="Top Featured Mentor"
              >
                <Star className="h-3 w-3 fill-current" />
              </span>
            )}
          </div>

          <div className="text-right">
            <div className="text-xl font-extrabold text-slate-900">
              ${mentor.pricePerHour}
              <span className="text-xs font-medium text-slate-500">/hr</span>
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{mentor.rating.toFixed(2)}</span>
              <span className="text-slate-400">({mentor.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Title & Name */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {mentor.name}
            </h3>
            {mentor.badge && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100 shrink-0">
                {mentor.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-medium">
            <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{mentor.title}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-800 font-semibold">{mentor.company}</span>
          </div>
        </div>

        {/* Bio Preview */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Expertise Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {mentor.expertise.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200/60"
            >
              {skill}
            </span>
          ))}
          {mentor.expertise.length > 4 && (
            <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
              +{mentor.expertise.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>{mentor.languages.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            <span>{mentor.availableSlots.length > 0 ? `${mentor.availableSlots.length} slots open` : 'Flexible'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMentor(mentor);
            }}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            id={`btn-view-profile-${mentor.id}`}
          >
            View Profile
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(mentor);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            id={`btn-book-now-${mentor.id}`}
          >
            <span>Book Session</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
