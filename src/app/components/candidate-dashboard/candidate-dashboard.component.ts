import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { KanbanItem, RecruitmentStep, SkillEvaluation, NoteType } from '../../interfaces/kanban.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SendEmailToCandidateComponent } from '../../send-email-to-candidate/send-email-to-candidate.component';
import { HttpClient } from '@angular/common/http';
import { Phase, PhaseService } from '../../services/phase.service';
import { EmailService } from '../../email.service';

interface Note {
  id: string;
  recruiter: {
    name: string;
    avatar: string;
    position: string;
  };
  content: string;
  date: Date;
  phase?: string;
  isEditing?: boolean;
  editedContent?: string;
}

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SendEmailToCandidateComponent],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent implements OnInit {
  @Input() candidate!: KanbanItem;
  @Input() recruitmentSteps: RecruitmentStep[] = [];
  @Output() close = new EventEmitter<void>();
  @ViewChild('phoneMenu') phoneMenu!: ElementRef;

  newNoteContent = '';
  showNotesModal = false;
  currentPhaseId = '';
  showEvaluationModal = false;
  evaluationPhase = '';
  currentEvaluations: SkillEvaluation[] = [];
  phaseSkills: Record<string, SkillEvaluation[]> = {};
  showEmailModal = false;
  showPhoneMenu = false;
  isSendingCalendarLink = false;

  notes: Note[] = [];
  editingNoteId: string | null = null;

  backendPhases: Phase[] = [];

  constructor(
    private router: Router,
    private emailService: EmailService,
    private http: HttpClient,
    @Inject(PhaseService) private phaseService: PhaseService
  ) {}

  ngOnInit() {
    // Initialisation du chemin du CV si non défini
    if (!this.candidate.cvUrl) {
      this.candidate.cvUrl = 'cv1.pdf';
    }

    this.initializeCandidateData();
    this.loadBackendPhases();

    if (!this.recruitmentSteps || this.recruitmentSteps.length === 0) {
      this.recruitmentSteps = this.getDefaultRecruitmentSteps();
    }

    if (!this.candidate.avatar) {
      this.candidate.avatar = this.getSafeImagePath('default-avatar.png');
    }

    this.notes = [
      {
        id: '1',
        recruiter: {
          name: 'Membre RH',
          avatar: this.getSafeImagePath('recruiter1.png'),
          position: 'Responsable RH'
        },
        content: 'Le candidat a montré une excellente maîtrise des compétences techniques demandées.',
        date: new Date('2023-05-15'),
        phase: 'Technique'
      },
      {
        id: '2',
        recruiter: {
          name: 'Membre Tech',
          avatar: this.getSafeImagePath('recruiter2.png'),
          position: 'Tech Lead'
        },
        content: 'Très bon feeling lors de l\'entretien. Motivé et aligné avec nos valeurs.',
        date: new Date('2023-05-10'),
        phase: 'RH Interview'
      }
    ];
  }

  private loadBackendPhases() {
    this.phaseService.getAllPhasesFromBackend().subscribe(
      (phases: Phase[]) => {
        this.backendPhases = phases;
        this.recruitmentSteps = [...this.getDefaultRecruitmentSteps(), ...this.backendPhases.map(phase => ({
            id: String(phase.id),
            label: phase.title,
            color: '#8b5cf6',
            bgColor: '#f5f3ff',
            noteType: 'Autre' as NoteType,
            order: phase.order || 999
          }))];
      },
      (error: any) => {
        console.error('Error loading phases from backend:', error);
      }
    );
  }

  private getSafeImagePath(filename: string): string {
    const availableImages = [
      'default-avatar.png',
      'recruiter1.png',
      'recruiter2.png',
      'default-recruiter.jpg'
    ];

    return availableImages.includes(filename)
      ? `assets/images/${filename}`
      : 'assets/images/default-avatar.jpg';
  }

  isPhaseDisabled(stepId: string): boolean {
    const currentStep = this.recruitmentSteps.find(step => step.id === this.candidate.status);
    const targetStep = this.recruitmentSteps.find(step => step.id === stepId);

    if (!currentStep || !targetStep) return true;
    return targetStep.order > currentStep.order;
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

  private getDefaultRecruitmentSteps(): RecruitmentStep[] {
    return [
      {
        id: 'PresSelectionne',
        label: 'Pré-sélection',
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        noteType: 'RH',
        order: 1
      }
    ];
  }

  openNotesModal(phaseId: string) {
    this.currentPhaseId = phaseId;
    this.showNotesModal = true;
    this.newNoteContent = '';
    this.showPhoneMenu = false;
  }

  addNote(phaseId: string = 'general') {
    if (!this.newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      recruiter: {
        name: 'Vous',
        avatar: this.getSafeImagePath('default-recruiter.png'),
        position: 'Recruteur'
      },
      content: this.newNoteContent,
      date: new Date(),
      phase: phaseId !== 'general' ? this.getPhaseLabel(phaseId) : undefined
    };

    this.notes.unshift(newNote);
    this.newNoteContent = '';
  }

  startEditNote(note: Note) {
    this.editingNoteId = note.id;
    note.editedContent = note.content;
    note.isEditing = true;
  }

  saveEditNote(note: Note) {
    if (note.editedContent?.trim()) {
      note.content = note.editedContent;
      note.date = new Date();
    }
    this.cancelEditNote(note);
  }

  cancelEditNote(note: Note) {
    this.editingNoteId = null;
    note.isEditing = false;
    note.editedContent = '';
  }

  deleteNote(noteId: string) {
    this.notes = this.notes.filter(n => n.id !== noteId);
  }

  getNotesForPhase(phaseId: string): Note[] {
    if (phaseId === 'general') return this.notes;
    const phaseLabel = this.getPhaseLabel(phaseId);
    return this.notes.filter(note => note.phase === phaseLabel);
  }

  private getPhaseLabel(phaseId: string): string {
    const step = this.recruitmentSteps.find(s => s.id === phaseId);
    return step ? step.label : phaseId;
  }

  async viewCV() {
    console.log('Viewing CV... candidate.cvUrl:', this.candidate.cvUrl);
    
    if (!this.candidate.cvUrl || this.candidate.cvUrl.trim() === '') {
      this.showError('Aucun CV disponible pour ce candidat');
      return;
    }

    try {
      const cvPath = this.getFullCvPath();
      console.log('CV Path:', cvPath);

      if (!cvPath) {
        this.showError('Chemin du CV invalide');
        return;
      }

      // Ouvrir le PDF dans le même onglet
      window.open(cvPath, '_blank');

    } catch (error) {
      this.handleCvError(error, 'affichage');
    }
  }

  async downloadCV() {
    console.log('Downloading CV... candidate.cvUrl:', this.candidate.cvUrl);
    
    if (!this.candidate.cvUrl || this.candidate.cvUrl.trim() === '') {
      this.showError('Aucun CV disponible pour ce candidat');
      return;
    }

    try {
      const cvPath = this.getFullCvPath();
      console.log('CV Path:', cvPath);

      if (!cvPath) {
        this.showError('Chemin du CV invalide');
        return;
      }

      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = cvPath;
      link.download = this.generateCvFilename();
      
      // Ajouter au DOM, cliquer et retirer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      this.handleCvError(error, 'téléchargement');
    }
  }

  private getFullCvPath(): string {
    if (!this.candidate.cvUrl) return '';
    return `assets/cv/${this.candidate.cvUrl}`;
  }

  private generateCvFilename(): string {
    const candidateName = this.candidate.name.replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    return `CV_${candidateName}_${dateStr}.pdf`;
  }

  private handleCvError(error: any, action: string) {
    console.error(`Erreur ${action} CV:`, error);
    let message = `Échec du ${action} du CV. Veuillez réessayer.`;

    if (error.status === 404 || error.message?.includes('404')) {
      message = `Le fichier CV est introuvable.`;
    } else if (error.status === 403) {
      message = 'Accès interdit au fichier CV.';
    } else if (error.message?.includes('Failed to load')) {
      message = 'Le fichier CV est corrompu ou inaccessible.';
    }

    this.showError(message);
  }

  private showError(message: string) {
    alert(message);
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

  navigateToEvaluation(stepId: string): void {
    const step = this.recruitmentSteps.find(s => s.id === stepId);
    if (!step) return;

    this.router.navigate(
      [{ outlets: { modal: ['evaluation', stepId] } }],
      {
        state: {
          candidate: this.candidate,
          step: step
        }
      }
    ).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  togglePhoneMenu() {
    this.showPhoneMenu = !this.showPhoneMenu;
  }

  onClickOutside(event: MouseEvent) {
    if (this.showPhoneMenu && !this.phoneMenu.nativeElement.contains(event.target)) {
      this.showPhoneMenu = false;
    }
  }

  openEmailModal() {
    this.showEmailModal = true;
    this.showPhoneMenu = false;
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

  onClose() {
    this.close.emit();
  }

  viewCandidateFile() {
    const candidateFileContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
          }
          .header h1 {
            color: #4f46e5;
            margin-bottom: 10px;
          }
          .section {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .section-title {
            color: #4f46e5;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 1.2em;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 10px;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            background-color: #e0e7ff;
            color: #4f46e5;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .skill {
            background-color: #e0f2fe;
            color: #0369a1;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
          }
          .rating {
            color: #f59e0b;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PROFIL CANDIDAT</h1>
          <div class="status">${this.getStatusLabel(this.candidate.status)}</div>
        </div>

        <div class="section">
          <h2 class="section-title">INFORMATIONS PERSONNELLES</h2>
          <div class="info-grid">
            <div class="label">Nom:</div>
            <div>${this.candidate.name}</div>
            
            <div class="label">Email:</div>
            <div>${this.candidate.email || 'Non renseigné'}</div>
            
            <div class="label">Téléphone:</div>
            <div>${this.candidate.phone || 'Non renseigné'}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">ÉDUCATION</h2>
          <div>${this.candidate.education || 'Non renseigné'}</div>
        </div>

        <div class="section">
          <h2 class="section-title">EXPÉRIENCE</h2>
          <div>${this.candidate.experience || 'Non renseigné'}</div>
        </div>

        <div class="section">
          <h2 class="section-title">COMPÉTENCES</h2>
          <div class="skills">
            ${this.candidate.skills?.length
        ? this.candidate.skills.map(skill => `<span class="skill">${skill}</span>`).join('')
        : '<span>Non renseigné</span>'}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">ÉVALUATION</h2>
          <div>
            <strong>Score CV:</strong> 
            <span class="rating">
              ${this.candidate.evaluation?.rating ? '★'.repeat(this.candidate.evaluation.rating) + '☆'.repeat(5 - this.candidate.evaluation.rating) + ` (${this.candidate.evaluation.rating}/5)` : 'Non évalué'}
            </span>
          </div>
          ${this.candidate.evaluation?.comment ? `<div><strong>Commentaire:</strong> ${this.candidate.evaluation.comment}</div>` : ''}
        </div>
      </body>
    </html>
  `;

    const blob = new Blob([candidateFileContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');

    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      };
    } else {
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  }
}