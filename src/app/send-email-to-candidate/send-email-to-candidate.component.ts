import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import { CalComService } from '../services/cal-com.service';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  selected: boolean;
}

@Component({
  selector: 'app-send-email-to-candidate',
  templateUrl: './send-email-to-candidate.component.html',
  styleUrls: ['./send-email-to-candidate.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class SendEmailToCandidateComponent implements OnInit {
  @Input() candidateEmail: string = '';
  @Input() candidateName: string = '';
  @Input() candidatePosition: string = '';
  @Output() close = new EventEmitter<void>();

  emailForm: FormGroup;
  isSending = false;
  statusMessage = '';
  isSuccess = false;
  selectedTemplate: string = 'custom';
  interviewType: string = 'technical';

  teamMembers: TeamMember[] = [
    { id: 1, name: 'Membre Technique 1', email: 'chaimamassoudi72@gmail.com', selected: false },
    { id: 2, name: 'Membre Technique 2', email: 'sadraouizeineb@gmail.com', selected: false },
    { id: 3, name: 'Membre RH', email: 'chedia.massoudi@gmail.com', selected: false }
  ];
  
  showMemberSelection = false;

  emailTemplates: EmailTemplate[] = [
    { 
      id: 'invitation', 
      name: 'Invitation à un entretien',
      subject: 'Invitation à un entretien pour le poste de {{position}}',
      body: `Bonjour {{name}},\n\nNous sommes impressionnés par votre profil et souhaitons vous inviter à un entretien pour le poste de {{position}}.\n\nVeuillez choisir un créneau qui vous convient via ce lien :\n{{calendarLink}}\n\nEn attendant, n'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'invitation_technique', 
      name: 'Invitation à un entretien Technique',
      subject: 'Invitation à un entretien technique pour le poste de {{position}}',
      body: `Bonjour {{name}},\n\nSuite à l'étude de votre candidature pour le poste de {{position}}, nous souhaitons vous inviter à un entretien technique.\n\nVeuillez choisir un créneau qui vous convient via ce lien :\n{{calendarLink}}\n\nPréparez-vous à présenter vos compétences techniques et à répondre à des questions pratiques.\n\nCordialement,\nL'équipe technique`
    },
    { 
      id: 'rejection', 
      name: 'Refus de candidature',
      subject: 'Réponse à votre candidature pour {{position}}',
      body: `Bonjour {{name}},\n\nNous vous remercions pour l'intérêt que vous avez porté à notre entreprise et pour le temps que vous avez consacré à votre candidature pour le poste de {{position}}.\n\nAprès une étude attentive de votre profil, nous regrettons de vous informer que nous ne donnerons pas suite à votre candidature.\n\nNous vous souhaitons plein de succès dans vos recherches.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'offer', 
      name: 'Proposition d\'offre',
      subject: 'Proposition pour le poste de {{position}}',
      body: `Bonjour {{name}},\n\nSuite à notre entretien, nous sommes ravis de vous proposer le poste de {{position}} au sein de notre équipe.\n\nDétails de l'offre :\n- Salaire : ......\n- Avantages : .......\n- Date de début : .......\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'custom', 
      name: 'Message personnalisé',
      subject: '',
      body: ''
    }
  ];

  constructor(
    private fb: FormBuilder,
    private calComService: CalComService
  ) {
    this.emailForm = this.fb.group({
      to_email: [{ value: this.candidateEmail, disabled: true }, [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(20)]],
      template: ['custom'],
      interviewType: ['technical']
    });
  }

  ngOnInit(): void {
    emailjs.init('dqrVPCM4Ikx5hL6hl');
  }

  get selectedMembers(): TeamMember[] {
    return this.teamMembers.filter(m => m.selected);
  }

  getCalendarLink(): string {
    const baseUrl = 'https://cal.com/chadia-massoudi-eeek5f/entretien';
    const params = new URLSearchParams({
      email: this.candidateEmail,
      name: this.candidateName,
      overlayCalendar: 'true'
    });
    return `${baseUrl}?${params.toString()}`;
  }

  onTemplateChange(): void {
    if (this.selectedTemplate !== 'custom') {
      const template = this.emailTemplates.find(t => t.id === this.selectedTemplate);
      if (template) {
        let body = template.body;
        
        if (this.selectedTemplate.includes('invitation')) {
          const calendarLink = this.getCalendarLink();
          body = body.replace('{{calendarLink}}', calendarLink);
        }

        const subject = template.subject.replace('{{position}}', this.candidatePosition);
        body = body
          .replace(/{{name}}/g, this.candidateName)
          .replace(/{{position}}/g, this.candidatePosition);
        
        this.emailForm.patchValue({
          subject: subject,
          body: body
        });
      }
    } else {
      this.emailForm.patchValue({
        subject: '',
        body: ''
      });
    }
  }

  onInterviewTypeChange(): void {
    if (this.selectedTemplate.includes('invitation')) {
      this.onTemplateChange();
    }
  }

  async sendEmail(): Promise<void> {
    if (this.emailForm.invalid || this.isSending) {
      this.markFormAsTouched();
      return;
    }

    this.isSending = true;
    this.statusMessage = '';
    this.isSuccess = false;

    const { subject, body } = this.emailForm.getRawValue();
    
    const templateParams = {
      to_email: this.candidateEmail,
      email: this.candidateEmail,
      to_name: this.candidateName,
      from_name: 'Recruteur',
      reply_to: 'chedia.massoudi@gmail.com',
      subject: subject,
      message: body,
      position: this.candidatePosition
    };

    try {
      await emailjs.send(
        'service_hlm17og',
        'template_o73p1w9',
        templateParams
      );

      if (this.selectedTemplate.includes('invitation')) {
        this.showMemberSelection = true;
        this.statusMessage = 'Email envoyé! Sélectionnez maintenant les membres à inviter.';
      } else {
        this.statusMessage = 'Email envoyé avec succès!';
        setTimeout(() => this.onClose(), 2000);
      }

      this.isSuccess = true;
    } catch (error: any) {
      console.error('Error:', error);
      this.isSuccess = false;
      this.statusMessage = this.getErrorMessage(error);
    } finally {
      this.isSending = false;
    }
  }

  async inviteMembersToBooking(): Promise<void> {
    this.isSending = true;
    this.statusMessage = 'Envoi des invitations en cours...';
    this.isSuccess = false;

    try {
      const calendarLink = this.getCalendarLink();
      const selectedMembers = this.teamMembers.filter(m => m.selected);

      for (const member of selectedMembers) {
        await emailjs.send(
          'service_hlm17og',
          'template_o73p1w9',
          {
            to_email: member.email,
            email: member.email,
            to_name: member.name,
            from_name: 'Recruteur',
            reply_to: 'chedia.massoudi@gmail.com',
            subject: `Invitation à un entretien avec ${this.candidateName}`,
            message: `Bonjour ${member.name},\n\nVous êtes invité à participer à un entretien avec ${this.candidateName} pour le poste de ${this.candidatePosition}.\n\nCordialement,\nL'équipe de recrutement`,
            position: this.candidatePosition
          }
        );
      }

      this.statusMessage = `${selectedMembers.length} membres invités avec succès!`;
      this.isSuccess = true;
      setTimeout(() => this.onClose(), 2000);
    } catch (error: any) {
      console.error('Erreur:', error);
      this.statusMessage = error.message || error.error?.message || "Erreur lors de l'invitation des membres";
      this.isSuccess = false;
    } finally {
      this.isSending = false;
    }
  }

  private markFormAsTouched(): void {
    Object.values(this.emailForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private getErrorMessage(error: any): string {
    if (error?.text?.includes('recipients address is empty')) {
      return "Erreur: L'adresse email du destinataire est vide";
    }
    return error?.text || "Erreur lors de l'envoi de l'email";
  }

  onClose(): void {
    this.close.emit();
  }
}