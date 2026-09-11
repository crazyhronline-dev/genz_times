import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact GenZ Time — Pitch a Device, Report an Error or Say Hello',
  description: 'Got a gadget you want us to review? Want to flag an error in one of our articles or partner with GenZ Time? We are a real team of tech reviewers who actually read every message. Reach out — we respond within 48 hours.',
  alternates: {
    canonical: 'https://genztime.com/contact',
  },
  openGraph: {
    title: 'Contact GenZ Time — Pitch a Device, Report an Error or Say Hello',
    description: 'Got a gadget you want us to review? Want to flag an error or partner with GenZ Time? We are a real team of tech reviewers who actually read every message.',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
