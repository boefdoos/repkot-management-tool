// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

// Nodemailer setup (optioneel - kan ook via externe service zoals SendGrid)
async function sendEmailViaNodemailer(emailData: EmailRequest): Promise<EmailResponse> {
  try {
    // Voor nu simuleren we email verzending
    // In productie zou je hier een echte email service gebruiken
    console.log('📧 Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      preview: emailData.text.substring(0, 100) + '...'
    });

    // Simuleer een korte delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send email'
    };
  }
}

// Alternatief: SendGrid setup
async function sendEmailViaSendGrid(emailData: EmailRequest): Promise<EmailResponse> {
  try {
    // SendGrid implementation
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: emailData.to,
      from: process.env.FROM_EMAIL || 'noreply@repkot.be',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    // await sgMail.send(msg);
    
    // Voor nu loggen we alleen
    console.log('📧 SendGrid email would be sent:', {
      to: msg.to,
      subject: msg.subject,
      from: msg.from
    });

    return {
      success: true,
      message: 'Email sent via SendGrid',
      messageId: `sg_${Date.now()}`
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    return {
      success: false,
      message: 'SendGrid delivery failed'
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
) {
  // Alleen POST requests accepteren
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { to, subject, html, text }: EmailRequest = req.body;

    // Validatie
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and content'
      });
    }

    // Email validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Rate limiting (simpel)
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // In productie zou je hier Redis of een database gebruiken voor rate limiting
    
    // Kies email provider gebaseerd op environment
    let result: EmailResponse;
    
    if (process.env.EMAIL_PROVIDER === 'sendgrid') {
      result = await sendEmailViaSendGrid({ to, subject, html, text });
    } else {
      result = await sendEmailViaNodemailer({ to, subject, html, text });
    }

    // Log voor monitoring
    console.log(`Email ${result.success ? 'sent' : 'failed'} to ${to}: ${subject}`);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Utility function voor email templates
export function generateWelcomeEmail(customerName: string, studioName: string): EmailRequest {
  return {
    to: '', // Wordt later ingevuld
    subject: `Welkom bij REPKOT - ${studioName}`,
    html: `
      <h1>Welkom ${customerName}!</h1>
      <p>Je bent succesvol aangemeld voor ${studioName}.</p>
      <p>We kijken uit naar je eerste sessie!</p>
    `,
    text: `Welkom ${customerName}! Je bent aangemeld voor ${studioName}.`
  };
}

// Webhook handler voor inkomende emails (optioneel)
export async function handleIncomingEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verwerk inkomende emails (zoals antwoorden op betalingsherinneringen)
    const { from, subject, body } = req.body;

    console.log('Incoming email:', { from, subject });

    // Automatische verwerking van antwoorden
    if (subject.includes('Betaling voltooid')) {
      // Update payment status in database
      // await updatePaymentStatus(from, 'paid');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Incoming email error:', error);
    res.status(500).json({ success: false });
  }
}
