import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { JobDescription, KanbanColumn, KanbanItem } from './interfaces/kanban.interface';
import { KanbanColumnComponent } from './components/kanban-column.component';
import { KanbanItemComponent } from './components/kanban-item.component';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobDescriptionModalComponent } from './job-description-modal/job-description-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    RouterOutlet,
    JobDescriptionModalComponent,
  ]
})
export class AppComponent {
  #http = inject(HttpClient);
  router = inject(Router);

  // Variables pour la sidebar
  isSidebarCollapsed = false;
  activeSection: string = 'candidates';

  // Méthode pour basculer la sidebar
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Méthode pour changer de section
 setActiveSection(section: string) {
  console.log('setActiveSection called with:', section);
  this.activeSection = section;
  if (window.innerWidth < 768) {
    this.isSidebarCollapsed = true;
  }
}

  // Utilisation de signal pour une réactivité facile
  columns = signal<KanbanColumn[]>([]);
  selectedCandidate: KanbanItem | null = null;
  showDashboard = false;
  newColumnTitle = '';
  showAddColumnForm = false;
  showJobDescriptionModal = false;

  jobDescription: JobDescription = {
    title: "Développeur Full Stack Angular/Node.js",
    technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
    transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
    requiredExperience: "3+ ans d'expérience en développement Full Stack",
    educationLevel: "Bac+5 en informatique ou équivalent"
  };

  constructor() {
    // Chargement initial des données avec statut et progression initiaux
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

  drop(event: CdkDragDrop<KanbanItem[]>) {
    const cols = [...this.columns()];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const targetColumn = cols.find(c => c.tickets === event.container.data);

      if (targetColumn) {
        // Met à jour le statut ET la progression
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

  addNewColumn() {
    if (this.newColumnTitle.trim()) {
      const newColumn: KanbanColumn = {
        id: Date.now().toString(),
        title: this.newColumnTitle,
        tickets: []
      };
      this.columns.update(cols => [...cols, newColumn]);
      this.newColumnTitle = '';
      this.showAddColumnForm = false;
    }
  }

  deleteColumn(columnId: string) {
    this.columns.update(cols => cols.filter(c => c.id !== columnId));
  }

  updateColumnTitle(columnId: string, newTitle: string) {
    this.columns.update(cols =>
      cols.map(c => c.id === columnId ? { ...c, title: newTitle } : c)
    );
  }

  viewJobPost() {
    this.showJobDescriptionModal = true;
  }

  closeJobDescriptionModal() {
    this.showJobDescriptionModal = false;
  }


}