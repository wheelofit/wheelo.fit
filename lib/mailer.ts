import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS,
  },
});

const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER;

interface Registration {
  name: string;
  email: string;
  phone: string;
  ticketCode: string | null;
  ticketCount: number | string;
  amount: number;
  additionalNames?: string[];
}

interface EventDetails {
  title: string;
  date: string | Date;
  timeSlot: string;
}

interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  startDate: string | Date;
  endDate: string | Date;
  quantity: number | string;
  totalAmount: number;
  transactionId?: string | null;
}

interface Cycle {
  type: string;
}

const eventTicketTemplate = (registration: Registration, event: EventDetails) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wheelo.fit';
  const qrUrl = `${baseUrl}/ticket/${registration.ticketCode}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&color=000000&bgcolor=ffffff`;

  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: transparent;">
      
      <!-- Top Part -->
      <div style="background-color: #18181b; border-radius: 16px 16px 0 0; padding: 30px; color: #ffffff; text-align: center; border-bottom: 2px dashed #3f3f46;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #22c55e; text-transform: uppercase; letter-spacing: 2px;">Wheelo.fit</h1>
        <p style="margin: 15px 0 0 0; font-size: 20px; font-weight: 600; color: #ffffff;">${event.title}</p>
        <div style="margin-top: 15px; display: inline-block; background-color: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #22c55e; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Admit ${registration.ticketCount}
        </div>
      </div>

      <!-- Middle Part -->
      <div style="background-color: #ffffff; padding: 30px; text-align: left;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding-bottom: 25px;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600;">Attendee</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #18181b; font-weight: 700;">${registration.name}</p>
            </td>
            <td style="padding-bottom: 25px; text-align: right;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600;">Date</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #18181b; font-weight: 700;">${new Date(event.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600;">Ticket Code</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #22c55e; font-weight: 800; font-family: monospace;">${registration.ticketCode}</p>
            </td>
            <td style="padding-bottom: 20px; text-align: right;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600;">Time</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #18181b; font-weight: 700;">${event.timeSlot}</p>
            </td>
          </tr>
        </table>

        ${registration.additionalNames && registration.additionalNames.length > 0 ? `
        <div style="margin-top: 10px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
          <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; font-weight: 600;">Additional Attendees</p>
          <p style="margin: 5px 0 0 0; font-size: 15px; color: #27272a; font-weight: 600;">${registration.additionalNames.join(', ')}</p>
        </div>
        ` : ''}
      </div>

      <!-- Bottom Part (QR Code) -->
      <div style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 0 30px 30px 30px; text-align: center; border-top: 2px dashed #e4e4e7;">
        <div style="padding-top: 30px;">
          <p style="margin: 0 0 15px 0; color: #71717a; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Scan at Entry</p>
          <img src="${qrImageUrl}" alt="Ticket QR Code" style="width: 160px; height: 160px; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 12px; padding: 10px; background-color: #ffffff;" />
        </div>
        <p style="margin: 25px 0 0 0; font-size: 14px; color: #71717a;">Please present this e-ticket on your mobile device at the venue.</p>
      </div>

      <!-- Footer -->
      <div style="padding-top: 20px; text-align: center;">
        <p style="margin: 0; color: #a1a1aa; font-size: 12px;">© ${new Date().getFullYear()} Wheelo.fit. All rights reserved.</p>
      </div>

    </div>
  </div>
  `;
};

const rentalConfirmationTemplate = (booking: Booking, cycle: Cycle) => `
  <div style="font-family: 'Inter', Helvetica, sans-serif; background-color: #000000; color: #ffffff; padding: 40px 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">Rental Confirmed</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; color: #dbeafe; opacity: 0.9;">${cycle.type}</p>
      </div>
      <div style="padding: 40px 30px; text-align: left;">
        <p style="font-size: 18px; color: #9ca3af; margin-bottom: 20px;">Hi <strong style="color: #ffffff;">${booking.name}</strong>,</p>
        <p style="font-size: 16px; color: #d1d5db; line-height: 1.6; margin-bottom: 30px;">
          Your cycle rental is confirmed! Get ready for an amazing ride. Here are the details of your booking.
        </p>

        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; font-size: 14px;">Booking ID</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 16px; font-weight: 600; text-align: right;">${booking.transactionId || booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #333333;">Start Date</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #333333;">${new Date(booking.startDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #333333;">End Date</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #333333;">${new Date(booking.endDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #333333;">Quantity</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #333333;">${booking.quantity}</td>
            </tr>
             <tr>
              <td style="padding: 10px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #333333;">Total Amount</td>
              <td style="padding: 10px 0; color: #ffffff; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #333333;">₹${booking.totalAmount}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 40px;">
          Please bring a valid ID when picking up your cycle. If you have any questions, feel free to reply to this email.
        </p>
      </div>
      <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222222;">
        <p style="margin: 0; color: #4b5563; font-size: 12px;">© ${new Date().getFullYear()} Wheelo.fit. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export async function sendEventRegistrationEmail(registration: Registration, event: EventDetails) {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('Email credentials not set, skipping email.');
    return;
  }

  try {
    // Send to User
    await transporter.sendMail({
      from: `"Wheelo.fit" <${user}>`,
      to: registration.email,
      subject: `Ticket Confirmed: ${event.title}`,
      html: eventTicketTemplate(registration, event),
    });

    // Send Self Notification (Admin)
    if (adminEmail) {
      const attendees = [registration.name, ...(registration.additionalNames || [])].join(', ');
      await transporter.sendMail({
        from: `"Wheelo System" <${user}>`,
        to: adminEmail,
        subject: `New Event Registration: ${registration.name}`,
        text: `
New Registration Details:
Event: ${event.title}
Lead Name: ${registration.name}
All Attendees: ${attendees}
Email: ${registration.email}
Phone: ${registration.phone}
Ticket Code: ${registration.ticketCode}
Ticket Count: ${registration.ticketCount}
Amount: ₹${registration.amount}
        `,
      });
    }
    console.log(`Successfully sent event registration email for ${registration.email}`);
  } catch (error) {
    console.error('Error sending event registration email:', error);
  }
}

export async function sendRentalConfirmationEmail(booking: Booking, cycle: Cycle) {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('Email credentials not set, skipping email.');
    return;
  }

  try {
    // Send to User
    await transporter.sendMail({
      from: `"Wheelo.fit" <${user}>`,
      to: booking.email,
      subject: `Cycle Rental Confirmed: ${cycle.type}`,
      html: rentalConfirmationTemplate(booking, cycle),
    });

    // Send Self Notification (Admin)
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Wheelo System" <${user}>`,
        to: adminEmail,
        subject: `New Cycle Rental: ${booking.name}`,
        text: `
New Cycle Rental Details:
Email: ${booking.email}
Phone: ${booking.phone}
Start Date: ${new Date(booking.startDate).toDateString()}
End Date: ${new Date(booking.endDate).toDateString()}
Quantity: ${booking.quantity}
Total Amount: ₹${booking.totalAmount}
Transaction ID: ${booking.transactionId}
        `,
      });
    }
    console.log(`Successfully sent rental confirmation email for ${booking.email}`);
  } catch (error) {
    console.error('Error sending rental confirmation email:', error);
  }
}

interface CustomPayment {
  name: string | null;
  phone: string | null;
  amount: number;
  transactionId: string | null;
}

export async function sendCustomPaymentNotificationEmail(payment: CustomPayment) {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('Email credentials not set, skipping email.');
    return;
  }

  try {
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Wheelo System" <${user}>`,
        to: adminEmail,
        subject: `New Custom Payment: ₹${payment.amount} by ${payment.name || 'Unknown'}`,
        text: `
New Custom Payment Received!

Details:
Name: ${payment.name || 'N/A'}
Phone: ${payment.phone || 'N/A'}
Amount: ₹${payment.amount}
Transaction ID: ${payment.transactionId}
        `,
      });
      console.log(`Successfully sent custom payment notification email to admin.`);
    }
  } catch (error) {
    console.error('Error sending custom payment notification email:', error);
  }
}
