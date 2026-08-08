import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/MenteeView/HeroSearch';
import { MentorFilterSidebar } from './components/MenteeView/MentorFilterSidebar';
import { MentorCard } from './components/MenteeView/MentorCard';
import { MentorDetailModal } from './components/MenteeView/MentorDetailModal';
import { BookingCheckoutModal } from './components/MenteeView/BookingCheckoutModal';
import { AIMatchmakerModal } from './components/MenteeView/AIMatchmakerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { MentorDashboard } from './components/MentorView/MentorDashboard';
import { ChatDrawer } from './components/Messaging/ChatDrawer';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import {
  UserRole,
  MentorProfile,
  BookingRequest,
  ChatMessage,
  PlatformStats,
  TimeSlot,
  User,
} from './types';
import { MENTOR_CATEGORIES, INITIAL_MENTORS, INITIAL_BOOKINGS, INITIAL_MESSAGES, INITIAL_USERS, INITIAL_STATS } from './data/mockData';
import { Calendar, Clock, MessageSquare, CheckCircle, PlusCircle, ArrowRight, X } from 'lucide-react';

export default function App() {
  // Role & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('mentee');
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Data Stores
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [bookings, setBookings] = useState<BookingRequest[]>(INITIAL_BOOKINGS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [adminStats, setAdminStats] = useState<PlatformStats>(INITIAL_STATS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [maxPrice, setMaxPrice] = useState(300);
  const [minRating, setMinRating] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Modals & Drawers
  const [detailModalMentor, setDetailModalMentor] = useState<MentorProfile | null>(null);
  const [checkoutMentor, setCheckoutMentor] = useState<MentorProfile | null>(null);
  const [checkoutSlot, setCheckoutSlot] = useState<TimeSlot | undefined>(undefined);
  const [isAIMatchmakerOpen, setIsAIMatchmakerOpen] = useState(false);
  const [isApplyMentorOpen, setIsApplyMentorOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('maheshkhg55@gmail.com');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply Mentor Form State
  const [applyTitle, setApplyTitle] = useState('');
  const [applyCompany, setApplyCompany] = useState('');
  const [applyBio, setApplyBio] = useState('');
  const [applyPrice, setApplyPrice] = useState(120);

  // Fetch initial data from server APIs
  useEffect(() => {
    fetchMentors();
    fetchBookings();
    fetchMessages();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentors');
      if (res.ok) {
        const data = await res.json();
        setMentors(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtering Logic
  const filteredMentors = mentors.filter((m) => {
    if (m.status !== 'active') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory !== 'All Categories' && !m.categories.includes(selectedCategory)) {
      return false;
    }

    if (m.pricePerHour > maxPrice) return false;
    if (m.rating < minRating) return false;

    if (selectedLanguage !== 'All' && !m.languages.includes(selectedLanguage)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return a.pricePerHour - b.pricePerHour;
    if (sortBy === 'priceDesc') return b.pricePerHour - a.pricePerHour;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
  });

  // Current Logged-in User Context
  const currentUserId =
    currentRole === 'mentee' ? 'mentee_sarah' : currentRole === 'mentor' ? 'mentor_david' : 'admin_alex';
  const currentMentorProfile = mentors.find((m) => m.userId === 'mentor_david') || mentors[0];

  // Booking Status Handler
  const handleUpdateBookingStatus = async (bookingId: string, status: any, declineReason?: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, declineReason }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        showToast(status === 'accepted' ? 'Session confirmed!' : 'Booking status updated');
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (bookingId: string, recipientId: string, text: string, attachments?: any[]) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          senderId: currentUserId,
          senderName: currentRole === 'mentee' ? 'Sarah Jenkins' : currentRole === 'mentor' ? 'David Chen' : 'Admin',
          senderRole: currentRole,
          recipientId,
          text,
          attachments,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Mentor Availability
  const handleSaveSchedule = async (slots: TimeSlot[], rate: number) => {
    if (!currentMentorProfile) return;
    try {
      const res = await fetch(`/api/mentors/${currentMentorProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableSlots: slots, pricePerHour: rate }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMentors((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        showToast('Schedule & pricing updated successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Mentor Profile
  const handleSaveProfile = async (updated: Partial<MentorProfile>) => {
    if (!currentMentorProfile) return;
    try {
      const res = await fetch(`/api/mentors/${currentMentorProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const resData = await res.json();
        setMentors((prev) => prev.map((m) => (m.id === resData.id ? resData : m)));
        showToast('Profile bio and settings saved!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Apply as Mentor
  const handleApplyMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Jenkins',
          title: applyTitle || 'Senior Technical Specialist',
          company: applyCompany || 'Tech Corp',
          bio: applyBio,
          pricePerHour: applyPrice,
          userId: 'mentee_sarah',
        }),
      });

      if (res.ok) {
        const newMentor = await res.json();
        setMentors((prev) => [newMentor, ...prev]);
        setIsApplyMentorOpen(false);
        showToast('Mentor application submitted! Pending admin review.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Approve or Reject Mentor
  const handleApproveMentor = async (mentorId: string, status: 'active' | 'suspended') => {
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMentors((prev) => prev.map((m) => (m.id === mentorId ? updated : m)));
        showToast(status === 'active' ? 'Mentor profile approved!' : 'Mentor status updated');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => m.recipientId === currentUserId && !m.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-indigo-500/30 animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        pendingBookingsCount={pendingBookingsCount}
        onOpenAIMatchmaker={() => setIsAIMatchmakerOpen(true)}
        onBecomeMentor={() => setIsApplyMentorOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
        adminEmail={adminEmail}
      />

      {/* VIEW: Mentee Explore Marketplace */}
      {currentRole === 'mentee' && activeTab === 'explore' && (
        <main className="flex-1 pb-16 space-y-8">
          <HeroSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={MENTOR_CATEGORIES}
            onOpenAIMatchmaker={() => setIsAIMatchmakerOpen(true)}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <MentorFilterSidebar
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                sortBy={sortBy}
                setSortBy={setSortBy}
                languages={['English', 'Spanish', 'Mandarin', 'German', 'Hindi', 'French']}
                onReset={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setMaxPrice(300);
                  setMinRating(0);
                  setSelectedLanguage('All');
                  setSortBy('popular');
                }}
              />

              {/* Mentors Grid */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Showing {filteredMentors.length} Verified Mentors
                  </h2>
                  <span className="text-xs text-slate-500">
                    Sort: <span className="font-semibold text-slate-800">{sortBy}</span>
                  </span>
                </div>

                {filteredMentors.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                    <p className="text-base font-bold text-slate-800">No mentors match your search filters.</p>
                    <p className="text-xs text-slate-500 mt-1">Try relaxing price or category filters!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredMentors.map((m) => (
                      <MentorCard
                        key={m.id}
                        mentor={m}
                        onSelectMentor={(mentor) => setDetailModalMentor(mentor)}
                        onBookNow={(mentor) => {
                          setCheckoutMentor(mentor);
                          setCheckoutSlot(undefined);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: Mentee Bookings List */}
      {currentRole === 'mentee' && activeTab === 'my-bookings' && (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 flex-1 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Mentorship Sessions</h1>
              <p className="text-xs text-slate-500">Track session schedules, notes, and Stripe payment receipts</p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.mentorAvatar}
                    alt={b.mentorName}
                    className="h-12 w-12 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{b.mentorName}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{b.sessionTopic}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                      <span>{b.date} ({b.timeSlot})</span>
                      <span>•</span>
                      <span>${b.pricePaid} Paid via Stripe</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setActiveTab('messages');
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat with Mentor
                  </button>
                  <span
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${
                      b.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW: Mentor View */}
      {currentRole === 'mentor' && (
        <main className="flex-1">
          <MentorDashboard
            mentor={currentMentorProfile}
            bookings={bookings}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onSaveSchedule={handleSaveSchedule}
            onSaveProfile={handleSaveProfile}
            onOpenChat={() => setActiveTab('messages')}
          />
        </main>
      )}

      {/* VIEW: Direct Messages */}
      {activeTab === 'messages' && (
        <main className="flex-1">
          <ChatDrawer
            currentUserId={currentUserId}
            currentUserRole={currentRole}
            bookings={bookings}
            onSendMessage={handleSendMessage}
            messages={messages}
          />
        </main>
      )}

      {/* VIEW: Admin Dashboard */}
      {currentRole === 'admin' && activeTab === 'admin-dashboard' && (
        <main className="flex-1">
          <AdminDashboard
            stats={adminStats}
            mentors={mentors}
            bookings={bookings}
            users={INITIAL_USERS}
            onApproveMentor={handleApproveMentor}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        </main>
      )}

      {/* Modals */}
      {/* 1. Mentor Detail Modal */}
      {detailModalMentor && (
        <MentorDetailModal
          mentor={detailModalMentor}
          onClose={() => setDetailModalMentor(null)}
          onProceedToBooking={(mentor, slot) => {
            setDetailModalMentor(null);
            setCheckoutMentor(mentor);
            setCheckoutSlot(slot);
          }}
        />
      )}

      {/* 2. Stripe Checkout Modal */}
      {checkoutMentor && (
        <BookingCheckoutModal
          mentor={checkoutMentor}
          selectedSlot={checkoutSlot}
          onClose={() => setCheckoutMentor(null)}
          onBookingSuccess={(bookingId) => {
            fetchBookings();
            setActiveTab('messages');
            showToast('Booking and payment confirmed!');
          }}
        />
      )}

      {/* 3. AI Matchmaker Modal */}
      {isAIMatchmakerOpen && (
        <AIMatchmakerModal
          allMentors={mentors}
          onClose={() => setIsAIMatchmakerOpen(false)}
          onSelectMentor={(mentor) => setDetailModalMentor(mentor)}
        />
      )}

      {/* 4. Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={(email) => {
            setAdminEmail(email);
            setCurrentRole('admin');
            setActiveTab('admin-dashboard');
            showToast(`Logged in as Super Admin (${email})`);
          }}
        />
      )}

      {/* 5. Create Profile Modal (Mentee / Customer & Mentor) */}
      {isCreateProfileOpen && (
        <CreateProfileModal
          onClose={() => setIsCreateProfileOpen(false)}
          onProfileCreated={(role, data) => {
            if (role === 'mentor') {
              setCurrentRole('mentor');
              setActiveTab('mentor-requests');
              showToast(`Mentor Profile submitted for ${data.name}! Awaiting Super Admin approval.`);
            } else {
              setCurrentRole('mentee');
              setActiveTab('explore');
              showToast(`Customer Profile created for ${data.name}! Welcome to MentorPulse.`);
            }
          }}
        />
      )}

      {/* 4. Become Mentor Application Modal */}
      {isApplyMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-600" />
                Apply as a Mentor
              </h3>
              <button
                onClick={() => setIsApplyMentorOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyMentorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title & Role</label>
                <input
                  type="text"
                  value={applyTitle}
                  onChange={(e) => setApplyTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={applyCompany}
                  onChange={(e) => setApplyCompany(e.target.value)}
                  placeholder="e.g. Vercel / Stripe"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Desired Hourly Rate ($)</label>
                <input
                  type="number"
                  value={applyPrice}
                  onChange={(e) => setApplyPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Bio</label>
                <textarea
                  value={applyBio}
                  onChange={(e) => setApplyBio(e.target.value)}
                  rows={3}
                  placeholder="Describe your domain experience and topics you want to mentor..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                Submit Mentor Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            Mentor<span className="text-indigo-600">Pulse</span> SaaS Marketplace
          </div>
          <div>Powered by Express, Gemini 3.6 Flash & Stripe Payments</div>
          <div className="text-slate-400">© 2026 MentorPulse Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
