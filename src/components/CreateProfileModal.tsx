import React, { useState } from 'react';
import { User, Briefcase, Mail, Sparkles, CheckCircle2, DollarSign, Award, X, Upload } from 'lucide-react';
import { UserRole } from '../types';

interface CreateProfileModalProps {
  onClose: () => void;
  onProfileCreated: (role: UserRole, profileData: any) => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onProfileCreated }) => {
  const [profileType, setProfileType] = useState<'mentee' | 'mentor'>('mentee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80');

  // Customer / Mentee fields
  const [learningGoals, setLearningGoals] = useState('');
  const [currentRole, setCurrentRole] = useState('Junior Developer');

  // Mentor fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [hourlyRate, setHourlyRate] = useState(120);
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState('');
  const [topics, setTopics] = useState('System Design, React, Tech Leadership');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (profileType === 'mentor') {
        const payload = {
          name,
          email,
          title,
          company,
          category,
          hourlyRate: Number(hourlyRate),
          experienceYears: Number(experienceYears),
          bio,
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
          topics: topics.split(',').map((t) => t.trim()).filter(Boolean),
        };

        const res = await fetch('/api/mentors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setSuccessMsg(true);
          setTimeout(() => {
            onProfileCreated('mentor', payload);
            onClose();
          }, 1200);
        }
      } else {
        // Customer Profile
        const payload = {
          name,
          email,
          currentRole,
          learningGoals,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
        };

        setSuccessMsg(true);
        setTimeout(() => {
          onProfileCreated('mentee', payload);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md animate-fade-in" id="create-profile-modal">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 px-6 py-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
            id="btn-close-profile-modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Create New Profile</h3>
              <p className="text-xs text-indigo-200">Join MentorPulse as a Customer (Mentee) or Expert Mentor</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 overflow-y-auto">
          {successMsg ? (
            <div className="py-10 text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {profileType === 'mentor' ? 'Mentor Application Submitted!' : 'Customer Profile Created!'}
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {profileType === 'mentor'
                  ? 'Your mentor application has been sent to Super Admin (maheshkhg55@gmail.com) for verification. Switching to mentor view...'
                  : 'Welcome to MentorPulse! You can now browse verified mentors, book 1:1 sessions, and track your career growth.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProfileType('mentee')}
                    className={`flex items-center gap-3 rounded-2xl p-3.5 border text-left transition-all ${
                      profileType === 'mentee'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                    id="type-customer-mentee"
                  >
                    <div className={`p-2 rounded-xl ${profileType === 'mentee' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Customer / Mentee</div>
                      <div className="text-[11px] text-slate-500">Book 1:1 mentorship sessions</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileType('mentor')}
                    className={`flex items-center gap-3 rounded-2xl p-3.5 border text-left transition-all ${
                      profileType === 'mentor'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                    id="type-expert-mentor"
                  >
                    <div className={`p-2 rounded-xl ${profileType === 'mentor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Expert Mentor</div>
                      <div className="text-[11px] text-slate-500">Monetize knowledge & offer guidance</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Shared Basic Info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      id="input-profile-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      id="input-profile-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar / Photo Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    id="input-profile-avatar"
                  />
                </div>
              </div>

              {/* Mentee Specific Fields */}
              {profileType === 'mentee' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                    Customer Details
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Job Title or Role</label>
                    <input
                      type="text"
                      placeholder="e.g., Software Engineer, Product Student, Founder"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      id="input-mentee-role"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Learning & Career Goals</label>
                    <textarea
                      rows={2}
                      placeholder="What are your main goals? (e.g., System Design prep, promotion to Senior Staff, Resume review)"
                      value={learningGoals}
                      onChange={(e) => setLearningGoals(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      id="input-mentee-goals"
                    />
                  </div>
                </div>
              )}

              {/* Mentor Specific Fields */}
              {profileType === 'mentor' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                    Expertise & Pricing
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="Principal Architect"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        id="input-mentor-title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        required
                        placeholder="Google / Stripe"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                        id="input-mentor-company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                        id="select-mentor-category"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="Design">Design</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Data & AI">Data & AI</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                        id="input-mentor-rate"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Exp (Years)</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                        id="input-mentor-exp"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Expertise Topics (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="System Design, Code Review, Career Growth"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                      id="input-mentor-topics"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of your experience, mentoring style, and how you help mentees..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-indigo-600 focus:outline-none"
                      id="input-mentor-bio"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 transition-all disabled:opacity-50"
                  id="btn-submit-create-profile"
                >
                  {isSubmitting
                    ? 'Creating Profile...'
                    : profileType === 'mentor'
                    ? 'Submit Mentor Application'
                    : 'Create Customer Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
