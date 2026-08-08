export type UserRole = 'mentee' | 'mentor' | 'admin';

export type UserStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  title?: string;
  company?: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  dayOfWeek: string; // e.g. 'Monday', 'Tuesday'
  timeSlot: string; // e.g. '09:00 AM - 10:00 AM'
  isBooked?: boolean;
}

export interface CustomSlotDate {
  date: string; // YYYY-MM-DD
  slots: {
    id: string;
    time: string;
    isBooked: boolean;
  }[];
}

export interface MentorProfile {
  id: string; // mentor ID (matches or links to userId)
  userId: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  fullBio: string;
  categories: string[];
  expertise: string[];
  pricePerHour: number;
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  badge?: string; // e.g. 'Verified Top 1%', 'Staff Engineer', 'VP Leader'
  totalMenteesCount: number;
  sessionsCompleted: number;
  availableSlots: TimeSlot[];
  customDates?: CustomSlotDate[];
  status: UserStatus;
  linkedinUrl?: string;
  githubUrl?: string;
  payoutConnected?: boolean;
  payoutBalance?: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface BookingRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  menteeEmail: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  date: string; // YYYY-MM-DD or display format
  timeSlot: string; // e.g., '10:00 AM - 11:00 AM'
  durationMinutes: number;
  sessionTopic: string;
  menteeNotes?: string;
  pricePaid: number;
  platformFee: number;
  status: BookingStatus;
  createdAt: string;
  paymentIntentId?: string;
  paymentStatus: 'succeeded' | 'refunded' | 'pending';
  declineReason?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  text: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: 'code' | 'document' | 'image';
  }[];
  isRead?: boolean;
}

export interface Review {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  rating: number;
  comment: string;
  date: string;
  sessionTopic: string;
}

export interface PlatformStats {
  totalRevenue: number;
  totalBookings: number;
  activeMentors: number;
  pendingMentors: number;
  totalMentees: number;
  platformEarnings: number;
  avgRating: number;
  platformCommissionPercent: number;
}
