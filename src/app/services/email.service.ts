import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailData {
  destinataire: string;
  type: string;
  contenu: string;
  expediteur_email?: string;
  entretien_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/api/emails';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: EmailData): Observable<any> {
  const payload = {
    entretien_id: emailData.entretien_id,
    destinataire: emailData.destinataire,
    type: emailData.type,
    contenu: emailData.contenu,
    expediteur_email: emailData.expediteur_email || 'chedia.massoudi@gmail.com'
  };
  
  return this.http.post(this.apiUrl, payload);
}
}