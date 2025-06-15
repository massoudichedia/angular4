// cal-invite.service.ts
import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class CalInviteService {
  private readonly EMAILJS_SERVICE_ID = 'service_hlm17og';
  private readonly EMAILJS_TEMPLATE_ID = 'template_lv54kcg'; 
  private readonly EMAILJS_PUBLIC_KEY = 'dqrVPCM4Ikx5hL6hl';
  private readonly CALCOM_BASE_URL = 'https://cal.com/chadia-massoudi-eeek5f/entretien';

  constructor() {
    emailjs.init(this.EMAILJS_PUBLIC_KEY);
  }

  async sendCalendarInvite(
    candidateEmail: string,
    candidateName: string,
    position: string = 'Poste concerné'
  ): Promise<{success: boolean, message: string}> {
    try {
      const calendlyLink = this.generateCalendlyLink(candidateEmail, candidateName);
      
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        {
          to_email: candidateEmail,
          to_name: candidateName,
          from_name: 'Équipe de recrutement',
          reply_to: 'chedia.massoudi@gmail.com',
          subject: 'Invitation à planifier un entretien',
          calendly_link: calendlyLink,
          position: position,
          message: this.generateEmailContent(candidateName, calendlyLink)
        }
      );

      return {
        success: true,
        message: 'Invitation envoyée avec succès'
      };
    } catch (error) {
      console.error('Erreur CalInviteService:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  private generateCalendlyLink(email: string, name: string): string {
    return `${this.CALCOM_BASE_URL}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
  }

  private generateEmailContent(name: string, link: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Invitation à un entretien</h2>
        <p>Bonjour ${name},</p>
        <p>Nous souhaitons planifier un entretien avec vous. Veuillez choisir un créneau qui vous convient :</p>
        
        <div style="margin: 25px 0; text-align: center;">
          <a href="${link}" 
             style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;
                    display: inline-block;">
            Choisir un horaire
          </a>
        </div>

        <p>Ou copiez ce lien dans votre navigateur :<br>
        <a href="${link}" style="color: #7c3aed;">${link}</a></p>

        <p style="margin-top: 30px; color: #666;">
          Cordialement,<br>
          L'équipe de recrutement
        </p>
      </div>
    `;
  }

 // cal-invite.service.ts
private getErrorMessage(error: any): string {
  if (error?.status) {
    switch (error.status) {
      case 400:
        return 'Requête incorrecte - vérifiez les paramètres';
      case 401:
        return 'Non autorisé - vérifiez votre clé API EmailJS';
      case 402:
        return 'Paiement requis - vérifiez votre abonnement EmailJS';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Service ou template introuvable';
      case 4200:
        return 'Erreur EmailJS: ' + (error.text || 'Problème de configuration');
      default:
        return `Erreur serveur (${error.status})`;
    }
  }
  return error?.message || 'Erreur inconnue lors de l\'envoi';
}
}