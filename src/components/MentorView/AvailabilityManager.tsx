import React, { useState } from 'react';
import { MentorProfile, TimeSlot } from '../../types';
import { Calendar, Plus, Trash2, Clock, CheckCircle, Save } from 'lucide-react';

interface AvailabilityManagerProps {
  mentor: MentorProfile;
  onSaveSlots: (updatedSlots: TimeSlot[], hourlyRate: number) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COMMON_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM',
];

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  mentor,
  onSaveSlots,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>(mentor.availableSlots || []);
  const [hourlyRate, setHourlyRate] = useState(mentor.pricePerHour || 140);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('10:00 AM - 11:00 AM');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSlot = () => {
    const existing = slots.find(
      (s) => s.dayOfWeek === selectedDay && s.timeSlot === selectedTime
    );
    if (existing) {
      alert('This slot is already added.');
      return;
    }

    const newSlot: TimeSlot = {
      id: 'slot_' + Date.now(),
      dayOfWeek: selectedDay,
      timeSlot: selectedTime,
      isBooked: false,
    };

    setSlots([...slots, newSlot]);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    onSaveSlots(slots, hourlyRate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manage Schedule & Pricing</h2>
          <p className="text-xs text-slate-500">Configure your weekly availability slots and session rates</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
          id="btn-save-schedule"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Pricing Input */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <label className="block text-xs font-bold text-slate-700">Hourly Mentorship Rate (USD)</label>
        <div className="flex items-center gap-3 max-w-xs">
          <span className="text-lg font-black text-slate-900">$</span>
          <input
            type="number"
            min="30"
            max="500"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-base font-extrabold text-slate-900 focus:border-indigo-500 focus:outline-none"
            id="input-hourly-rate"
          />
          <span className="text-xs font-medium text-slate-500">/ hour</span>
        </div>
      </div>

      {/* Add Slot Control */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Recurring Time Slot</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Day of Week</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
              id="select-slot-day"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time Slot</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
              id="select-slot-time"
            >
              {COMMON_TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddSlot}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              id="btn-add-slot"
            >
              <Plus className="h-4 w-4" />
              Add Time Slot
            </button>
          </div>
        </div>
      </div>

      {/* Configured Slots Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Active Slots ({slots.length})</h3>

        {slots.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No time slots configured. Add slots above so mentees can instantly book call times!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-indigo-700">{s.dayOfWeek}</div>
                  <div className="text-sm font-bold text-slate-900">{s.timeSlot}</div>
                </div>

                <button
                  onClick={() => handleRemoveSlot(s.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Remove Slot"
                  id={`btn-remove-slot-${s.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
