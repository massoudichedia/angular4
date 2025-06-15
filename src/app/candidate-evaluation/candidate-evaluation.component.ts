import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Skill {
  name: string;
  required: number;
  acquired: number;
}

@Component({
  selector: 'app-candidate-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-evaluation.component.html',
  styleUrls: ['./candidate-evaluation.component.css']
})
export class CandidateEvaluationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  candidate?: KanbanItem;
  step?: RecruitmentStep;
  comments: string = '';

  technicalSkills: Skill[] = [
    { name: 'Angular', required: 4, acquired: 0 },
    { name: 'Vue.js', required: 3, acquired: 0 },
    { name: 'Développement Web', required: 4, acquired: 0 },
    { name: 'Développement Mobile', required: 3, acquired: 0 }
  ];

  languageSkills: Skill[] = [
    { name: 'Français', required: 5, acquired: 0 },
    { name: 'Anglais', required: 4, acquired: 0 },
    { name: 'Arabe', required: 3, acquired: 0 }
  ];

  softSkills: Skill[] = [
    { name: 'Communication', required: 4, acquired: 0 },
    { name: 'Esprit d\'équipe', required: 4, acquired: 0 },
    { name: 'Capacité d\'adaptation', required: 3, acquired: 0 },
    { name: 'Gestion du temps', required: 3, acquired: 0 },
    { name: 'Résolution de problèmes', required: 4, acquired: 0 }
  ];

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { candidate: KanbanItem, step: RecruitmentStep };
    
    if (state) {
      this.candidate = state.candidate;
      this.step = state.step;
    } else {
      this.close();
    }
  }

  get technicalTotal(): number {
    return this.technicalSkills.reduce((sum, skill) => sum + skill.acquired, 0);
  }

  get technicalMax(): number {
    return this.technicalSkills.reduce((sum, skill) => sum + skill.required, 0);
  }

  get languageTotal(): number {
    return this.languageSkills.reduce((sum, skill) => sum + skill.acquired, 0);
  }

  get languageMax(): number {
    return this.languageSkills.reduce((sum, skill) => sum + skill.required, 0);
  }

  get softSkillsTotal(): number {
    return this.softSkills.reduce((sum, skill) => sum + skill.acquired, 0);
  }

  get softSkillsMax(): number {
    return this.softSkills.reduce((sum, skill) => sum + skill.required, 0);
  }

  get isEvaluationComplete(): boolean {
    const allSkills = [...this.technicalSkills, ...this.languageSkills, ...this.softSkills];
    return allSkills.every(skill => skill.acquired > 0);
  }

  setRating(skillType: 'technicalSkills' | 'languageSkills' | 'softSkills', index: number, rating: number): void {
    this[skillType][index].acquired = rating;
  }

  get totalScore(): number {
    return this.technicalTotal + this.languageTotal + this.softSkillsTotal;
  }

  get maxPossibleScore(): number {
    return this.technicalMax + this.languageMax + this.softSkillsMax;
  }

  get ratingText(): string {
    const percentage = (this.totalScore / this.maxPossibleScore) * 100;
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Bon';
    if (percentage >= 50) return 'Moyen';
    return 'Insuffisant';
  }

  get mention(): string {
    const percentage = (this.totalScore / this.maxPossibleScore) * 100;
    if (percentage >= 90) return 'Très Bien';
    if (percentage >= 80) return 'Bien';
    if (percentage >= 70) return 'Assez Bien';
    if (percentage >= 50) return 'Passable';
    return 'Insuffisant';
  }

  get ratingClass(): string {
    const text = this.ratingText.toLowerCase();
    return text === 'insuffisant' ? 'average' : text;
  }

  goBack(): void {
  // Ferme le modal ET navigue vers le dashboard du candidat
  this.router.navigate([{ outlets: { modal: null } }], {
    state: { 
      candidate: this.candidate,
      returnToDashboard: true 
    }
  });
}
  close(): void {
    // Ferme le modal proprement
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  closeOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close();
    }
  }

  submit(): void {
    if (!this.candidate || !this.step) return;

    const evaluation = {
      date: new Date(),
      candidate: this.candidate.id,
      step: this.step.id,
      technicalSkills: this.technicalSkills,
      languageSkills: this.languageSkills,
      softSkills: this.softSkills,
      comments: this.comments,
      totalScore: this.totalScore,
      maxPossibleScore: this.maxPossibleScore,
      rating: this.ratingText,
      mention: this.mention
    };

    try {
      localStorage.setItem(
        `evaluation-${this.candidate.id}-${this.step.id}`,
        JSON.stringify(evaluation)
      );
      this.close();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }


  
}