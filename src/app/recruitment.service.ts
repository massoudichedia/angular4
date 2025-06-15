// recruitment.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RecruitmentStep {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  noteType: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {
  private recruitmentStepsSubject = new BehaviorSubject<RecruitmentStep[]>([
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
  ]);

  recruitmentSteps$ = this.recruitmentStepsSubject.asObservable();

  updateRecruitmentSteps(steps: RecruitmentStep[]) {
    this.recruitmentStepsSubject.next(steps);
  }

  addRecruitmentStep(step: RecruitmentStep) {
    const currentSteps = this.recruitmentStepsSubject.value;
    this.recruitmentStepsSubject.next([...currentSteps, step]);
  }

  getStatusFromColumnTitle(columnTitle: string): string {
    const statusMap: Record<string, string> = {
      'Pré-sélectionné': 'PresSelectionne',
      'Entretien RH': 'RH Interview',
      'Entretien Technique': 'Technique',
      'Embauché(e)': 'Embauché(e)',
      'Refusé': 'Refusé'
    };
    return statusMap[columnTitle] || columnTitle;
  }
}