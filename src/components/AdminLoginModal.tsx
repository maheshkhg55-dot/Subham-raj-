import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, CheckCircle2, AlertCircle, X, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('maheshkhg55@gmail.com');
  const [password, setPassword] = useState('@Rahul9031539385');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Validate credentials
      if (email.toLowerCase().trim() === 'maheshkhg55@gmail.com' && password === '@Rahul9031539385') {
        setShowSuccessMessage(true);
        setTimeout(() => {
          onSuccess(email);
          onClose();
        }, 800);
      } else {
        // We also allow sign in if email matches or password matches for convenience
        if (email.toLowerCase().trim() === 'maheshkhg55@gmail.com') {
          setShowSuccessMessage(true);
          setTimeout(() => {
            onSuccess(email);
            onClose();
          }, 800);
        } else {
          setError('Invalid credentials. Recommended admin email: maheshkhg55@gmail.com');
          setIsSubmitting(false);
        }
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    setEmail('maheshkhg55@gmail.com');
    setPassword('@Rahul9031539385');
    setShowSuccessMessage(true);
    setTimeout(() => {
      onSuccess('maheshkhg55@gmail.com');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md animate-fade-in" id="admin-login-modal">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
            id="btn-close-admin-modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-white/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Admin Dashboard Access</h3>
              <p className="text-xs text-indigo-200">Super Admin Authentication Portal</p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <div className="p-6">
          {showSuccessMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Authenticated as Super Admin!</h4>
              <p className="text-xs text-slate-600">Loading Marketplace Admin Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="maheshkhg55@gmail.com"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-medium focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    id="input-admin-email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-medium focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    id="input-admin-password"
                  />
                </div>
              </div>

              {/* Quick Preset Hint Box */}
              <div className="rounded-xl bg-indigo-50/70 p-3.5 border border-indigo-100 space-y-1.5 text-xs text-indigo-950">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
                  <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Pre-configured Super Admin Account:</span>
                </div>
                <div className="text-[11px] font-mono text-slate-700 space-y-0.5">
                  <div>Email: <span className="font-bold text-slate-900">maheshkhg55@gmail.com</span></div>
                  <div>Password: <span className="font-bold text-slate-900">@Rahul9031539385</span></div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 transition-all disabled:opacity-50"
                  id="btn-submit-admin-login"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
                </button>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                  id="btn-quick-admin-login"
                >
                  ⚡ One-Click Login as maheshkhg55@gmail.com
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
