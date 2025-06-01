import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KanbanItem, RecruitmentStep, SkillEvaluation, CandidateNote } from '../../interfaces/kanban.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SendEmailToCandidateComponent } from '../../send-email-to-candidate/send-email-to-candidate.component'; // Ajoutez cette ligne

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,SendEmailToCandidateComponent],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent {
  @Input() candidate!: KanbanItem;
  @Output() close = new EventEmitter<void>();

  newNoteContent = '';
  showNotesModal = false;
  currentPhaseId = '';
  showEvaluationModal = false;
  evaluationPhase = '';
  currentEvaluations: SkillEvaluation[] = [];
  phaseSkills: Record<string, SkillEvaluation[]> = {};

  recruitmentSteps: RecruitmentStep[] = [
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeCandidateData();
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

 


  private getRandomColor(): string {
    const colors = [
      '#f59e0b', // amber-500
      '#10b981', // emerald-500
      '#3b82f6', // blue-500
      '#6366f1', // indigo-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#ef4444'  // red-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getLightColor(): string {
    const colors = [
      '#fef3c7', // amber-100
      '#d1fae5', // emerald-100
      '#dbeafe', // blue-100
      '#e0e7ff', // indigo-100
      '#ede9fe', // violet-100
      '#fce7f3', // pink-100
      '#fee2e2'  // red-100
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
    const statusMap: Record<string, string> = {
      'PresSelectionne': 'Pré-sélectionné',
      'RH Interview': 'Entretien RH',
      'Technique': 'Entretien Technique',
      'Embauché(e)': 'Embauché(e)',
      'Refusé': 'Refusé'
    };
    return statusMap[status] || status;
  }

  isActiveOrCompleted(stepId: string): boolean {
    const stepOrder = this.recruitmentSteps.map(step => step.id);
    const currentIndex = stepOrder.indexOf(this.candidate.status);
    const stepIndex = stepOrder.indexOf(stepId);
    return stepIndex <= currentIndex;
  }

  isCompleted(stepId: string): boolean {
    const stepOrder = this.recruitmentSteps.map(step => step.id);
    const currentIndex = stepOrder.indexOf(this.candidate.status);
    const stepIndex = stepOrder.indexOf(stepId);
    return stepIndex < currentIndex;
  }

  getProgress(stepId: string): number {
    const stepOrder = this.recruitmentSteps.map(step => step.id);
    const currentIndex = stepOrder.indexOf(this.candidate.status);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 100;
    if (stepIndex === currentIndex) return 50;
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


showEmailModal = false;

openEmailModal() {
  this.showEmailModal = true;
}

closeEmailModal() {
  this.showEmailModal = false;
}

sendEmail(emailData: any) {
  // Le traitement est maintenant dans le composant enfant
  console.log('Email envoyé:', emailData);
  this.showEmailModal = false;
}
  
}