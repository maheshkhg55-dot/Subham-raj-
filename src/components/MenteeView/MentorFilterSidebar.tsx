import React from 'react';
import { Filter, DollarSign, Star, Globe, Clock, RotateCcw } from 'lucide-react';

interface MentorFilterSidebarProps {
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  languages: string[];
  onReset: () => void;
}

export const MentorFilterSidebar: React.FC<MentorFilterSidebarProps> = ({
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  selectedLanguage,
  setSelectedLanguage,
  sortBy,
  setSortBy,
  languages,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Filter className="h-4 w-4 text-indigo-600" />
          <span>Filter Mentors</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
          title="Reset Filters"
          id="btn-reset-filters"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Sort Results
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
          id="filter-sort-by"
        >
          <option value="popular">Popular & Top Rated</option>
          <option value="rating">Highest Rated (5.0)</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="experience">Most Experience (Years)</option>
        </select>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            Max Hourly Rate
          </span>
          <span className="text-indigo-600 font-bold">${maxPrice}/hr</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
          id="filter-price-range"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>$50/hr</span>
          <span>$300/hr</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[4.5, 4.8, 4.9].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold border transition-all ${
                minRating === rating
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              id={`filter-rating-${rating}`}
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Spoken Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
          id="filter-language"
        >
          <option value="All">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Value Proposition */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>Instant booking confirmation with Google Calendar integration.</span>
        </div>
        <div className="flex items-start gap-2">
          <Globe className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Full 100% money-back guarantee if not satisfied.</span>
        </div>
      </div>
    </aside>
  );
};
