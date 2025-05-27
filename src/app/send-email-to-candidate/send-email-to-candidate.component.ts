import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-send-email-to-candidate',
  templateUrl: './send-email-to-candidate.component.html',
  styleUrls: ['./send-email-to-candidate.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SendEmailToCandidateComponent implements OnInit {
  @Input() candidateEmail: string = '';
  @Input() candidateName: string = '';
  @Input() candidatePosition: string = ''; // Nouveau: poste du candidat
  @Output() close = new EventEmitter<void>();

  emailForm!: FormGroup;
  isSending = false;
  statusMessage = '';
  isSuccess = false;
  selectedTemplate: string = 'custom'; // Valeur par défaut
  showCustomForm: boolean = true;

  // Templates prédéfinis
  emailTemplates = [
    { 
      id: 'invitation', 
      name: 'Invitation à un entretien',
      subject: 'Invitation à un entretien pour le poste de ..',
      body: `\n\nNous sommes impressionnés par votre profil et souhaitons vous inviter à un entretien pour le poste de ....\n\n Disponibilités : ........\nLieu : .....\n\nEn attendant, n'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'rejection', 
      name: 'Refus de candidature',
      subject: 'Réponse à votre candidature pour ....',
      body: `\n\nNous vous remercions pour l'intérêt que vous avez porté à notre entreprise et pour le temps que vous avez consacré à votre candidature pour le poste de ....\n\nAprès une étude attentive de votre profil, nous regrettons de vous informer que nous ne donnerons pas suite à votre candidature.\n\nNous conservons néanmoins votre CV dans notre base de données et ne manquerons pas de vous recontacter si une opportunité correspondant à votre profil se présente.\n\nNous vous souhaitons plein de succès dans vos recherches.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'offer', 
      name: 'Proposition d\'offre',
      subject: 'Proposition pour le poste de .........',
      body: `\n\nSuite à notre entretien, nous sommes ravis de vous proposer le poste de ..... au sein de notre équipe.\n\nDétails de l'offre :\n- Salaire : ......\n- Avantages : .......\n- Date de début : .......\n\nNous restons à votre disposition pour toute question concernant cette proposition.\n\nEn attendant votre réponse, nous vous adressons nos salutations les meilleures.\n\nCordialement,\nL'équipe de recrutement`
    },
    { 
      id: 'custom', 
      name: 'Message personnalisé',
      subject: '',
      body: ''
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    emailjs.init('dqrVPCM4Ikx5hL6hl');
  }

  private initializeForm(): void {
    this.emailForm = this.fb.group({
      to_email: [{ value: this.candidateEmail, disabled: true }, 
                [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(20)]],
      template: ['custom']
    });
  }

  onTemplateChange(): void {
    if (this.selectedTemplate !== 'custom') {
      const template = this.emailTemplates.find(t => t.id === this.selectedTemplate);
      if (template) {
        const subject = template.subject.replace('{{position}}', this.candidatePosition);
        const body = template.body
          .replace(/{{name}}/g, this.candidateName)
          .replace(/{{position}}/g, this.candidatePosition);
        
        this.emailForm.patchValue({
          subject: subject,
          body: body
        });
      }
      this.showCustomForm = false;
    } else {
      this.showCustomForm = true;
      this.emailForm.patchValue({
        subject: '',
        body: ''
      });
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
      position: this.candidatePosition // Nouveau champ pour les templates
    };

    try {
      const response = await emailjs.send(
        'service_hlm17og',
        'template_o73p1w9',
        templateParams
      );

      console.log('Success:', response);
      this.isSuccess = true;
      this.statusMessage = 'Email envoyé avec succès!';
      setTimeout(() => this.onClose(), 2000);
    } catch (error: any) {
      console.error('Error:', error);
      this.isSuccess = false;
      this.statusMessage = this.getErrorMessage(error);
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