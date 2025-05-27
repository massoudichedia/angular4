import { Component, inject, HostListener } from '@angular/core';
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
  template: `
    <div class="overlay" (click)="closeOnOverlay($event)">
      <div class="modal" tabindex="0">
        <header>
          <div class="header-content">
            <h2>Évaluation du candidat</h2>
            <div class="candidate-info">
              <img [src]="candidate?.avatar" alt="Photo" class="candidate-avatar">
              <div>
                <h3>{{ candidate?.name }}</h3>
                <p>{{ step?.label }}</p>
              </div>
            </div>
          </div>
          <button class="close-btn" (click)="close()" aria-label="Fermer modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div class="modal-content">
          <form *ngIf="candidate && step" (ngSubmit)="submit()" #evaluationForm="ngForm">
            <div class="evaluation-grid">
              <div class="grid-header">
                <span>Compétence</span>
                <span>Niveau requis</span>
                <span>Évaluation</span>
                <span>Note</span>
              </div>

              <!-- Compétences techniques -->
              <div class="skill-category">Compétences Techniques</div>
              
              <div *ngFor="let skill of technicalSkills; let i = index" class="skill-row">
                <div class="skill-name">{{ skill.name }}</div>
                
                <div class="required-level">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.required">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="evaluation-stars">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.acquired"
                          (click)="setRating('technicalSkills', i, star)">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="skill-rating">
                  {{ skill.acquired }}/5
                </div>
              </div>

              <!-- Total Compétences Techniques -->
              <div class="skill-total">
                <div>Total Compétences Techniques</div>
                <div>{{ technicalTotal }}/{{ technicalMax }}</div>
              </div>

              <!-- Compétences linguistiques -->
              <div class="skill-category">Langues</div>
              
              <div *ngFor="let skill of languageSkills; let i = index" class="skill-row">
                <div class="skill-name">{{ skill.name }}</div>
                
                <div class="required-level">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.required">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="evaluation-stars">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.acquired"
                          (click)="setRating('languageSkills', i, star)">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="skill-rating">
                  {{ skill.acquired }}/5
                </div>
              </div>

              <!-- Total Langues -->
              <div class="skill-total">
                <div>Total Langues</div>
                <div>{{ languageTotal }}/{{ languageMax }}</div>
              </div>

              <!-- Soft Skills -->
              <div class="skill-category">Compétences Comportementales</div>
              
              <div *ngFor="let skill of softSkills; let i = index" class="skill-row">
                <div class="skill-name">{{ skill.name }}</div>
                
                <div class="required-level">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.required">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="evaluation-stars">
                  <div class="stars">
                    <span *ngFor="let star of [1,2,3,4,5]" 
                          [class.active]="star <= skill.acquired"
                          (click)="setRating('softSkills', i, star)">
                      ★
                    </span>
                  </div>
                </div>
                
                <div class="skill-rating">
                  {{ skill.acquired }}/5
                </div>
              </div>

              <!-- Total Soft Skills -->
              <div class="skill-total">
                <div>Total Compétences Comportementales</div>
                <div>{{ softSkillsTotal }}/{{ softSkillsMax }}</div>
              </div>
            </div>

            <div class="comments-section">
              <h3>Commentaires</h3>
              <textarea [(ngModel)]="comments" name="comments" 
                        placeholder="Ajoutez vos remarques sur le candidat..." required></textarea>
            </div>

            <div class="summary-section">
              <div class="summary-card">
                <h4>Score total</h4>
                <div class="score">{{ totalScore }}/{{ maxPossibleScore }}</div>
                <div class="rating" [ngClass]="ratingClass">{{ ratingText }}</div>
              </div>
              <div class="summary-card">
                <h4>Mention</h4>
                <div class="mention">{{ mention }}</div>
              </div>
            </div>

            <div *ngIf="evaluationForm.valid && isEvaluationComplete" class="completion-message">
              Évaluation complète! Vous pouvez maintenant enregistrer.
            </div>

            <div class="actions">
              <button type="button" class="btn-cancel" (click)="close()">Annuler</button>
              <button type="submit" class="btn-submit" [disabled]="!evaluationForm.valid || !isEvaluationComplete">
                Enregistrer l'évaluation
              </button>
            </div>
          </form>

          <div *ngIf="!candidate || !step" class="loading-state">
            Chargement des informations du candidat...
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Overlay */
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
    }

    /* Modal */
    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    /* Header */
    header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-content {
      flex: 1;
    }

    header h2 {
      margin: 0 0 15px 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .candidate-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .candidate-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(255, 255, 255, 0.2);
    }

    .candidate-info h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .candidate-info p {
      margin: 5px 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn svg {
      width: 24px;
      height: 24px;
    }

    .close-btn:hover {
      opacity: 0.8;
    }

    /* Modal Content */
    .modal-content {
      padding: 25px;
      overflow-y: auto;
      flex: 1;
    }

    /* Evaluation Grid */
    .evaluation-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr 0.5fr;
      gap: 1px;
      background-color: #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 25px;
      border: 1px solid #e5e7eb;
    }

    .grid-header, .skill-row {
      display: contents;
    }

    .skill-category {
      grid-column: 1 / -1;
      background-color: #f3f4f6;
      padding: 10px 15px;
      font-weight: 600;
      color: #4f46e5;
      border-bottom: 1px solid #e5e7eb;
    }

    .grid-header span {
      background-color: #4f46e5;
      color: white;
      padding: 12px 15px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .skill-row > div {
      background-color: white;
      padding: 15px;
      display: flex;
      align-items: center;
    }

    .skill-name {
      font-weight: 500;
    }

    .stars {
      display: flex;
      gap: 5px;
    }

    .stars span {
      color: #d1d5db;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.2s;
    }

    .stars span.active {
      color: #f59e0b;
    }

    .evaluation-stars .stars span:hover {
      transform: scale(1.2);
    }

    .skill-rating {
      justify-content: center;
      font-weight: 600;
      color: #4f46e5;
    }

    /* Skill Total */
    .skill-total {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      padding: 12px 15px;
      background-color: #f8fafc;
      font-weight: 600;
      border-top: 2px solid #e5e7eb;
    }

    /* Comments */
    .comments-section {
      margin-bottom: 25px;
    }

    .comments-section h3 {
      margin-bottom: 10px;
      color: #374151;
      font-size: 1.1rem;
    }

    textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.3s;
    }

    textarea:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    /* Summary */
    .summary-section {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-bottom: 25px;
    }

    .summary-card {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 15px 20px;
      border: 1px solid #e5e7eb;
      text-align: center;
      min-width: 200px;
    }

    .summary-card h4 {
      margin: 0 0 10px 0;
      color: #6b7280;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .score {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 5px;
    }

    .rating {
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.85rem;
      display: inline-block;
    }

    .rating.excellent {
      background-color: #dcfce7;
      color: #16a34a;
    }

    .rating.good {
      background-color: #fef9c3;
      color: #ca8a04;
    }

    .rating.average {
      background-color: #fee2e2;
      color: #dc2626;
    }

    .mention {
      font-size: 1.2rem;
      font-weight: 700;
      color: #4f46e5;
      margin-top: 5px;
    }

    /* Completion Message */
    .completion-message {
      background-color: #dcfce7;
      color: #166534;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 500;
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Actions */
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    button {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-cancel {
      background-color: white;
      color: #4f46e5;
      border: 1px solid #d1d5db;
    }

    .btn-cancel:hover {
      background-color: #f3f4f6;
    }

    .btn-submit {
      background-color: #4f46e5;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #4338ca;
    }

    .btn-submit:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .evaluation-grid {
        grid-template-columns: 1.5fr 1fr 1.5fr 0.5fr;
      }
      
      header {
        flex-direction: column;
        gap: 15px;
      }
      
      .actions {
        flex-direction: column;
      }

      .summary-section {
        flex-direction: column;
        align-items: flex-end;
      }
    }

    @media (max-width: 480px) {
      .evaluation-grid {
        display: flex;
        flex-direction: column;
      }
      
      .grid-header {
        display: none;
      }
      
      .skill-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        margin-bottom: 1px;
      }
      
      .skill-row > div {
        grid-column: span 1;
      }
      
      .skill-name {
        grid-column: 1 / -1;
      }

      .skill-category {
        text-align: center;
      }
    }
  `]
})
export class CandidateEvaluationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  candidate?: KanbanItem;
  step?: RecruitmentStep;
  comments: string = '';

  // Compétences techniques
  technicalSkills: Skill[] = [
    { name: 'Angular', required: 4, acquired: 0 },
    { name: 'Vue.js', required: 3, acquired: 0 },
    { name: 'Développement Web', required: 4, acquired: 0 },
    { name: 'Développement Mobile', required: 3, acquired: 0 }
  ];

  // Compétences linguistiques
  languageSkills: Skill[] = [
    { name: 'Français', required: 5, acquired: 0 },
    { name: 'Anglais', required: 4, acquired: 0 },
    { name: 'Arabe', required: 3, acquired: 0 }
  ];

  // Soft Skills
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

  // Totaux par catégorie
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

  // Vérifie si l'évaluation est complète (toutes les compétences évaluées)
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

  close(): void {
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
      console.log('Évaluation sauvegardée:', evaluation);
      this.close();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }
}