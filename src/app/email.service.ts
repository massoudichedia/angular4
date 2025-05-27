import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly SERVICE_ID = 'service_hlm17og'; // Remplacez par votre Service ID
  private readonly TEMPLATE_ID = 'template_47v3nnq'; // Remplacez par votre Template ID
  private readonly USER_ID = 'dqrVPCM4Ikx5hL6hl'; // Remplacez par votre User ID

  constructor() {
    emailjs.init(this.USER_ID);
  }

  async sendEmail(to_email: string, to_name: string, subject: string, body: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: to_email,
      to_name: to_name,
      from_name: 'Recruteur',
      reply_to: 'no-reply@votresociete.com',
      subject: subject,
      message: body
    };

    try {
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );
      return response;
    } catch (error) {
      throw error as EmailJSResponseStatus;
    }
  }
}