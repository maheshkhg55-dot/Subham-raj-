import React, { useState } from 'react';
import { MentorProfile } from '../../types';
import { Sparkles, X, Loader2, ArrowRight, CheckCircle, Bot, Zap } from 'lucide-react';

interface AIMatchmakerModalProps {
  allMentors: MentorProfile[];
  onClose: () => void;
  onSelectMentor: (mentor: MentorProfile) => void;
}

interface MatchResult {
  mentorId: string;
  matchScore: number;
  reasoning: string;
}

export const AIMatchmakerModal: React.FC<AIMatchmakerModalProps> = ({
  allMentors,
  onClose,
  onSelectMentor,
}) => {
  const [goals, setGoals] = useState('');
  const [currentRole, setCurrentRole] = useState('Senior Frontend Engineer');
  const [preferredCategory, setPreferredCategory] = useState('Software Engineering');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [aiAdvice, setAiAdvice] = useState('');

  const handleRunMatchmaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals.trim()) return;

    setIsAnalyzing(true);
    setMatchResults([]);

    try {
      const response = await fetch('/api/ai/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, currentRole, preferredCategory }),
      });

      const data = await response.json();
      setMatchResults(data.recommendations || []);
      setAiAdvice(data.aiAdvice || '');
    } catch (err) {
      console.error(err);
      alert('AI service error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl border border-indigo-500/30">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-400 text-white shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                MentorPulse AI Matchmaker
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  Gemini 3.6 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">Describe your career goal to get custom mentor matches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            id="btn-close-ai-matchmaker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleRunMatchmaker} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Your Current Role & Level
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. L5 Senior Engineer or Mid-level Product Designer"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                required
                id="ai-input-role"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                What are your biggest target goals or challenges?
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                placeholder="e.g. I want to pass a Staff Engineer interview loop at Stripe/Meta, master distributed system architecture, and get feedback on my system design proposal."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                required
                id="ai-input-goals"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
              id="btn-run-ai-match"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Gemini AI is analyzing mentor profiles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-bounce" />
                  <span>Find My Perfect Mentor Matches</span>
                </>
              )}
            </button>
          </form>

          {/* AI Output Results */}
          {matchResults.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
              {aiAdvice && (
                <div className="rounded-2xl bg-indigo-950/60 p-4 border border-indigo-800/60 text-xs text-indigo-200">
                  <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-300" />
                    AI Preparation Strategy
                  </div>
                  <p className="leading-relaxed">{aiAdvice}</p>
                </div>
              )}

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top AI Recommended Mentors
              </h3>

              <div className="space-y-3">
                {matchResults.map((result) => {
                  const mentor = allMentors.find((m) => m.id === result.mentorId);
                  if (!mentor) return null;

                  return (
                    <div
                      key={mentor.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/60 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{mentor.name}</h4>
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                              {result.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{mentor.title} at {mentor.company}</p>
                          <p className="text-[11px] text-slate-300 mt-1 italic leading-tight">
                            "{result.reasoning}"
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectMentor(mentor);
                          onClose();
                        }}
                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                        id={`btn-ai-select-${mentor.id}`}
                      >
                        <span>View Profile</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
