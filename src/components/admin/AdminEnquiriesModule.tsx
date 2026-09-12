'use client';

import React, { useState, useMemo } from 'react';
import { ContactEnquiry, InquiryType, EnquiryStatus } from '@/types/enquiry';
import { 
  Inbox, 
  Mail, 
  Star, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Trash2, 
  ExternalLink, 
  ChevronDown, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Check, 
  X,
  MessageSquare,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';

interface AdminEnquiriesModuleProps {
  enquiries: ContactEnquiry[];
  onRefresh: () => void;
}

const TYPE_CONFIG: Record<InquiryType, { label: string; color: string; bg: string; border: string }> = {
  review_pitch: {
    label: 'Hardware Review Pitch',
    color: 'text-tech-cyan',
    bg: 'bg-tech-cyan/10',
    border: 'border-tech-cyan/30',
  },
  press_release: {
    label: 'Press Briefing / Embargo',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  editorial_correction: {
    label: 'Correction / Feedback',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  advertising: {
    label: 'Sponsorship / Ad',
    color: 'text-tech-emerald',
    bg: 'bg-tech-emerald/10',
    border: 'border-tech-emerald/30',
  },
  general: {
    label: 'General Inquiry',
    color: 'text-slate-300',
    bg: 'bg-slate-800/50',
    border: 'border-slate-700',
  },
};

export default function AdminEnquiriesModule({
  enquiries,
  onRefresh,
}: AdminEnquiriesModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'starred' | 'replied'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.deviceOrCompany && item.deviceOrCompany.toLowerCase().includes(q)) ||
          item.message.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter === 'unread' && item.status !== 'unread') return false;
      if (statusFilter === 'starred' && !item.starred) return false;
      if (statusFilter === 'replied' && item.status !== 'replied') return false;

      // Type filter
      if (typeFilter !== 'all' && item.inquiryType !== typeFilter) return false;

      return true;
    });
  }, [enquiries, searchQuery, statusFilter, typeFilter]);

  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;
  const reviewPitchCount = enquiries.filter((e) => e.inquiryType === 'review_pitch').length;
  const sponsorshipCount = enquiries.filter((e) => e.inquiryType === 'advertising').length;
  const starredCount = enquiries.filter((e) => e.starred).length;

  // Actions
  const handleToggleStar = async (e: React.MouseEvent, enquiry: ContactEnquiry) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: !enquiry.starred }),
      });
      if (res.ok) {
        onRefresh();
        if (selectedEnquiry && selectedEnquiry.id === enquiry.id) {
          setSelectedEnquiry({ ...selectedEnquiry, starred: !enquiry.starred });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
        showFeedback(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesInput }),
      });
      if (res.ok) {
        onRefresh();
        setSelectedEnquiry({ ...selectedEnquiry, notes: notesInput });
        showFeedback('Internal notes saved successfully');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to permanently delete this contact inquiry?')) return;
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onRefresh();
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(null);
        }
        showFeedback('Inquiry deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = (enquiry: ContactEnquiry) => {
    setSelectedEnquiry(enquiry);
    setNotesInput(enquiry.notes || '');
    // Automatically mark as read if it was unread
    if (enquiry.status === 'unread') {
      handleUpdateStatus(enquiry.id, 'read');
    }
  };

  const handleMarkAllRead = async () => {
    const unreadList = enquiries.filter((e) => e.status === 'unread');
    if (unreadList.length === 0) return;
    
    await Promise.all(
      unreadList.map((e) =>
        fetch(`/api/enquiries/${e.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' }),
        })
      )
    );
    onRefresh();
    showFeedback('All enquiries marked as read');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Total Inquiries</span>
            <Inbox className="w-4 h-4 text-tech-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {enquiries.length}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Lifetime received</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Unread Messages</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono ${unreadCount > 0 ? 'text-tech-cyan animate-pulse' : 'text-slate-300'}`}>
            {unreadCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Awaiting response</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Hardware Pitches</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
            {reviewPitchCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Review units & loans</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Ad / Partnerships</span>
            <Building2 className="w-4 h-4 text-tech-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-tech-emerald">
            {sponsorshipCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Commercial campaigns</span>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-tech-emerald/15 border border-tech-emerald/40 text-tech-emerald text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-tech-900/40 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-tech-cyan text-tech-950 font-bold shadow-glow'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All ({enquiries.length})
          </button>

          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-tech-cyan text-tech-950 font-bold shadow-glow'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === 'unread' ? 'bg-tech-950 text-tech-cyan' : 'bg-tech-cyan/20 text-tech-cyan'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('starred')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'starred'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Starred ({starredCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('replied')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap ${
              statusFilter === 'replied'
                ? 'bg-tech-emerald text-tech-950 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Replied
          </button>
        </div>

        {/* Search & Type Filter & Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, company, message..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono rounded-xl bg-tech-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-tech-cyan"
          >
            <option value="all">All Inquiry Types</option>
            <option value="review_pitch">Hardware Pitches</option>
            <option value="press_release">Press Briefings</option>
            <option value="advertising">Sponsorships / Ads</option>
            <option value="editorial_correction">Corrections</option>
            <option value="general">General</option>
          </select>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition border border-slate-700 flex items-center gap-1.5"
              title="Mark all unread enquiries as read"
            >
              <Check className="w-3.5 h-3.5 text-tech-emerald" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition border border-slate-700"
            title="Refresh Inbox"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enquiries Feed */}
      {filteredEnquiries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-tech-900/30 border border-slate-800 space-y-3">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No messages matched your filter criteria. Try resetting filters.'
              : 'The contact inquiry inbox is clear. Messages submitted through the public contact form will land here instantly.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80 rounded-3xl bg-tech-900/40 border border-slate-800 overflow-hidden">
          {filteredEnquiries.map((enquiry) => {
            const isUnread = enquiry.status === 'unread';
            const typeInfo = TYPE_CONFIG[enquiry.inquiryType] || TYPE_CONFIG.general;
            const dateStr = new Date(enquiry.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={enquiry.id}
                onClick={() => handleOpenDetail(enquiry)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition group ${
                  isUnread
                    ? 'bg-tech-950/80 hover:bg-tech-900/90 border-l-4 border-l-tech-cyan'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Left: Star, Avatar & Sender Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Star Toggle */}
                  <button
                    onClick={(e) => handleToggleStar(e, enquiry)}
                    className="mt-0.5 sm:mt-0 p-1 rounded-lg text-slate-500 hover:text-amber-400 transition shrink-0"
                    title={enquiry.starred ? 'Starred' : 'Mark as star'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        enquiry.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>

                  {/* Sender Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 font-mono shrink-0 group-hover:border-tech-cyan/50 transition">
                    {enquiry.name.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Sender Name, Type, Snippet */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                        {enquiry.name}
                      </span>

                      {enquiry.deviceOrCompany && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-slate-700/80 text-slate-300">
                          {enquiry.deviceOrCompany}
                        </span>
                      )}

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${typeInfo.bg} ${typeInfo.color} ${typeInfo.border}`}>
                        {typeInfo.label}
                      </span>

                      {enquiry.notes && (
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20" title={enquiry.notes}>
                          Has Notes
                        </span>
                      )}
                    </div>

                    <p className={`text-xs truncate max-w-2xl ${isUnread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                      {enquiry.message}
                    </p>
                  </div>
                </div>

                {/* Right: Date, Status, Quick Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                  <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                    {dateStr}
                  </span>

                  {/* Status Pill */}
                  {enquiry.status === 'unread' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tech-cyan animate-pulse"></span>
                      <span>NEW</span>
                    </span>
                  )}
                  {enquiry.status === 'replied' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-tech-emerald bg-tech-emerald/10 border border-tech-emerald/30">
                      REPLIED
                    </span>
                  )}
                  {enquiry.status === 'read' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5 border border-slate-700">
                      READ
                    </span>
                  )}

                  {/* Reply via email mailto */}
                  <a
                    href={`mailto:${enquiry.email}?subject=Re: [GenZ Time] ${typeInfo.label} - ${enquiry.deviceOrCompany || enquiry.name}&body=Hi ${enquiry.name},%0D%0A%0D%0AThank you for contacting GenZ Time.%0D%0A%0D%0AIn reference to your message:%0D%0A"${encodeURIComponent(enquiry.message)}"%0D%0A%0D%0ABest regards,%0D%0AGenZ Time Editorial Team`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(enquiry.id, 'replied');
                    }}
                    className="p-1.5 rounded-lg bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan text-xs font-mono transition border border-tech-cyan/30"
                    title="Reply via Email Client"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(enquiry.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-tech-950 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-tech-950/95 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${TYPE_CONFIG[selectedEnquiry.inquiryType]?.bg} ${TYPE_CONFIG[selectedEnquiry.inquiryType]?.color} ${TYPE_CONFIG[selectedEnquiry.inquiryType]?.border}`}>
                    {TYPE_CONFIG[selectedEnquiry.inquiryType]?.label}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {selectedEnquiry.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Inquiry from {selectedEnquiry.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-tech-900/50 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address:</span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-tech-cyan hover:underline font-bold"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Company / Device:</span>
                  <span className="text-white font-bold">
                    {selectedEnquiry.deviceOrCompany || 'N/A (Individual)'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Submitted Timestamp:</span>
                  <span className="text-slate-300">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Current Status:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                      className="px-2 py-1 rounded bg-tech-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-tech-cyan focus:outline-none"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={(e) => handleToggleStar(e, selectedEnquiry)}
                      className={`p-1 rounded border transition ${
                        selectedEnquiry.starred
                          ? 'border-amber-400/50 text-amber-400 bg-amber-400/10'
                          : 'border-slate-700 text-slate-500'
                      }`}
                      title="Star this inquiry"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Message Content:
                </label>
                <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-tech-cyan selection:text-tech-950">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                    Internal Editorial Notes:
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Visible only to admins</span>
                </div>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Loaner unit arrives Tuesday; assigned to Alex for camera shootout..."
                    className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-tech-cyan resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition flex items-center gap-1.5"
                    >
                      {savingNotes ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Saving Notes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 text-tech-emerald" />
                          <span>Save Notes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-tech-900/30">
              <button
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="px-4 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-mono transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: [GenZ Time] ${TYPE_CONFIG[selectedEnquiry.inquiryType]?.label} - ${selectedEnquiry.deviceOrCompany || selectedEnquiry.name}&body=Hi ${selectedEnquiry.name},%0D%0A%0D%0AThank you for contacting GenZ Time.%0D%0A%0D%0AIn reference to your message:%0D%0A"${encodeURIComponent(selectedEnquiry.message)}"%0D%0A%0D%0ABest regards,%0D%0AGenZ Time Editorial Team`}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id, 'replied')}
                  className="px-5 py-2 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
