import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { JobDescription, KanbanColumn, KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
import { KanbanColumnComponent } from '../components/kanban-column.component';
import { KanbanItemComponent } from '../components/kanban-item.component';
import { CandidateDashboardComponent } from '../components/candidate-dashboard/candidate-dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobDescriptionModalComponent } from '../job-description-modal/job-description-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KanbanColumnComponent,
    CandidateDashboardComponent,
    KanbanItemComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    JobDescriptionModalComponent,
  ]
})
export class KanbanComponent {
  #http = inject(HttpClient);
  #dialog = inject(MatDialog);

  columns = signal<KanbanColumn[]>([]);
  selectedCandidate: KanbanItem | null = null;
  showDashboard = false;
  newColumnTitle = '';
  showAddColumnForm = false;
  showJobDescriptionModal = false;

  recruitmentSteps: RecruitmentStep[] = [
    { 
      id: 'PresSelectionne', 
      label: 'Pré-sélectionné', 
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
      label: 'Embauché(e)', 
      color: '#10b981',
      bgColor: '#ecfdf5',
      noteType: 'Générale',
      order: 4
    }
  ];

  jobDescription: JobDescription = {
    title: "Développeur Full Stack Angular/Node.js",
    technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
    transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
    requiredExperience: "3+ ans d'expérience en développement Full Stack",
    educationLevel: "Bac+5 en informatique ou équivalent"
  };

  constructor() {
    this.#http.get<KanbanColumn[]>('./data.json').subscribe(data => {
      const processedData = data.map(column => ({
        ...column,
        tickets: column.tickets.map(ticket => ({
          ...ticket,
          status: this.getStatusFromColumnTitle(column.title),
          progress: this.getProgressFromColumnTitle(column.title)
        }))
      }));
      this.columns.set(processedData);
    });
  }

  onCandidateSelected(candidate: KanbanItem) {
    this.selectedCandidate = candidate;
    this.showDashboard = true;
  }

  onCloseDashboard() {
    this.showDashboard = false;
  }

  stats = computed(() => {
    const cols = this.columns();
    if (!cols) return null;

    return {
      presSelectionne: cols.find(c => c.title === 'Pré-sélectionné')?.tickets.length || 0,
      rhInterview: cols.find(c => c.title === 'Entretien RH')?.tickets.length || 0,
      technique: cols.find(c => c.title === 'Entretien Technique')?.tickets.length || 0,
      embauche: cols.find(c => c.title === 'Embauché(e)')?.tickets.length || 0,
      refuse: cols.find(c => c.title === 'Refusé')?.tickets.length || 0
    };
  });

  listDrop(event: CdkDragDrop<undefined>) {
    const cols = [...this.columns()];
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
    this.columns.set(cols);
  }

  async drop(event: CdkDragDrop<KanbanItem[]>) {
    const cols = [...this.columns()];
    const previousColumn = cols.find(c => c.tickets === event.previousContainer.data);
    const targetColumn = cols.find(c => c.tickets === event.container.data);

    if (!previousColumn || !targetColumn) return;

    const item = event.previousContainer.data[event.previousIndex];
    const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

    if (isMovingBackward) {
      const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: { 
          message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ? 
          Cette action le fera revenir à une étape antérieure.` 
        }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const updatedItem = {
        ...item,
        status: this.getStatusFromColumnTitle(targetColumn.title),
        progress: this.getProgressFromColumnTitle(targetColumn.title)
      };

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      event.container.data[event.currentIndex] = updatedItem;
    }

    this.columns.set(cols);
  }

  private getStatusFromColumnTitle(columnTitle: string): string {
    const statusMap: Record<string, string> = {
      'Pré-sélectionné': 'PresSelectionne',
      'Entretien RH': 'RH Interview',
      'Entretien Technique': 'Technique',
      'Embauché(e)': 'Embauché(e)',
      'Refusé': 'Refusé'
    };
    return statusMap[columnTitle] || columnTitle;
  }

  private getProgressFromColumnTitle(columnTitle: string): number {
    const progressMap: Record<string, number> = {
      'Pré-sélectionné': 25,
      'Entretien RH': 50,
      'Entretien Technique': 75,
      'Embauché(e)': 100,
      'Refusé': 0
    };
    return progressMap[columnTitle] || 0;
  }

  private isMovingBackward(previousTitle: string, newTitle: string): boolean {
    const statusOrder = [
      'Pré-sélectionné',
      'Entretien RH',
      'Entretien Technique',
      'Embauché(e)'
    ];
    
    const prevIndex = statusOrder.indexOf(previousTitle);
    const newIndex = statusOrder.indexOf(newTitle);
    
    return newIndex < prevIndex && newIndex !== -1;
  }

  addNewColumn() {
    if (this.newColumnTitle.trim()) {
      const newStep: RecruitmentStep = {
        id: this.newColumnTitle.replace(/\s+/g, ''),
        label: this.newColumnTitle,
        color: this.getRandomColor(),
        bgColor: this.getLightColor(),
        noteType: 'Générale',
        order: this.recruitmentSteps.length + 1
      };

      this.recruitmentSteps.push(newStep);

      const newColumn: KanbanColumn = {
        id: newStep.id,
        title: newStep.label,
        tickets: []
      };
      
      this.columns.update(cols => [...cols, newColumn]);
      this.newColumnTitle = '';
      this.showAddColumnForm = false;
    }
  }

  deleteColumn(columnId: string) {
    this.columns.update(cols => cols.filter(c => c.id !== columnId));
    this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
  }

  updateColumnTitle(columnId: string, newTitle: string) {
    this.columns.update(cols =>
      cols.map(c => c.id === columnId ? { ...c, title: newTitle } : c)
    );
    
    this.recruitmentSteps = this.recruitmentSteps.map(s => 
      s.id === columnId ? { ...s, label: newTitle } : s
    );
  }

  viewJobPost() {
    this.showJobDescriptionModal = true;
  }

  closeJobDescriptionModal() {
    this.showJobDescriptionModal = false;
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private getLightColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 95%)`;
  }
}