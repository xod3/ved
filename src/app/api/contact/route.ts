import { NextRequest, NextResponse } from 'next/server';
import { createSupportTicket } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, tracking_number, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Subject, Message).' },
        { status: 400 }
      );
    }

    const ticket = createSupportTicket({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      tracking_number: tracking_number ? tracking_number.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      ticket_number: ticket.ticket_number,
      message: 'Your inquiry has been logged in our dispatch support system. A logistics specialist will respond shortly.',
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Unable to submit your inquiry at this moment. Please message us on WhatsApp at +1 (808) 301-0314.' },
      { status: 500 }
    );
  }
}
