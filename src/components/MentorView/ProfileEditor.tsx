import React, { useState } from 'react';
import { MentorProfile } from '../../types';
import { Sparkles, Loader2, Save, CheckCircle, User, Briefcase, Globe, Award } from 'lucide-react';

interface ProfileEditorProps {
  mentor: MentorProfile;
  onSaveProfile: (updated: Partial<MentorProfile>) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  mentor,
  onSaveProfile,
}) => {
  const [title, setTitle] = useState(mentor.title);
  const [company, setCompany] = useState(mentor.company);
  const [bio, setBio] = useState(mentor.bio);
  const [fullBio, setFullBio] = useState(mentor.fullBio);
  const [expertiseStr, setExpertiseStr] = useState(mentor.expertise.join(', '));
  const [experienceYears, setExperienceYears] = useState(mentor.experienceYears);
  const [languagesStr, setLanguagesStr] = useState(mentor.languages.join(', '));
  const [linkedinUrl, setLinkedinUrl] = useState(mentor.linkedinUrl || '');

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          expertise: expertiseStr.split(',').map((s) => s.trim()),
          rawBio: fullBio || bio,
        }),
      });

      const data = await response.json();
      if (data.polishedBio) {
        setFullBio(data.polishedBio);
        setBio(data.polishedBio.substring(0, 160) + '...');
      }
    } catch (err) {
      console.error(err);
      alert('AI Bio enhancement failed.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      title,
      company,
      bio,
      fullBio,
      expertise: expertiseStr.split(',').map((s) => s.trim()).filter(Boolean),
      experienceYears: Number(experienceYears),
      languages: languagesStr.split(',').map((s) => s.trim()).filter(Boolean),
      linkedinUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Edit Mentor Profile</h2>
          <p className="text-xs text-slate-500">Update your headline, bio, and expertise tags</p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
          id="btn-save-profile"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              required
              id="input-mentor-title"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              required
              id="input-mentor-company"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Full Bio & Career Story</label>
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
              id="btn-enhance-bio-ai"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Polishing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Enhance Bio with Gemini AI</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={fullBio}
            onChange={(e) => {
              setFullBio(e.target.value);
              setBio(e.target.value.substring(0, 160));
            }}
            rows={5}
            className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none resize-none"
            required
            id="textarea-mentor-bio"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Expertise Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
            </label>
            <input
              type="text"
              value={expertiseStr}
              onChange={(e) => setExpertiseStr(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              id="input-mentor-expertise"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              id="input-mentor-years"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken</label>
            <input
              type="text"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              id="input-mentor-languages"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
              id="input-mentor-linkedin"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
