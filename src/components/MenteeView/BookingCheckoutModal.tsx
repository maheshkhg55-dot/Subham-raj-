import React, { useState } from 'react';
import { MentorProfile, TimeSlot } from '../../types';
import {
  X,
  CreditCard,
  Lock,
  CheckCircle,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  Tag,
  ArrowRight,
  Download,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface BookingCheckoutModalProps {
  mentor: MentorProfile | null;
  selectedSlot?: TimeSlot;
  onClose: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  mentor,
  selectedSlot,
  onClose,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-15');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    selectedSlot ? selectedSlot.timeSlot : '10:00 AM - 11:00 AM'
  );
  const [sessionTopic, setSessionTopic] = useState('System Design & Career Growth');
  const [menteeNotes, setMenteeNotes] = useState('');

  // Stripe Payment Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [zip, setZip] = useState('94103');
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState('');

  if (!mentor) return null;

  const basePrice = mentor.pricePerHour;
  const platformFee = 5;
  const totalPrice = Math.max(0, basePrice + platformFee - discountAmount);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'MENTOR20') {
      setDiscountAmount(20);
      setCouponApplied(true);
    } else if (coupon.trim().toUpperCase() === 'VIP50') {
      setDiscountAmount(50);
      setCouponApplied(true);
    } else {
      alert('Invalid code. Try "MENTOR20" or "VIP50"');
    }
  };

  const handlePayAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menteeId: 'mentee_sarah',
          menteeName: 'Sarah Jenkins',
          menteeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
          menteeEmail: 'sarah.j@techstartup.io',
          mentorId: mentor.id,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          sessionTopic,
          menteeNotes,
        }),
      });

      const data = await response.json();
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
        setCompletedBookingId(data.booking.id);
      }, 1500); // realistic payment latency
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Stripe Checkout</h2>
              <p className="text-[11px] text-slate-500">256-bit AES Encrypted Payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            id="btn-close-checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <form onSubmit={handlePayAndBook} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Mentor Summary Header Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-indigo-700">60-Min 1-on-1 Session</div>
                <div className="text-base font-bold text-slate-900">{mentor.name}</div>
                <div className="text-xs text-slate-600 font-medium">{mentor.title} at {mentor.company}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900">${mentor.pricePerHour}</div>
                <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  100% Refundable
                </div>
              </div>
            </div>

            {/* Session Time & Topic Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                    required
                    id="checkout-input-date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:00 AM"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                    required
                    id="checkout-input-timeslot"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Topic / Goal</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. System Design Mock Interview or Senior Portfolio Review"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                required
                id="checkout-input-topic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notes for Mentor <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={menteeNotes}
                onChange={(e) => setMenteeNotes(e.target.value)}
                rows={2}
                placeholder="Share any background context or specific questions you want covered..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none resize-none"
                id="checkout-input-notes"
              />
            </div>

            {/* Stripe Card Form */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                  Payment Card
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">VISA</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">MC</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">AMEX</span>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                  id="checkout-card-number"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                  id="checkout-card-expiry"
                />
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                  id="checkout-card-cvc"
                />
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                  id="checkout-card-zip"
                />
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Promo Code (try MENTOR20)"
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  id="checkout-input-coupon"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                id="btn-apply-coupon"
              >
                Apply
              </button>
            </div>

            {/* Payment Summary breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>60-Min Mentor Session</span>
                <span>${basePrice}.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Stripe Escrow & Guarantee Fee</span>
                <span>${platformFee}.00</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount Applied</span>
                  <span>-${discountAmount}.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Due</span>
                <span>${totalPrice}.00 USD</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition-all disabled:opacity-70 cursor-pointer"
              id="btn-pay-stripe-submit"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Stripe Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Pay ${totalPrice}.00 with Stripe & Submit</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Confirmation Receipt State */
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Payment Authorized!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your booking request and ${totalPrice} payment hold have been transmitted to {mentor.name}.
              </p>
            </div>

            <div className="mx-auto max-w-md rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Booking Reference:</span>
                <span className="font-mono font-bold text-slate-900">{completedBookingId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Scheduled Time:</span>
                <span className="font-bold text-slate-900">{selectedDate} ({selectedTimeSlot})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-900">Stripe Escrow Card (**** 4242)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onBookingSuccess(completedBookingId);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
                id="btn-go-to-messages"
              >
                <MessageSquare className="h-4 w-4" />
                Open Direct Chat with {mentor.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
