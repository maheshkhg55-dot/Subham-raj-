import React from 'react';
import { UserRole } from '../types';
import {
  Sparkles,
  Search,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  Calendar,
  Zap,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  pendingBookingsCount: number;
  onOpenAIMatchmaker: () => void;
  onBecomeMentor: () => void;
  onOpenAdminLogin: () => void;
  onOpenCreateProfile: () => void;
  adminEmail: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  pendingBookingsCount,
  onOpenAIMatchmaker,
  onBecomeMentor,
  onOpenAdminLogin,
  onOpenCreateProfile,
  adminEmail,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            id="nav-logo"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Mentor<span className="text-indigo-600">Pulse</span>
              </span>
              <span className="ml-2 hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 sm:inline-block border border-indigo-100">
                PRO SaaS
              </span>
            </div>
          </button>

          {/* Role Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 text-sm font-medium border border-slate-200/60">
            {currentRole === 'mentee' && (
              <>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                    activeTab === 'explore'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id="tab-explore"
                >
                  <Search className="h-4 w-4 text-indigo-500" />
                  Find Mentors
                </button>
                <button
                  onClick={() => setActiveTab('my-bookings')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                    activeTab === 'my-bookings'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id="tab-my-bookings"
                >
                  <Calendar className="h-4 w-4 text-slate-500" />
                  My Bookings
                  {pendingBookingsCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {pendingBookingsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentRole === 'mentor' && (
              <>
                <button
                  onClick={() => setActiveTab('mentor-requests')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                    activeTab === 'mentor-requests'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id="tab-mentor-requests"
                >
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  Requests
                  {pendingBookingsCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                      {pendingBookingsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('mentor-schedule')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                    activeTab === 'mentor-schedule'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id="tab-mentor-schedule"
                >
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  Schedule & Availability
                </button>
                <button
                  onClick={() => setActiveTab('mentor-earnings')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                    activeTab === 'mentor-earnings'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  id="tab-mentor-earnings"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Earnings & Stripe
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-admin-dashboard"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Marketplace Admin Dashboard
              </button>
            )}
          </nav>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* AI Matchmaker Trigger Button */}
          {currentRole === 'mentee' && (
            <button
              onClick={onOpenAIMatchmaker}
              className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-50 to-amber-50 px-3.5 py-2 text-xs font-semibold text-indigo-900 border border-indigo-200/70 hover:border-indigo-300 hover:shadow-sm transition-all"
              id="btn-ai-matchmaker"
            >
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span>AI Matchmaker</span>
            </button>
          )}

          {/* Messages Trigger */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              activeTab === 'messages'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
            title="Messages"
            id="btn-messages"
          >
            <MessageSquare className="h-4 w-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Create Profile Button */}
          <button
            onClick={onOpenCreateProfile}
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
            id="btn-open-create-profile"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Profile</span>
          </button>

          {/* Become Mentor CTA */}
          {currentRole === 'mentee' && (
            <button
              onClick={onBecomeMentor}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              id="btn-become-mentor"
            >
              <PlusCircle className="h-3.5 w-3.5 text-indigo-600" />
              Apply as Mentor
            </button>
          )}

          {/* Admin Direct Login Button */}
          <button
            onClick={onOpenAdminLogin}
            className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'border-amber-300 bg-amber-50 text-amber-900 font-bold'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title="Admin Dashboard Login"
            id="btn-open-admin-login"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>{currentRole === 'admin' ? `Admin: ${adminEmail}` : 'Admin Login'}</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 text-xs text-white shadow-sm">
            <span className="hidden xl:inline-block px-2 text-[11px] text-slate-400 font-medium">
              Demo Role:
            </span>
            <button
              onClick={() => {
                onRoleChange('mentee');
                setActiveTab('explore');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                currentRole === 'mentee'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="switch-role-mentee"
            >
              Mentee
            </button>
            <button
              onClick={() => {
                onRoleChange('mentor');
                setActiveTab('mentor-requests');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                currentRole === 'mentor'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="switch-role-mentor"
            >
              Mentor
            </button>
            <button
              onClick={() => {
                onRoleChange('admin');
                setActiveTab('admin-dashboard');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="switch-role-admin"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
