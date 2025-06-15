import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KanbanItem, RecruitmentStep, SkillEvaluation, CandidateNote } from '../../interfaces/kanban.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SendEmailToCandidateComponent } from '../../send-email-to-candidate/send-email-to-candidate.component';
import { EmailService } from '../../email.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SendEmailToCandidateComponent],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent {
  @Input() candidate!: KanbanItem;
  @Input() recruitmentSteps: RecruitmentStep[] = [];
  @Output() close = new EventEmitter<void>();

  newNoteContent = '';
  showNotesModal = false;
  currentPhaseId = '';
  showEvaluationModal = false;
  evaluationPhase = '';
  currentEvaluations: SkillEvaluation[] = [];
  phaseSkills: Record<string, SkillEvaluation[]> = {};
  showEmailModal = false;
  isSendingCalendarLink = false;

  constructor(
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.initializeCandidateData();
    
    // Si aucun recruitmentSteps n'est passé en input, utilisez les valeurs par défaut
    if (!this.recruitmentSteps || this.recruitmentSteps.length === 0) {
      this.recruitmentSteps = [
        { 
          id: 'PresSelectionne', 
          label: 'Pré-sélection', 
          color: '#8b5cf6',
          bgColor: '#f5f3ff',
          noteType: 'RH',
          order: 1
        },
        { 
          id: 'RH Interview', 
          label: 'Entretien RH', 
          color: '#3b82f6',
          bgColor: '#eff6ff',
          noteType: 'RH',
          order: 2
        },
        { 
          id: 'Technique', 
          label: 'Entretien Technique', 
          color: '#06b6d4',
          bgColor: '#ecfeff',
          noteType: 'Technique',
          order: 3
        },
        { 
          id: 'Embauché(e)', 
          label: 'Embauché', 
          color: '#10b981',
          bgColor: '#ecfdf5',
          noteType: 'Générale',
          order: 4
        }
      ];
    }
  }

  private initializeCandidateData() {
    if (!this.candidate.notes) {
      this.candidate.notes = [];
    }
    if (!this.candidate.evaluation) {
      this.candidate.evaluation = {
        rating: 0,
        comment: '',
        skills: [],
        date: new Date()
      };
    }
    if (!this.candidate.skills) {
      this.candidate.skills = [];
    }
  }

  navigateToEvaluation(stepId: string): void {
    const step = this.recruitmentSteps.find(s => s.id === stepId);
    if (!step) return;

    this.router.navigate([{ outlets: { modal: ['evaluation', stepId] } }], { 
      state: { 
        candidate: this.candidate,
        step: step
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  openNotesModal(phaseId: string) {
    this.currentPhaseId = phaseId;
    this.showNotesModal = true;
    this.newNoteContent = '';
  }

  addNote(phaseId: string) {
    if (this.newNoteContent.trim()) {
      const step = this.recruitmentSteps.find(s => s.id === phaseId);
      if (step) {
        const newNote: CandidateNote = {
          type: step.noteType,
          content: this.newNoteContent,
          date: new Date(),
          author: 'Recruteur'
        };
        this.candidate.notes!.push(newNote);
        this.newNoteContent = '';
      }
    }
  }

  removeNote(note: CandidateNote) {
    const index = this.candidate.notes!.findIndex(
      n => n.content === note.content && 
           n.type === note.type &&
           new Date(n.date).getTime() === new Date(note.date).getTime()
    );
    if (index !== -1) {
      this.candidate.notes!.splice(index, 1);
    }
  }

  getNotesForPhase(phaseId: string): CandidateNote[] {
    if (!this.candidate.notes) return [];
    const step = this.recruitmentSteps.find(s => s.id === phaseId);
    if (!step) return [];
    return this.candidate.notes.filter(note => note.type === step.noteType);
  }

  getPhaseNotesCount(phaseId: string): number {
    return this.getNotesForPhase(phaseId).length;
  }

  getStatusLabel(status: string): string {
    const step = this.recruitmentSteps.find(s => s.id === status);
    return step ? step.label : status;
  }

  isActiveOrCompleted(stepId: string): boolean {
    const currentStep = this.recruitmentSteps.find(step => step.id === this.candidate.status);
    const targetStep = this.recruitmentSteps.find(step => step.id === stepId);
    
    if (!currentStep || !targetStep) return false;
    
    return targetStep.order <= currentStep.order;
  }

  isCompleted(stepId: string): boolean {
    const currentStep = this.recruitmentSteps.find(step => step.id === this.candidate.status);
    const targetStep = this.recruitmentSteps.find(step => step.id === stepId);
    
    if (!currentStep || !targetStep) return false;
    
    return targetStep.order < currentStep.order;
  }

  getProgress(stepId: string): number {
    const currentStep = this.recruitmentSteps.find(step => step.id === this.candidate.status);
    const targetStep = this.recruitmentSteps.find(step => step.id === stepId);
    
    if (!currentStep || !targetStep) return 0;
    
    if (targetStep.order < currentStep.order) return 100;
    if (targetStep.order === currentStep.order) return 50;
    return 0;
  }

  downloadCV() {
    if (this.candidate.cvUrl) {
      window.open(this.candidate.cvUrl, '_blank');
    } else {
      console.warn('No CV URL available for this candidate');
    }
  }

  onClose() {
    this.close.emit();
  }

  openEmailModal() {
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }

  sendEmail(emailData: any) {
    console.log('Email envoyé:', emailData);
    this.showEmailModal = false;
  }

  async sendCalendarLink() {
    if (!this.candidate.email) {
      console.error('Aucun email disponible pour ce candidat');
      return;
    }

    this.isSendingCalendarLink = true;
    try {
      const subject = "Planification d'entretien";
      const body = `Bonjour ${this.candidate.name},\n\nJe vous propose de planifier notre entretien en cliquant sur le lien ci-dessous :`;
      
      const response = await this.emailService.sendEmail(
        this.candidate.email,
        this.candidate.name,
        subject,
        body
      );
      
      console.log('Réponse EmailJS:', response);
      alert("L'invitation calendaire a été envoyée avec succès !");
    } catch (error) {
      console.error("Détails de l'erreur:", error);
      alert(`Erreur détaillée: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.isSendingCalendarLink = false;
    }
  }
}