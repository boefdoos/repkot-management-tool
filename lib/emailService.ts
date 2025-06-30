// lib/emailService.ts
import { BusinessConfig } from './config';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface NotificationData {
  customerName: string;
  customerEmail: string;
  studioName?: string;
  date?: string;
  timeSlot?: string;
  price?: number;
  accessCode?: string;
  nextBilling?: string;
  lockerNumber?: number;
}

export class EmailService {
  private static apiEndpoint = '/api/send-email'; // Next.js API route

  // Email templates
  static templates = {
    bookingConfirmation: (data: NotificationData): EmailTemplate => ({
      subject: `Bevestiging Boeking ${data.studioName} - REPKOT`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">REPKOT</h1>
            <p style="margin: 5px 0 0 0;">Professionele Repetitieruimtes</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #1f2937;">Boeking Bevestigd! 🎵</h2>
            
            <p>Beste ${data.customerName},</p>
            
            <p>Je boeking is bevestigd. Hier zijn de details:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #3b82f6;">${data.studioName}</h3>
              <p><strong>Datum:</strong> ${data.date}</p>
              <p><strong>Tijdslot:</strong> ${data.timeSlot}</p>
              <p><strong>Prijs:</strong> €${data.price}</p>
            </div>
            
            ${data.accessCode ? `
              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #059669;">Toegangscode</h4>
                <p style="font-size: 24px; font-weight: bold; font-family: monospace; color: #059669; margin: 10px 0;">
                  ${data.accessCode}
                </p>
                <p style="font-size: 14px; margin-bottom: 0;">
                  Deze code is geldig voor je boekingsperiode. Voer de code in bij het toegangspaneel.
                </p>
              </div>
            ` : ''}
            
            <h3>Praktische Informatie</h3>
            <ul>
              <li>Adres: [Studio Adres]</li>
              <li>Parkeren: Gratis parkeerplaatsen beschikbaar</li>
              <li>Faciliteiten: Volledige backline beschikbaar</li>
              <li>WiFi: REPKOT_Studio (wachtwoord: music2025)</li>
            </ul>
            
            <p>Heb je vragen? Neem contact met ons op via 
               <a href="mailto:info@repkot.be" style="color: #3b82f6;">info@repkot.be</a> 
               of bel +32 123 45 67 89.</p>
            
            <p>We wensen je een fantastische sessie!</p>
            
            <p style="margin-top: 30px;">
              Met muzikale groeten,<br>
              <strong>Het REPKOT Team</strong>
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>REPKOT • Professionele Repetitieruimtes • www.repkot.be</p>
          </div>
        </div>
      `,
      text: `
        REPKOT - Boeking Bevestigd
        
        Beste ${data.customerName},
        
        Je boeking is bevestigd:
        
        Studio: ${data.studioName}
        Datum: ${data.date}
        Tijdslot: ${data.timeSlot}
        Prijs: €${data.price}
        
        ${data.accessCode ? `Toegangscode: ${data.accessCode}` : ''}
        
        Adres: [Studio Adres]
        
        Vragen? Mail info@repkot.be of bel +32 123 45 67 89
        
        Het REPKOT Team
      `
    }),

    subscriptionConfirmation: (data: NotificationData): EmailTemplate => ({
      subject: `Welkom bij REPKOT - Abonnement Actief! 🎸`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">REPKOT</h1>
            <p style="margin: 5px 0 0 0;">Welkom in de REPKOT Familie!</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #1f2937;">Je Abonnement is Actief! 🎵</h2>
            
            <p>Beste ${data.customerName},</p>
            
            <p>Welkom bij REPKOT! Je maandabonnement is succesvol geactiveerd.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #3b82f6;">Abonnement Details</h3>
              <p><strong>Studio:</strong> ${data.studioName}</p>
              <p><strong>Maandprijs:</strong> €${data.price}</p>
              <p><strong>Volgende facturering:</strong> ${data.nextBilling}</p>
            </div>
            
            <h3>Voordelen van je Abonnement</h3>
            <ul>
              <li>✅ Vaste tijdsloten elke week</li>
              <li>✅ Prioriteit bij boekingen</li>
              <li>✅ 24/7 toegang tot je studio</li>
              <li>✅ Korting op extra boekingen</li>
              <li>✅ Gratis locker upgrade (indien beschikbaar)</li>
            </ul>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #059669;">Volgende Stappen</h4>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Je ontvangt wekelijks je toegangscodes via email</li>
                <li>Download onze REPKOT app voor eenvoudig beheer</li>
                <li>Voeg ons toe aan je contacten: +32 123 45 67 89</li>
              </ol>
            </div>
            
            <p>Heb je vragen over je abonnement? Ons team staat klaar om te helpen!</p>
            
            <p style="margin-top: 30px;">
              Rock on!<br>
              <strong>Het REPKOT Team</strong>
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>REPKOT • Je kunt dit abonnement beheren via onze website • www.repkot.be</p>
          </div>
        </div>
      `,
      text: `
        REPKOT - Abonnement Actief
        
        Beste ${data.customerName},
        
        Je maandabonnement is geactiveerd!
        
        Studio: ${data.studioName}
        Maandprijs: €${data.price}
        Volgende facturering: ${data.nextBilling}
        
        Voordelen:
        - Vaste tijdsloten
        - 24/7 toegang
        - Prioriteit bij boekingen
        - Kortingen op extra boekingen
        
        Vragen? Mail info@repkot.be of bel +32 123 45 67 89
        
        Het REPKOT Team
      `
    }),

    paymentReminder: (data: NotificationData): EmailTemplate => ({
      subject: `Betalingsherinnering REPKOT - ${data.studioName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #fbbf24; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">REPKOT</h1>
            <p style="margin: 5px 0 0 0;">Betalingsherinnering</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #92400e;">Vriendelijke Herinnering 💰</h2>
            
            <p>Beste ${data.customerName},</p>
            
            <p>We hebben nog geen betaling ontvangen voor je REPKOT abonnement.</p>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">Openstaand Bedrag</h3>
              <p><strong>Studio:</strong> ${data.studioName}</p>
              <p><strong>Bedrag:</strong> €${data.price}</p>
              <p><strong>Vervaldatum:</strong> ${data.nextBilling}</p>
            </div>
            
            <p>Betaal eenvoudig via bankoverschrijving:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace;">
              <p><strong>IBAN:</strong> BE12 3456 7890 1234</p>
              <p><strong>BIC:</strong> GKCCBEBB</p>
              <p><strong>Mededeling:</strong> ${data.customerName} - ${data.studioName}</p>
            </div>
            
            <p style="color: #dc2626; font-weight: bold;">
              ⚠️ Betaal binnen 7 dagen om onderbreking van je toegang te voorkomen.
            </p>
            
            <p>Heb je al betaald? Dan kun je deze email negeren. Het kan 1-2 werkdagen duren 
               voordat de betaling verwerkt is.</p>
            
            <p>Vragen? Neem contact met ons op via 
               <a href="mailto:finance@repkot.be" style="color: #3b82f6;">finance@repkot.be</a></p>
            
            <p style="margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Het REPKOT Team</strong>
            </p>
          </div>
        </div>
      `,
      text: `
        REPKOT - Betalingsherinnering
        
        Beste ${data.customerName},
        
        We hebben nog geen betaling ontvangen voor:
        
        Studio: ${data.studioName}
        Bedrag: €${data.price}
        Vervaldatum: ${data.nextBilling}
        
        Betaal via:
        IBAN: BE12 3456 7890 1234
        BIC: GKCCBEBB
        Mededeling: ${data.customerName} - ${data.studioName}
        
        Betaal binnen 7 dagen om onderbreking te voorkomen.
        
        Vragen? Mail finance@repkot.be
        
        Het REPKOT Team
      `
    }),

    lockerRental: (data: NotificationData): EmailTemplate => ({
      subject: `Locker ${data.lockerNumber} Gehuurd - REPKOT`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">REPKOT</h1>
            <p style="margin: 5px 0 0 0;">Locker Verhuur Bevestiging</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #1f2937;">Locker Succesvol Gehuurd! 🔒</h2>
            
            <p>Beste ${data.customerName},</p>
            
            <p>Je hebt succesvol locker ${data.lockerNumber} gehuurd bij REPKOT.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #3b82f6;">Locker Details</h3>
              <p><strong>Locker Nummer:</strong> ${data.lockerNumber}</p>
              <p><strong>Maandprijs:</strong> €${data.price}</p>
              <p><strong>Afmetingen:</strong> 100cm × 200cm × 260cm</p>
            </div>
            
            <h3>Toegang en Gebruik</h3>
            <ul>
              <li>🔑 Je krijgt binnenkort de sleutels</li>
              <li>📦 Ideaal voor drumkits, versterkers, instrumenten</li>
              <li>🚨 Beveiligd met camerabewaking</li>
              <li>🌡️ Klimaatgecontroleerde omgeving</li>
            </ul>
            
            <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #dc2626;">Belangrijke Regels</h4>
              <ul style="margin: 0; color: #dc2626;">
                <li>Geen gevaarlijke of illegale materialen</li>
                <li>Maximaal gewicht: 200kg</li>
                <li>Locker altijd afsluiten na gebruik</li>
                <li>Bij schade direct melden</li>
              </ul>
            </div>
            
            <p>Vragen over je locker? Mail ons op 
               <a href="mailto:lockers@repkot.be" style="color: #3b82f6;">lockers@repkot.be</a></p>
            
            <p style="margin-top: 30px;">
              Veel plezier met je extra opslagruimte!<br>
              <strong>Het REPKOT Team</strong>
            </p>
          </div>
        </div>
      `,
      text: `
        REPKOT - Locker ${data.lockerNumber} Gehuurd
        
        Beste ${data.customerName},
        
        Je locker verhuur is bevestigd:
        
        Locker: ${data.lockerNumber}
        Maandprijs: €${data.price}
        Afmetingen: 100×200×260cm
        
        Voordelen:
        - Beveiligd met camera's
        - Klimaatgecontroleerd
        - 24/7 toegang
        
        Regels:
        - Geen gevaarlijke materialen
        - Max 200kg
        - Altijd afsluiten
        
        Vragen? Mail lockers@repkot.be
        
        Het REPKOT Team
      `
    })
  };

  // Send email function
  static async sendEmail(
    to: string,
    template: EmailTemplate,
    config?: BusinessConfig
  ): Promise<boolean> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      });

      if (!response.ok) {
        throw new Error(`Email API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Convenience methods
  static async sendBookingConfirmation(data: NotificationData): Promise<boolean> {
    const template = this.templates.bookingConfirmation(data);
    return this.sendEmail(data.customerEmail, template);
  }

  static async sendSubscriptionConfirmation(data: NotificationData): Promise<boolean> {
    const template = this.templates.subscriptionConfirmation(data);
    return this.sendEmail(data.customerEmail, template);
  }

  static async sendPaymentReminder(data: NotificationData): Promise<boolean> {
    const template = this.templates.paymentReminder(data);
    return this.sendEmail(data.customerEmail, template);
  }

  static async sendLockerConfirmation(data: NotificationData): Promise<boolean> {
    const template = this.templates.lockerRental(data);
    return this.sendEmail(data.customerEmail, template);
  }

  // Bulk notifications
  static async sendPaymentReminders(subscriptions: NotificationData[]): Promise<number> {
    let successCount = 0;
    
    for (const subscription of subscriptions) {
      const success = await this.sendPaymentReminder(subscription);
      if (success) successCount++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return successCount;
  }
}

export default EmailService;
