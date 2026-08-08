import React from 'react';
import { Search, Sparkles, Star, Users, CheckCircle, ShieldCheck } from 'lucide-react';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  onOpenAIMatchmaker: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenAIMatchmaker,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-200 border border-white/15 backdrop-blur-md mb-6">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Vetted Tech, Product & Executive Leaders</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
          Accelerate your career with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-amber-300">
            world-class 1-on-1 mentorship
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300">
          Connect with Staff Engineers, Product VPs, Design Principals and YC Founders for mock interviews, architecture reviews, and career coaching.
        </p>

        {/* Search Input Bar */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="relative flex items-center rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-900/10">
            <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, skills (e.g. System Design, Figma, Go, Stripe)..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
              id="hero-search-input"
            />
            <button
              onClick={onOpenAIMatchmaker}
              className="ml-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-indigo-600 transition-all shrink-0"
              id="btn-hero-ai-match"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI Matchmaker</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Metric Badges */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">1,200+</div>
              <div className="text-xs text-slate-400">Verified Mentors</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">4.96 / 5</div>
              <div className="text-xs text-slate-400">Avg Session Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">18,500+</div>
              <div className="text-xs text-slate-400">Sessions Booked</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">100% Secure</div>
              <div className="text-xs text-slate-400">Stripe Escrow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
