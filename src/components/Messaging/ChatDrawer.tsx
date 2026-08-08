import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, BookingRequest, UserRole } from '../../types';
import {
  Send,
  Paperclip,
  Calendar,
  Clock,
  User,
  CheckCheck,
  FileText,
  Code,
  Image as ImageIcon,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface ChatDrawerProps {
  currentUserId: string;
  currentUserRole: UserRole;
  bookings: BookingRequest[];
  selectedBookingId?: string;
  onSendMessage: (bookingId: string, recipientId: string, text: string, attachments?: any[]) => void;
  messages: ChatMessage[];
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  currentUserId,
  currentUserRole,
  bookings,
  selectedBookingId,
  onSendMessage,
  messages,
}) => {
  const [activeBookingId, setActiveBookingId] = useState<string>(
    selectedBookingId || (bookings[0] ? bookings[0].id : '')
  );
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBookingId) {
      setActiveBookingId(selectedBookingId);
    }
  }, [selectedBookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeBookingId]);

  const activeBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0];
  const activeMessages = messages.filter((m) => m.bookingId === activeBookingId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;
    if (!activeBooking) return;

    const recipientId =
      currentUserRole === 'mentee' ? activeBooking.mentorId : activeBooking.menteeId;

    onSendMessage(activeBooking.id, recipientId, inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleAddMockAttachment = () => {
    setAttachments([
      ...attachments,
      {
        name: 'System_Design_Architecture_v1.pdf',
        url: '#',
        type: 'document',
      },
    ]);
  };

  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center bg-white rounded-3xl border border-slate-200 mt-8">
        <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Chat Conversations Yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Book a session with a mentor or accept an incoming request to start chatting!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[75vh] min-h-[550px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Sidebar Conversations List */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-100 flex flex-col bg-slate-50/70">
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="text-sm font-black text-slate-900">Direct Messages</h2>
            <p className="text-[11px] text-slate-500">Linked to mentorship sessions</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {bookings.map((b) => {
              const otherName = currentUserRole === 'mentee' ? b.mentorName : b.menteeName;
              const otherAvatar = currentUserRole === 'mentee' ? b.mentorAvatar : b.menteeAvatar;
              const isSelected = b.id === activeBookingId;

              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBookingId(b.id)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-indigo-600 shadow-xs' : 'hover:bg-slate-100/80'
                  }`}
                  id={`chat-thread-${b.id}`}
                >
                  <img
                    src={otherAvatar}
                    alt={otherName}
                    className="h-11 w-11 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{otherName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{b.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{b.sessionTopic}</p>
                    <span
                      className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        b.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Main Window */}
        {activeBooking && (
          <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentUserRole === 'mentee'
                      ? activeBooking.mentorAvatar
                      : activeBooking.menteeAvatar
                  }
                  alt="Avatar"
                  className="h-10 w-10 rounded-2xl object-cover ring-2 ring-indigo-50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentUserRole === 'mentee'
                      ? activeBooking.mentorName
                      : activeBooking.menteeName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-indigo-500" />
                      {activeBooking.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-500" />
                      {activeBooking.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                  {activeBooking.sessionTopic}
                </span>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
              {activeMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No messages yet. Send a greeting to kick off your mentorship preparation!
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span className="font-semibold text-slate-600">{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1">
                            {msg.attachments.map((att, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 rounded-xl p-2 text-[11px] font-semibold ${
                                  isMe ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="truncate">{att.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0">Quick reply:</span>
              <button
                type="button"
                onClick={() => setInputText('Looking forward to our call! Here is my project repo link.')}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                "Looking forward to our call!"
              </button>
              <button
                type="button"
                onClick={() => setInputText('Can you take a look at my draft architecture design before Wednesday?')}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                "Can you review my draft design?"
              </button>
            </div>

            {/* Attachments Pending Preview */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 bg-indigo-50/60 border-t border-indigo-100 flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700">Attachment:</span>
                {attachments.map((a, i) => (
                  <span key={i} className="text-xs font-medium text-slate-800 bg-white px-2 py-0.5 rounded border">
                    {a.name}
                  </span>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddMockAttachment}
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-xl hover:bg-slate-100"
                title="Attach Document or Code snippet"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message or share meeting preparation notes..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                id="chat-input-text"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors"
                id="btn-chat-send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
