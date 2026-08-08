import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_MENTORS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_USERS,
  INITIAL_REVIEWS,
  INITIAL_STATS,
} from './src/data/mockData';
import { MentorProfile, BookingRequest, ChatMessage, User, PlatformStats } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store
let mentorsStore: MentorProfile[] = [...INITIAL_MENTORS];
let bookingsStore: BookingRequest[] = [...INITIAL_BOOKINGS];
let messagesStore: ChatMessage[] = [...INITIAL_MESSAGES];
let usersStore: User[] = [...INITIAL_USERS];
let reviewsStore = [...INITIAL_REVIEWS];
let statsStore: PlatformStats = { ...INITIAL_STATS };

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// REST APIs

// 1. Mentors List
app.get('/api/mentors', (req, res) => {
  const { search, category, maxPrice, minRating, language, status, sortBy } = req.query;

  let filtered = [...mentorsStore];

  if (status) {
    filtered = filtered.filter((m) => m.status === status);
  } else {
    // default show active for mentees
    filtered = filtered.filter((m) => m.status === 'active');
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q))
    );
  }

  if (category && category !== 'All Categories') {
    filtered = filtered.filter((m) => m.categories.includes(category as string));
  }

  if (maxPrice) {
    const maxP = Number(maxPrice);
    if (!isNaN(maxP)) {
      filtered = filtered.filter((m) => m.pricePerHour <= maxP);
    }
  }

  if (minRating) {
    const minR = Number(minRating);
    if (!isNaN(minR)) {
      filtered = filtered.filter((m) => m.rating >= minR);
    }
  }

  if (language) {
    filtered = filtered.filter((m) =>
      m.languages.some((l) => l.toLowerCase() === (language as string).toLowerCase())
    );
  }

  // Sorting
  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'priceAsc') {
    filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else if (sortBy === 'priceDesc') {
    filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
  } else if (sortBy === 'experience') {
    filtered.sort((a, b) => b.experienceYears - a.experienceYears);
  } else {
    // Default popular / featured
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
  }

  res.json(filtered);
});

// Single Mentor
app.get('/api/mentors/:id', (req, res) => {
  const mentor = mentorsStore.find((m) => m.id === req.params.id);
  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }
  const mentorReviews = reviewsStore.filter((r) => r.mentorId === mentor.id);
  res.json({ ...mentor, reviews: mentorReviews });
});

// Update Mentor Profile
app.put('/api/mentors/:id', (req, res) => {
  const index = mentorsStore.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mentor not found' });
  }
  mentorsStore[index] = { ...mentorsStore[index], ...req.body };
  res.json(mentorsStore[index]);
});

// Create Mentor
app.post('/api/mentors', (req, res) => {
  const newMentor: MentorProfile = {
    id: 'm_' + Date.now(),
    userId: req.body.userId || 'user_' + Date.now(),
    name: req.body.name || 'New Mentor',
    title: req.body.title || 'Senior Specialist',
    company: req.body.company || 'Tech Leader',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
    bio: req.body.bio || '',
    fullBio: req.body.fullBio || '',
    categories: req.body.categories || ['Software Engineering'],
    expertise: req.body.expertise || ['General Guidance'],
    pricePerHour: req.body.pricePerHour || 100,
    languages: req.body.languages || ['English'],
    experienceYears: req.body.experienceYears || 5,
    rating: 5.0,
    reviewCount: 0,
    totalMenteesCount: 0,
    sessionsCompleted: 0,
    availableSlots: req.body.availableSlots || [],
    status: 'pending', // pending approval by admin
    payoutConnected: false,
    payoutBalance: 0,
  };
  mentorsStore.unshift(newMentor);
  statsStore.pendingMentors += 1;
  res.status(201).json(newMentor);
});

// Bookings
app.get('/api/bookings', (req, res) => {
  const { menteeId, mentorId } = req.query;
  let results = [...bookingsStore];
  if (menteeId) {
    results = results.filter((b) => b.menteeId === menteeId);
  }
  if (mentorId) {
    results = results.filter((b) => b.mentorId === mentorId);
  }
  res.json(results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

// Create Booking Request with Stripe Payment simulation
app.post('/api/bookings', (req, res) => {
  const { menteeId, menteeName, menteeAvatar, menteeEmail, mentorId, date, timeSlot, sessionTopic, menteeNotes, cardDetails } = req.body;

  const mentor = mentorsStore.find((m) => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  const pricePaid = mentor.pricePerHour;
  const platformFee = Math.round(pricePaid * 0.15); // 15% platform commission
  const paymentIntentId = 'pi_stripe_' + Math.random().toString(36).substring(2, 10);

  const newBooking: BookingRequest = {
    id: 'b_' + Date.now(),
    menteeId: menteeId || 'mentee_sarah',
    menteeName: menteeName || 'Sarah Jenkins',
    menteeAvatar: menteeAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    menteeEmail: menteeEmail || 'sarah.j@techstartup.io',
    mentorId: mentor.id,
    mentorName: mentor.name,
    mentorAvatar: mentor.avatar,
    date,
    timeSlot,
    durationMinutes: 60,
    sessionTopic: sessionTopic || '1-on-1 Mentorship Session',
    menteeNotes,
    pricePaid: pricePaid + 5, // Includes $5 processing
    platformFee,
    status: 'pending',
    createdAt: new Date().toISOString(),
    paymentIntentId,
    paymentStatus: 'succeeded',
  };

  bookingsStore.unshift(newBooking);

  // Send initial automated message into chat
  const welcomeMessage: ChatMessage = {
    id: 'msg_' + Date.now(),
    bookingId: newBooking.id,
    senderId: newBooking.menteeId,
    senderName: newBooking.menteeName,
    senderRole: 'mentee',
    recipientId: mentor.userId,
    text: `New Booking Request submitted for ${date} at ${timeSlot}. Topic: "${sessionTopic}". ${menteeNotes ? 'Note: ' + menteeNotes : ''}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  messagesStore.push(welcomeMessage);

  // Update platform stats
  statsStore.totalBookings += 1;
  statsStore.totalRevenue += newBooking.pricePaid;
  statsStore.platformEarnings += platformFee;

  res.status(201).json({ booking: newBooking, message: 'Payment authorized via Stripe & booking requested!' });
});

// Update Booking Status
app.patch('/api/bookings/:id', (req, res) => {
  const { status, declineReason } = req.body;
  const booking = bookingsStore.find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = status;
  if (declineReason) booking.declineReason = declineReason;

  if (status === 'accepted') {
    // Add system message
    messagesStore.push({
      id: 'msg_' + Date.now(),
      bookingId: booking.id,
      senderId: booking.mentorId,
      senderName: booking.mentorName,
      senderRole: 'mentor',
      recipientId: booking.menteeId,
      text: `🎉 Session request accepted! I look forward to meeting you on ${booking.date} at ${booking.timeSlot}.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    // Increment mentor stats
    const mentor = mentorsStore.find((m) => m.id === booking.mentorId);
    if (mentor) {
      mentor.sessionsCompleted += 1;
      mentor.totalMenteesCount += 1;
      mentor.payoutBalance += (booking.pricePaid - booking.platformFee);
    }
  } else if (status === 'declined') {
    booking.paymentStatus = 'refunded';
    messagesStore.push({
      id: 'msg_' + Date.now(),
      bookingId: booking.id,
      senderId: booking.mentorId,
      senderName: booking.mentorName,
      senderRole: 'mentor',
      recipientId: booking.menteeId,
      text: `Session declined. Reason: ${declineReason || 'Schedule conflict'}. A full Stripe refund has been issued to your payment method.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  }

  res.json(booking);
});

// Messages
app.get('/api/messages/:bookingId', (req, res) => {
  const msgs = messagesStore.filter((m) => m.bookingId === req.params.bookingId);
  res.json(msgs);
});

app.get('/api/messages', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json(messagesStore);
  const userMsgs = messagesStore.filter((m) => m.senderId === userId || m.recipientId === userId);
  res.json(userMsgs);
});

app.post('/api/messages', (req, res) => {
  const { bookingId, senderId, senderName, senderRole, recipientId, text, attachments } = req.body;
  const newMsg: ChatMessage = {
    id: 'msg_' + Date.now(),
    bookingId,
    senderId,
    senderName,
    senderRole,
    recipientId,
    text,
    timestamp: new Date().toISOString(),
    attachments: attachments || [],
    isRead: false,
  };
  messagesStore.push(newMsg);
  res.status(201).json(newMsg);
});

// Stripe Checkout Session Creation Simulation
app.post('/api/stripe/create-checkout-session', (req, res) => {
  const { mentorId, timeSlot, date } = req.body;
  const mentor = mentorsStore.find((m) => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  const sessionFee = mentor.pricePerHour;
  const stripeFee = 5.0; // $5 processing
  const totalAmount = sessionFee + stripeFee;

  res.json({
    sessionId: 'cs_stripe_' + Math.random().toString(36).substring(2, 10),
    clientSecret: 'pi_secret_' + Math.random().toString(36).substring(2, 12),
    mentorName: mentor.name,
    mentorTitle: mentor.title,
    date,
    timeSlot,
    sessionFee,
    stripeFee,
    totalAmount,
    currency: 'USD',
  });
});

// Gemini AI Matchmaker endpoint
app.post('/api/ai/matchmaker', async (req, res) => {
  try {
    const { goals, currentRole, preferredCategory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback matching logic if no API key set
      const top3 = mentorsStore.slice(0, 3);
      return res.json({
        recommendations: top3.map((m) => ({
          mentorId: m.id,
          matchScore: 95,
          reasoning: `Matched based on ${m.title} at ${m.company} and expertise in ${m.expertise.slice(0, 2).join(', ')}.`,
        })),
        aiAdvice: 'Focus on setting clear 60-day milestone goals before your initial session.',
      });
    }

    const mentorDataSummary = mentorsStore.map((m) => ({
      id: m.id,
      name: m.name,
      title: m.title,
      company: m.company,
      categories: m.categories,
      expertise: m.expertise,
      bio: m.bio,
      pricePerHour: m.pricePerHour,
      rating: m.rating,
    }));

    const prompt = `
You are an expert executive talent matchmaker for MentorPulse.
Given a mentee's request:
- Goals / Challenges: "${goals}"
- Current Role: "${currentRole}"
- Preferred Category: "${preferredCategory || 'Any'}"

Available Mentors Database:
${JSON.stringify(mentorDataSummary, null, 2)}

Pick the TOP 3 mentors that best match this mentee's needs.
Return strict valid JSON with this schema:
{
  "recommendations": [
    {
      "mentorId": "string ID from database",
      "matchScore": number between 85 and 99,
      "reasoning": "1-2 concise sentences explaining specifically why this mentor fits their career goals"
    }
  ],
  "aiAdvice": "2 sentences of advice on how the mentee can prepare for their first session to maximize ROI."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Matchmaker error:', err);
    res.status(500).json({ error: 'AI matching unavailable at the moment' });
  }
});

// Gemini AI Bio & Session Enhancer endpoint
app.post('/api/ai/generate-bio', async (req, res) => {
  try {
    const { title, company, expertise, rawBio } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        polishedBio: rawBio || `Senior ${title} at ${company} with extensive experience leading high-impact initiatives and coaching engineers.`,
        suggestedTopics: ['System Architecture Review', 'Career Growth Roadmap', 'Interview Prep'],
      });
    }

    const prompt = `
You are a top SaaS copywriter for high-earning mentors.
Refine and expand this mentor's profile bio into a compelling, professional SaaS mentor bio (around 80-120 words).

Mentor details:
- Title: ${title}
- Company: ${company}
- Expertise: ${Array.isArray(expertise) ? expertise.join(', ') : expertise}
- Existing Bio draft: ${rawBio || 'None'}

Return valid JSON with format:
{
  "polishedBio": "The engaging mentor bio string...",
  "suggestedTopics": ["Topic 1", "Topic 2", "Topic 3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Bio error:', err);
    res.status(500).json({ error: 'AI bio generator failed' });
  }
});

// Admin Stats & Management
app.get('/api/admin/stats', (req, res) => {
  res.json({
    ...statsStore,
    totalMentors: mentorsStore.length,
    activeMentors: mentorsStore.filter((m) => m.status === 'active').length,
    pendingMentors: mentorsStore.filter((m) => m.status === 'pending').length,
    totalUsers: usersStore.length + mentorsStore.length,
  });
});

app.patch('/api/admin/mentors/:id/status', (req, res) => {
  const { status } = req.body;
  const mentor = mentorsStore.find((m) => m.id === req.params.id);
  if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

  mentor.status = status;
  if (status === 'active') {
    mentor.badge = mentor.badge === 'Pending Review' ? 'Verified Mentor' : mentor.badge;
  }
  res.json(mentor);
});

// Vite Middleware & Static Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MentorPulse Marketplace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
