import fs from 'fs/promises';
import path from 'path';
import { ContactEnquiry } from '@/types/enquiry';

const ENQUIRIES_FILE = path.join(process.cwd(), 'data', 'enquiries.json');

export async function getAllEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const data = await fs.readFile(ENQUIRIES_FILE, 'utf-8');
    const enquiries: ContactEnquiry[] = JSON.parse(data);
    return Array.isArray(enquiries) ? enquiries : [];
  } catch (error) {
    return [];
  }
}

export async function getEnquiryById(id: string): Promise<ContactEnquiry | null> {
  const list = await getAllEnquiries();
  return list.find((e) => e.id === id) || null;
}

export async function saveEnquiry(
  input: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'> & Partial<Pick<ContactEnquiry, 'status' | 'id' | 'createdAt'>>
): Promise<ContactEnquiry> {
  const enquiries = await getAllEnquiries();

  const newEnquiry: ContactEnquiry = {
    id: input.id || `enq-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    inquiryType: input.inquiryType || 'general',
    deviceOrCompany: input.deviceOrCompany ? input.deviceOrCompany.trim() : '',
    message: input.message.trim(),
    status: input.status || 'unread',
    starred: input.starred || false,
    createdAt: input.createdAt || new Date().toISOString(),
    notes: input.notes || '',
    ip: input.ip || '',
  };

  // Add at beginning of list (newest first)
  enquiries.unshift(newEnquiry);

  // Ensure data directory exists
  await fs.mkdir(path.dirname(ENQUIRIES_FILE), { recursive: true });
  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');

  return newEnquiry;
}

export async function updateEnquiry(
  id: string,
  updates: Partial<ContactEnquiry>
): Promise<ContactEnquiry | null> {
  const enquiries = await getAllEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) return null;

  enquiries[index] = {
    ...enquiries[index],
    ...updates,
    id: enquiries[index].id, // Prevent ID override
  };

  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
  return enquiries[index];
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const enquiries = await getAllEnquiries();
  const filtered = enquiries.filter((e) => e.id !== id);

  if (filtered.length === enquiries.length) return false;

  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function getUnreadCount(): Promise<number> {
  const enquiries = await getAllEnquiries();
  return enquiries.filter((e) => e.status === 'unread').length;
}
