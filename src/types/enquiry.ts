export type InquiryType = 
  | 'review_pitch' 
  | 'press_release' 
  | 'editorial_correction' 
  | 'advertising' 
  | 'general';

export type EnquiryStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  inquiryType: InquiryType;
  deviceOrCompany?: string;
  message: string;
  status: EnquiryStatus;
  starred?: boolean;
  createdAt: string; // ISO 8601
  notes?: string;
  ip?: string;
}
