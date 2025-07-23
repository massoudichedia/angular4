// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
// import {
//   CdkDrag,
//   CdkDragDrop,
//   CdkDropList,
//   CdkDropListGroup,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { JobDescription, KanbanColumn, KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
// import { KanbanColumnComponent } from '../components/kanban-column.component';
// import { KanbanItemComponent } from '../components/kanban-item.component';
// import { CandidateDashboardComponent } from '../components/candidate-dashboard/candidate-dashboard.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { JobDescriptionModalComponent } from '../job-description-modal/job-description-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
// import { PhaseService } from '../services/phase.service';
// import { CandidatsService } from '../services/candidats.service';
// import { EntretienService } from '../services/entretien.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-kanban',
//   templateUrl: './kanban.component.html',
//   styleUrls: ['./kanban.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     KanbanColumnComponent,
//     CandidateDashboardComponent,
//     KanbanItemComponent,
//     CdkDrag,
//     CdkDropList,
//     CdkDropListGroup,
//     JobDescriptionModalComponent,
//   ]
// })
// export class KanbanComponent implements OnInit {
//   private http = inject(HttpClient);
//   private dialog = inject(MatDialog);
//   private phaseService = inject(PhaseService);
//   private candidatsService = inject(CandidatsService);
//   private entretienService = inject(EntretienService);
//   private snackBar = inject(MatSnackBar);

//   columns = signal<KanbanColumn[]>([]);
//   selectedCandidate: KanbanItem | null = null;
//   showDashboard = false;
//   newColumnTitle = '';
//   showAddColumnForm = false;
//   showJobDescriptionModal = false;
//   errorMessage: string | null = null;

//   recruitmentSteps: RecruitmentStep[] = [
//     {
//       id: 'PresSelectionne',
//       label: 'Pré-sélectionné',
//       color: '#8b5cf6',
//       bgColor: '#f5f3ff',
//       noteType: 'RH',
//       order: 1
//     },
//     {
//       id: 'RH Interview',
//       label: 'Entretien RH',
//       color: '#3b82f6',
//       bgColor: '#eff6ff',
//       noteType: 'RH',
//       order: 2
//     },
//     {
//       id: 'Technique',
//       label: 'Entretien Technique',
//       color: '#06b6d4',
//       bgColor: '#ecfeff',
//       noteType: 'Technique',
//       order: 3
//     },
//     {
//       id: 'Embauché(e)',
//       label: 'Embauché(e)',
//       color: '#10b981',
//       bgColor: '#ecfdf5',
//       noteType: 'Générale',
//       order: 4
//     }
//   ];

//   jobDescription: JobDescription = {
//     title: "Développeur Full Stack Angular/Node.js",
//     technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
//     transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
//     requiredExperience: "3+ ans d'expérience en développement Full Stack",
//     educationLevel: "Bac+5 en informatique ou équivalent"
//   };

//   ngOnInit(): void {
//     this.loadBackendPhases();
//     this.loadCandidatesFromApi();
//   }

//   loadCandidatesFromApi(): void {
//   this.candidatsService.getCandidates().subscribe({
//     next: (apiData) => {
//       const processedData = apiData.map((column: any) => ({
//         id: column.id,
//         title: column.title,
//         tickets: column.tickets.map((ticket: any) => {
//           console.log("Ticket complet:", ticket);
//           return {
//             ...ticket,
//             id: ticket.id, // ID du JSON
//             candidateId: ticket.id, // ID du JSON
//             shortlistedId: ticket.shortlistedId // ID de la table ShortlistedCandidate
//           };
//         })
//       }));
//       this.columns.set(processedData);
//     },
//     error: (err) => {
//       console.error('Erreur:', err);
//       this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 5000 });
//     }
//   });
// }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'PresSelectionne': 25,
//       'RH Interview': 50,
//       'Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return statusProgressMap[status] || 0;
//   }

//   loadBackendPhases(): void {
//     this.phaseService.getAllPhasesFromBackend().subscribe({
//       next: (phases) => {
//         const backendColumns = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         this.columns.update(currentColumns => {
//           const existingIds = currentColumns.map(c => c.id);
//           const newColumns = backendColumns.filter(c => !existingIds.includes(c.id));
//           return [...currentColumns, ...newColumns];
//         });

//         phases.forEach(phase => {
//           if (!this.recruitmentSteps.some(step => step.id === phase.id.toString())) {
//             this.recruitmentSteps.push({
//               id: phase.id.toString(),
//               label: phase.title,
//               color: this.getRandomColor(),
//               bgColor: this.getLightColor(),
//               noteType: 'Générale',
//               order: phase.order || this.recruitmentSteps.length + 1
//             });
//           }
//         });
//       },
//       error: (err) => {
//         console.error('Error loading phases:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des phases',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   addNewColumn(): void {
//     if (!this.newColumnTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     this.phaseService.createPhase({
//       title: this.newColumnTitle.trim(),
//       order: this.recruitmentSteps.length + 1
//     }).subscribe({
//       next: (newPhase) => {
//         const phaseId = newPhase.id.toString();

//         this.recruitmentSteps = [...this.recruitmentSteps, {
//           id: phaseId,
//           label: newPhase.title,
//           color: this.getRandomColor(),
//           bgColor: this.getLightColor(),
//           noteType: 'Générale',
//           order: newPhase.order || this.recruitmentSteps.length + 1
//         }];

//         this.columns.update(cols => [...cols, {
//           id: phaseId,
//           title: newPhase.title,
//           tickets: []
//         }]);

//         this.newColumnTitle = '';
//         this.showAddColumnForm = false;
//         this.errorMessage = null;

//         this.snackBar.open('Phase créée avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err) => {
//         this.errorMessage = err.message || 'Erreur lors de la création de la phase';
//         if (this.errorMessage) {
//           this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
//         }
//       }
//     });
//   }

//   updatePhase(id: string, newTitle: string): void {
//     if (!newTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     const numericId = Number(id);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     this.phaseService.updatePhaseTitleInBackend(numericId, newTitle.trim()).subscribe({
//       next: (updatedPhase) => {
//         this.columns.update(cols =>
//           cols.map(c => c.id === id ? { ...c, title: updatedPhase.title } : c)
//         );

//         this.recruitmentSteps = this.recruitmentSteps.map(s =>
//           s.id === id ? { ...s, label: updatedPhase.title } : s
//         );

//         this.errorMessage = null;
//         this.snackBar.open('Phase mise à jour avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err) => {
//         this.errorMessage = 'Erreur lors de la mise à jour de la phase';
//         this.snackBar.open(
//           this.errorMessage,
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   deleteColumn(columnId: string): void {
//     const numericId = Number(columnId);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '400px',
//       data: {
//         message: `Êtes-vous sûr de vouloir supprimer cette phase ? Tous les candidats associés seront perdus.`
//       }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.phaseService.deletePhaseFromBackend(numericId).subscribe({
//           next: () => {
//             this.columns.update(cols => cols.filter(c => c.id !== columnId));
//             this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
//             this.snackBar.open('Phase supprimée avec succès', 'Fermer', {
//               duration: 3000
//             });
//           },
//           error: (err) => {
//             this.errorMessage = 'Erreur lors de la suppression de la phase';
//             this.snackBar.open(
//               this.errorMessage,
//               'Fermer',
//               { duration: 5000 }
//             );
//           }
//         });
//       }
//     });
//   }

//   onCandidateSelected(candidate: KanbanItem): void {
//     this.selectedCandidate = candidate;
//     this.showDashboard = true;
//   }

//   onCloseDashboard(): void {
//     this.showDashboard = false;
//   }

//   stats = computed(() => {
//     const cols = this.columns();
//     if (!cols) return null;

//     return {
//       presSelectionne: cols.find(c => c.title === 'Pré-sélectionné')?.tickets.length || 0,
//       rhInterview: cols.find(c => c.title === 'Entretien RH')?.tickets.length || 0,
//       technique: cols.find(c => c.title === 'Entretien Technique')?.tickets.length || 0,
//       embauche: cols.find(c => c.title === 'Embauché(e)')?.tickets.length || 0,
//       refuse: cols.find(c => c.title === 'Refusé')?.tickets.length || 0
//     };
//   });

//   listDrop(event: CdkDragDrop<undefined>): void {
//     const cols = [...this.columns()];
//     moveItemInArray(cols, event.previousIndex, event.currentIndex);
//     this.columns.set(cols);
//   }

//   async drop(event: CdkDragDrop<KanbanItem[]>): Promise<void> {
//     const cols = [...this.columns()];
//     const previousColumn = cols.find(c => c.tickets === event.previousContainer.data);
//     const targetColumn = cols.find(c => c.tickets === event.container.data);

//     if (!previousColumn || !targetColumn) return;

//     const item = event.previousContainer.data[event.previousIndex];
//     const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

//     if (isMovingBackward) {
//       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//         width: '400px',
//         data: {
//           message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ?`
//         }
//       });

//       const result = await dialogRef.afterClosed().toPromise();
//       if (!result) return;
//     }

//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       const updatedItem = {
//         ...item,
//         status: this.getStatusFromColumnTitle(targetColumn.title),
//         progress: this.getProgressFromColumnTitle(targetColumn.title)
//       };

//       try {
//         // Convertir l'ID en nombre
//         console.log("Candidate ID being sent:", item.id); // Debugging: Check the ID
//         const candidateId = parseInt(item.id);

//         if (isNaN(candidateId)) {
//           throw new Error('ID de candidat invalide');
//         }

//         // Appel au service
//         const response = await this.entretienService.createAuto(candidateId, targetColumn.title);

//         // Déplacer le candidat après confirmation de la création
//         transferArrayItem(
//           event.previousContainer.data,
//           event.container.data,
//           event.previousIndex,
//           event.currentIndex
//         );

//         event.container.data[event.currentIndex] = updatedItem;

//         // Afficher message seulement si nouvel entretien créé
//         if (response.success && !response.exists) {
//           this.snackBar.open('Entretien créé avec succès', 'Fermer', { duration: 3000 });
//         }

//       } catch (error) {
//         console.error('Erreur:', error);
//         let errorMessage = 'Erreur inconnue'; // Default error message

//         if (error instanceof Error) {
//           errorMessage = error.message;
//         } else if (isHttpErrorResponse(error)) {
//           // Now TypeScript knows 'error' is an HttpErrorResponse
//           if (error.error && error.error.message) {
//             errorMessage = error.error.message;
//           }
//         }

//         this.snackBar.open(
//           errorMessage, // Use the more specific error message
//           'Fermer',
//           { duration: 5000 }
//         );
//         return; // Ne pas déplacer le candidat en cas d'erreur
//       }
//     }

//     this.columns.set(cols);
//   }

//   private isMovingBackward(previousTitle: string, newTitle: string): boolean {
//     const previousStep = this.recruitmentSteps.find(step => step.label === previousTitle);
//     const newStep = this.recruitmentSteps.find(step => step.label === newTitle);

//     if (!previousStep || !newStep) return false;
//     return newStep.order < previousStep.order;
//   }

//   private getStatusFromColumnTitle(columnTitle: string): string {
//     const statusMap: Record<string, string> = {
//       'Pré-sélectionné': 'PresSelectionne',
//       'Entretien RH': 'RH Interview',
//       'Technique': 'Technique',
//       'Embauché(e)': 'Embauché(e)',
//       'Refusé': 'Refusé'
//     };
//     return statusMap[columnTitle] || columnTitle;
//   }

//   private getProgressFromColumnTitle(columnTitle: string): number {
//     const progressMap: Record<string, number> = {
//       'Pré-sélectionné': 25,
//       'Entretien RH': 50,
//       'Entretien Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return progressMap[columnTitle] || 0;
//   }

//   private getRandomColor(): string {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   private getLightColor(): string {
//     const hue = Math.floor(Math.random() * 360);
//     return `hsl(${hue}, 100%, 95%)`;
//   }

//   updateColumnTitle(columnId: string, newTitle: string): void {
//     this.updatePhase(columnId, newTitle);
//   }

//   viewJobPost(): void {
//     this.showJobDescriptionModal = true;
//   }

//   closeJobDescriptionModal(): void {
//     this.showJobDescriptionModal = false;
//   }
// }

// // Type guard function
// function isHttpErrorResponse(error: any): error is HttpErrorResponse {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'status' in error &&
//     'statusText' in error &&
//     'url' in error
//   );
// }

// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import {
//   CdkDrag,
//   CdkDragDrop,
//   CdkDropList,
//   CdkDropListGroup,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { JobDescription, KanbanColumn, KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
// import { KanbanColumnComponent } from '../components/kanban-column.component';
// import { KanbanItemComponent } from '../components/kanban-item.component';
// import { CandidateDashboardComponent } from '../components/candidate-dashboard/candidate-dashboard.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { JobDescriptionModalComponent } from '../job-description-modal/job-description-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
// import { PhaseService } from '../services/phase.service';
// import { CandidatsService } from '../services/candidats.service';
// import { EntretienService } from '../services/entretien.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-kanban',
//   templateUrl: './kanban.component.html',
//   styleUrls: ['./kanban.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     KanbanColumnComponent,
//     CandidateDashboardComponent,
//     KanbanItemComponent,
//     CdkDrag,
//     CdkDropList,
//     CdkDropListGroup,
//     JobDescriptionModalComponent,
//   ]
// })
// export class KanbanComponent implements OnInit {
//   private http = inject(HttpClient);
//   private dialog = inject(MatDialog);
//   private phaseService = inject(PhaseService);
//   private candidatsService = inject(CandidatsService);
//   private entretienService = inject(EntretienService);
//   private snackBar = inject(MatSnackBar);

//   columns = signal<KanbanColumn[]>([]);
//   selectedCandidate: KanbanItem | null = null;
//   showDashboard = false;
//   newColumnTitle = '';
//   showAddColumnForm = false;
//   showJobDescriptionModal = false;
//   errorMessage: string | null = null;

//   recruitmentSteps: RecruitmentStep[] = [
//     {
//       id: 'PresSelectionne',
//       label: 'Pré-sélectionné',
//       color: '#8b5cf6',
//       bgColor: '#f5f3ff',
//       noteType: 'RH',
//       order: 1
//     },
//     {
//       id: 'RH Interview',
//       label: 'Entretien RH',
//       color: '#3b82f6',
//       bgColor: '#eff6ff',
//       noteType: 'RH',
//       order: 2
//     },
//     {
//       id: 'Technique',
//       label: 'Entretien Technique',
//       color: '#06b6d4',
//       bgColor: '#ecfeff',
//       noteType: 'Technique',
//       order: 3
//     },
//     {
//       id: 'Embauché(e)',
//       label: 'Embauché(e)',
//       color: '#10b981',
//       bgColor: '#ecfdf5',
//       noteType: 'Générale',
//       order: 4
//     }
//   ];

//   jobDescription: JobDescription = {
//     title: "Développeur Full Stack Angular/Node.js",
//     technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
//     transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
//     requiredExperience: "3+ ans d'expérience en développement Full Stack",
//     educationLevel: "Bac+5 en informatique ou équivalent"
//   };

//   ngOnInit(): void {
//     this.loadBackendPhases();
//     this.loadCandidatesFromApi();
//   }

//   loadCandidatesFromApi(): void {
//     this.candidatsService.getCandidates().subscribe({
//       next: (kanbanData: KanbanColumn[]) => {
//         this.columns.set(kanbanData);
//       },
//       error: (err: any) => {
//         console.error('Erreur lors du chargement des candidats:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des candidats',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'PresSelectionne': 25,
//       'RH Interview': 50,
//       'Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return statusProgressMap[status] || 0;
//   }

//   loadBackendPhases(): void {
//     this.phaseService.getAllPhasesFromBackend().subscribe({
//       next: (phases) => {
//         const backendColumns = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         this.columns.update(currentColumns => {
//           const existingIds = currentColumns.map(c => c.id);
//           const newColumns = backendColumns.filter(c => !existingIds.includes(c.id));
//           return [...currentColumns, ...newColumns];
//         });

//         phases.forEach(phase => {
//           if (!this.recruitmentSteps.some(step => step.id === phase.id.toString())) {
//             this.recruitmentSteps.push({
//               id: phase.id.toString(),
//               label: phase.title,
//               color: this.getRandomColor(),
//               bgColor: this.getLightColor(),
//               noteType: 'Générale',
//               order: phase.order || this.recruitmentSteps.length + 1
//             });
//           }
//         });
//       },
//       error: (err: any) => {
//         console.error('Error loading phases:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des phases',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   addNewColumn(): void {
//     if (!this.newColumnTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     this.phaseService.createPhase({
//       title: this.newColumnTitle.trim(),
//       order: this.recruitmentSteps.length + 1
//     }).subscribe({
//       next: (newPhase) => {
//         const phaseId = newPhase.id.toString();

//         this.recruitmentSteps = [...this.recruitmentSteps, {
//           id: phaseId,
//           label: newPhase.title,
//           color: this.getRandomColor(),
//           bgColor: this.getLightColor(),
//           noteType: 'Générale',
//           order: newPhase.order || this.recruitmentSteps.length + 1
//         }];

//         this.columns.update(cols => [...cols, {
//           id: phaseId,
//           title: newPhase.title,
//           tickets: []
//         }]);

//         this.newColumnTitle = '';
//         this.showAddColumnForm = false;
//         this.errorMessage = null;

//         this.snackBar.open('Phase créée avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = err.message || 'Erreur lors de la création de la phase';
//         if (this.errorMessage) {
//           this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
//         }
//       }
//     });
//   }

//   updatePhase(id: string, newTitle: string): void {
//     if (!newTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     const numericId = Number(id);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     this.phaseService.updatePhaseTitleInBackend(numericId, newTitle.trim()).subscribe({
//       next: (updatedPhase) => {
//         this.columns.update(cols =>
//           cols.map(c => c.id === id ? { ...c, title: updatedPhase.title } : c)
//         );

//         this.recruitmentSteps = this.recruitmentSteps.map(s =>
//           s.id === id ? { ...s, label: updatedPhase.title } : s
//         );

//         this.errorMessage = null;
//         this.snackBar.open('Phase mise à jour avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = 'Erreur lors de la mise à jour de la phase';
//         this.snackBar.open(
//           this.errorMessage,
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   deleteColumn(columnId: string): void {
//     const numericId = Number(columnId);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '400px',
//       data: {
//         message: `Êtes-vous sûr de vouloir supprimer cette phase ? Tous les candidats associés seront perdus.`
//       }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.phaseService.deletePhaseFromBackend(numericId).subscribe({
//           next: () => {
//             this.columns.update(cols => cols.filter(c => c.id !== columnId));
//             this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
//             this.snackBar.open('Phase supprimée avec succès', 'Fermer', {
//               duration: 3000
//             });
//           },
//           error: (err: any) => {
//             this.errorMessage = 'Erreur lors de la suppression de la phase';
//             this.snackBar.open(
//               this.errorMessage,
//               'Fermer',
//               { duration: 5000 }
//             );
//           }
//         });
//       }
//     });
//   }

//   onCandidateSelected(candidate: KanbanItem): void {
//     this.selectedCandidate = candidate;
//     this.showDashboard = true;
//   }

//   onCloseDashboard(): void {
//     this.showDashboard = false;
//   }

//   stats = computed(() => {
//     const cols = this.columns();
//     if (!cols) return null;

//     return {
//       presSelectionne: cols.find(c => c.title === 'Pré-sélectionné')?.tickets.length || 0,
//       rhInterview: cols.find(c => c.title === 'Entretien RH')?.tickets.length || 0,
//       technique: cols.find(c => c.title === 'Entretien Technique')?.tickets.length || 0,
//       embauche: cols.find(c => c.title === 'Embauché(e)')?.tickets.length || 0,
//       refuse: cols.find(c => c.title === 'Refusé')?.tickets.length || 0
//     };
//   });

//   listDrop(event: CdkDragDrop<undefined>): void {
//     const cols = [...this.columns()];
//     moveItemInArray(cols, event.previousIndex, event.currentIndex);
//     this.columns.set(cols);
//   }

//   async drop(event: CdkDragDrop<KanbanItem[]>): Promise<void> {
//     const cols = [...this.columns()];
//     const previousColumn = cols.find(c => c.tickets === event.previousContainer.data);
//     const targetColumn = cols.find(c => c.tickets === event.container.data);

//     if (!previousColumn || !targetColumn) return;

//     const item = event.previousContainer.data[event.previousIndex];
//     const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

//     if (isMovingBackward) {
//       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//         width: '400px',
//         data: {
//           message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ?`
//         }
//       });

//       const result = await dialogRef.afterClosed().toPromise();
//       if (!result) return;
//     }

//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       const updatedItem = {
//         ...item,
//         status: this.getStatusFromColumnTitle(targetColumn.title),
//         progress: this.getProgressFromColumnTitle(targetColumn.title)
//       };

//       try {
//         // Utiliser shortlistedId pour créer l'entretien
//         console.log("Shortlisted ID being sent:", item.shortlistedId);

//         // Vérifier si item.shortlistedId est null ou undefined
//         if (item.shortlistedId === null || item.shortlistedId === undefined) {
//           throw new Error('Shortlisted ID est manquant');
//         }

//         const response = await this.entretienService.createAuto(
//           item.shortlistedId,
//           targetColumn.title
//         );

//         transferArrayItem(
//           event.previousContainer.data,
//           event.container.data,
//           event.previousIndex,
//           event.currentIndex
//         );

//         event.container.data[event.currentIndex] = updatedItem;

//         if (response.success && !response.exists) {
//           this.snackBar.open('Entretien créé avec succès', 'Fermer', { duration: 3000 });
//         }

//       } catch (error) {
//         console.error('Erreur:', error);
//         let errorMessage = 'Erreur inconnue';

//         if (error instanceof Error) {
//           errorMessage = error.message;
//         } else if (isHttpErrorResponse(error)) {
//           errorMessage = error.error?.message || error.message;
//         }

//         this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
//         return;
//       }
//     }

//     this.columns.set(cols);
//   }

//   private isMovingBackward(previousTitle: string, newTitle: string): boolean {
//     const previousStep = this.recruitmentSteps.find(step => step.label === previousTitle);
//     const newStep = this.recruitmentSteps.find(step => step.label === newTitle);

//     if (!previousStep || !newStep) return false;
//     return newStep.order < previousStep.order;
//   }

//   private getStatusFromColumnTitle(columnTitle: string): string {
//     const statusMap: Record<string, string> = {
//       'Pré-sélectionné': 'PresSelectionne',
//       'RH Interview': 'RH Interview',
//       'Technique': 'Technique',
//       'Embauché(e)': 'Embauché(e)',
//       'Refusé': 'Refusé'
//     };
//     return statusMap[columnTitle] || columnTitle;
//   }

//   private getProgressFromColumnTitle(columnTitle: string): number {
//     const progressMap: Record<string, number> = {
//       'Pré-sélectionné': 25,
//       'RH Interview': 50,
//       'Entretien Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return progressMap[columnTitle] || 0;
//   }

//   private getRandomColor(): string {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   private getLightColor(): string {
//     const hue = Math.floor(Math.random() * 360);
//     return `hsl(${hue}, 100%, 95%)`;
//   }

//   updateColumnTitle(columnId: string, newTitle: string): void {
//     this.updatePhase(columnId, newTitle);
//   }

//   viewJobPost(): void {
//     this.showJobDescriptionModal = true;
//   }

//   closeJobDescriptionModal(): void {
//     this.showJobDescriptionModal = false;
//   }
// }

// // Type guard function
// function isHttpErrorResponse(error: any): error is HttpErrorResponse {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'status' in error &&
//     'statusText' in error &&
//     'url' in error
//   );
// }
// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import {
//   CdkDrag,
//   CdkDragDrop,
//   CdkDropList,
//   CdkDropListGroup,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { JobDescription, KanbanColumn, KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
// import { KanbanColumnComponent } from '../components/kanban-column.component';
// import { KanbanItemComponent } from '../components/kanban-item.component';
// import { CandidateDashboardComponent } from '../components/candidate-dashboard/candidate-dashboard.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { JobDescriptionModalComponent } from '../job-description-modal/job-description-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
// import { PhaseService } from '../services/phase.service';
// import { CandidatsService } from '../services/candidats.service';
// import { EntretienService } from '../services/entretien.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-kanban',
//   templateUrl: './kanban.component.html',
//   styleUrls: ['./kanban.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     KanbanColumnComponent,
//     CandidateDashboardComponent,
//     KanbanItemComponent,
//     CdkDrag,
//     CdkDropList,
//     CdkDropListGroup,
//     JobDescriptionModalComponent,
//   ]
// })
// export class KanbanComponent implements OnInit {
//   private http = inject(HttpClient);
//   private dialog = inject(MatDialog);
//   private phaseService = inject(PhaseService);
//   private candidatsService = inject(CandidatsService);
//   private entretienService = inject(EntretienService);
//   private snackBar = inject(MatSnackBar);

//   columns = signal<KanbanColumn[]>([]);
//   selectedCandidate: KanbanItem | null = null;
//   showDashboard = false;
//   newColumnTitle = '';
//   showAddColumnForm = false;
//   showJobDescriptionModal = false;
//   errorMessage: string | null = null;

//   recruitmentSteps: RecruitmentStep[] = [
//     {
//       id: 'PresSelectionne',
//       label: 'Pré-sélectionné',
//       color: '#8b5cf6',
//       bgColor: '#f5f3ff',
//       noteType: 'RH',
//       order: 1
//     },
//     {
//       id: 'RH Interview',
//       label: 'Entretien RH',
//       color: '#3b82f6',
//       bgColor: '#eff6ff',
//       noteType: 'RH',
//       order: 2
//     },
//     {
//       id: 'Technique',
//       label: 'Entretien Technique',
//       color: '#06b6d4',
//       bgColor: '#ecfeff',
//       noteType: 'Technique',
//       order: 3
//     },
//     {
//       id: 'Embauché(e)',
//       label: 'Embauché(e)',
//       color: '#10b981',
//       bgColor: '#ecfdf5',
//       noteType: 'Générale',
//       order: 4
//     }
//   ];

//   jobDescription: JobDescription = {
//     title: "Développeur Full Stack Angular/Node.js",
//     technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
//     transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
//     requiredExperience: "3+ ans d'expérience en développement Full Stack",
//     educationLevel: "Bac+5 en informatique ou équivalent"
//   };

//   ngOnInit(): void {
//     this.loadBackendPhases();
//     this.loadCandidatesFromApi();
//   }

//   loadCandidatesFromApi(): void {
//     this.candidatsService.getCandidates().subscribe({
//       next: (kanbanData: KanbanColumn[]) => {
//         this.columns.set(kanbanData);
//       },
//       error: (err: any) => {
//         console.error('Erreur lors du chargement des candidats:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des candidats',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'preselectionne': 25,
//       'entretien_rh': 50,
//       'entretien_technique': 75,
//       'embauche': 100,
//       'refuse': 0
//     };
//     return statusProgressMap[status] || 0;
//   }

//   loadBackendPhases(): void {
//     this.phaseService.getAllPhasesFromBackend().subscribe({
//       next: (phases) => {
//         const backendColumns = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         this.columns.update(currentColumns => {
//           const existingIds = currentColumns.map(c => c.id);
//           const newColumns = backendColumns.filter(c => !existingIds.includes(c.id));
//           return [...currentColumns, ...newColumns];
//         });

//         phases.forEach(phase => {
//           if (!this.recruitmentSteps.some(step => step.id === phase.id.toString())) {
//             this.recruitmentSteps.push({
//               id: phase.id.toString(),
//               label: phase.title,
//               color: this.getRandomColor(),
//               bgColor: this.getLightColor(),
//               noteType: 'Générale',
//               order: phase.order || this.recruitmentSteps.length + 1
//             });
//           }
//         });
//       },
//       error: (err: any) => {
//         console.error('Error loading phases:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des phases',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   addNewColumn(): void {
//     if (!this.newColumnTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     this.phaseService.createPhase({
//       title: this.newColumnTitle.trim(),
//       order: this.recruitmentSteps.length + 1
//     }).subscribe({
//       next: (newPhase) => {
//         const phaseId = newPhase.id.toString();

//         this.recruitmentSteps = [...this.recruitmentSteps, {
//           id: phaseId,
//           label: newPhase.title,
//           color: this.getRandomColor(),
//           bgColor: this.getLightColor(),
//           noteType: 'Générale',
//           order: newPhase.order || this.recruitmentSteps.length + 1
//         }];

//         this.columns.update(cols => [...cols, {
//           id: phaseId,
//           title: newPhase.title,
//           tickets: []
//         }]);

//         this.newColumnTitle = '';
//         this.showAddColumnForm = false;
//         this.errorMessage = null;

//         this.snackBar.open('Phase créée avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = err.message || 'Erreur lors de la création de la phase';
//         if (this.errorMessage) {
//           this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
//         }
//       }
//     });
//   }

//   updatePhase(id: string, newTitle: string): void {
//     if (!newTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     const numericId = Number(id);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     this.phaseService.updatePhaseTitleInBackend(numericId, newTitle.trim()).subscribe({
//       next: (updatedPhase) => {
//         this.columns.update(cols =>
//           cols.map(c => c.id === id ? { ...c, title: updatedPhase.title } : c)
//         );

//         this.recruitmentSteps = this.recruitmentSteps.map(s =>
//           s.id === id ? { ...s, label: updatedPhase.title } : s
//         );

//         this.errorMessage = null;
//         this.snackBar.open('Phase mise à jour avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = 'Erreur lors de la mise à jour de la phase';
//         this.snackBar.open(
//           this.errorMessage,
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   deleteColumn(columnId: string): void {
//     const numericId = Number(columnId);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '400px',
//       data: {
//         message: `Êtes-vous sûr de vouloir supprimer cette phase ؟ Tous les candidats associés seront perdus.`
//       }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.phaseService.deletePhaseFromBackend(numericId).subscribe({
//           next: () => {
//             this.columns.update(cols => cols.filter(c => c.id !== columnId));
//             this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
//             this.snackBar.open('Phase supprimée avec succès', 'Fermer', {
//               duration: 3000
//             });
//           },
//           error: (err: any) => {
//             this.errorMessage = 'Erreur lors de la suppression de la phase';
//             this.snackBar.open(
//               this.errorMessage,
//               'Fermer',
//               { duration: 5000 }
//             );
//           }
//         });
//       }
//     });
//   }

//   onCandidateSelected(candidate: KanbanItem): void {
//     this.selectedCandidate = candidate;
//     this.showDashboard = true;
//   }

//   onCloseDashboard(): void {
//     this.showDashboard = false;
//   }

//   stats = computed(() => {
//     const cols = this.columns();
//     if (!cols) return null;

//     return {
//       presSelectionne: cols.find(c => c.title === 'Pré-sélectionné')?.tickets.length || 0,
//       rhInterview: cols.find(c => c.title === 'Entretien RH')?.tickets.length || 0,
//       technique: cols.find(c => c.title === 'Entretien Technique')?.tickets.length || 0,
//       embauche: cols.find(c => c.title === 'Embauché(e)')?.tickets.length || 0,
//       refuse: cols.find(c => c.title === 'Refusé')?.tickets.length || 0
//     };
//   });

//   listDrop(event: CdkDragDrop<undefined>): void {
//     const cols = [...this.columns()];
//     moveItemInArray(cols, event.previousIndex, event.currentIndex);
//     this.columns.set(cols);
//   }

//   async drop(event: CdkDragDrop<KanbanItem[]>): Promise<void> {
//     const previousContainer = event.previousContainer;
//     const container = event.container;
//     const previousIndex = event.previousIndex;
//     const currentIndex = event.currentIndex;

//     // Find the corresponding columns
//     const previousColumn = this.columns().find(c => c.tickets === previousContainer.data);
//     const targetColumn = this.columns().find(c => c.tickets === container.data);

//     if (!previousColumn || !targetColumn) return;

//     const item = previousContainer.data[previousIndex];
//     const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

//     if (isMovingBackward) {
//       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//         width: '400px',
//         data: {
//           message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ؟`
//         }
//       });

//       const result = await dialogRef.afterClosed().toPromise();
//       if (!result) return;
//     }

//     try {
//       // Get the new status and progress
//       const newStatus = this.getStatusFromColumnTitle(targetColumn.title);
//       const newProgress = this.getProgressFromColumnTitle(targetColumn.title);

//       // Optimistic update: Update the UI immediately
//       this.updateKanbanBoard(previousColumn.id, targetColumn.id, previousIndex, currentIndex, item, newStatus, newProgress);

//       // Call the backend to update the candidate's status
//       if (!item.shortlistedId) {
//         throw new Error('Shortlisted ID is missing');
//       }

//       await this.candidatsService.updateCandidateStatus(
//         item.shortlistedId,
//         newStatus,
//         newProgress
//       );

//       // API call to create the interview
//       const response = await this.entretienService.createAuto(
//         item.shortlistedId,
//         targetColumn.title
//       );

//       this.loadCandidatesFromApi(); // Reload data after successful update

//       this.snackBar.open('Candidate moved successfully', 'Close', { duration: 3000 });

//     } catch (error) {
//       console.error('Error:', error);

//       // Revert the optimistic update if there's an error
//       this.loadCandidatesFromApi();

//       let errorMessage = 'Error moving candidate';
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (isHttpErrorResponse(error)) {
//         errorMessage = error.error?.message || error.message;
//       }

//       this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
//     }
//   }

//   private updateKanbanBoard(
//     previousColumnId: string,
//     targetColumnId: string,
//     previousIndex: number,
//     currentIndex: number,
//     item: KanbanItem,
//     newStatus: string,
//     newProgress: number
//   ): void {
//     this.columns.update(currentColumns => {
//       const newColumns = [...currentColumns];
//       const prevColIndex = newColumns.findIndex(c => c.id === previousColumnId);
//       const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId);

//       if (prevColIndex === -1 || targetColIndex === -1) return currentColumns;

//       // Update the item's status and progress
//       const updatedItem = {
//         ...item,
//         status: newStatus,
//         progress: newProgress
//       };

//       // Remove from the previous column
//       const prevTickets = [...newColumns[prevColIndex].tickets];
//       const [movedItem] = prevTickets.splice(previousIndex, 1);

//       // Add to the new column
//       const targetTickets = [...newColumns[targetColIndex].tickets];
//       targetTickets.splice(currentIndex, 0, updatedItem);

//       // Update the columns
//       newColumns[prevColIndex] = {
//         ...newColumns[prevColIndex],
//         tickets: prevTickets
//       };
//       newColumns[targetColIndex] = {
//         ...newColumns[targetColIndex],
//         tickets: targetTickets
//       };

//       return newColumns;
//     });
//   }

//   private isMovingBackward(previousTitle: string, newTitle: string): boolean {
//     const previousStep = this.recruitmentSteps.find(step => step.label === previousTitle);
//     const newStep = this.recruitmentSteps.find(step => step.label === newTitle);

//     if (!previousStep || !newStep) return false;
//     return newStep.order < previousStep.order;
//   }

//   private getStatusFromColumnTitle(columnTitle: string): string {
//     const statusMap: Record<string, string> = {
//       'Pré-sélectionné': 'preselectionne',
//       'Entretien RH': 'entretien_rh',
//       'Entretien Technique': 'entretien_technique',
//       'Embauché(e)': 'embauche',
//       'Refusé': 'refuse'
//     };
//     return statusMap[columnTitle] || columnTitle;
//   }

//   private getProgressFromColumnTitle(columnTitle: string): number {
//     const progressMap: Record<string, number> = {
//       'Pré-sélectionné': 25,
//       'Entretien RH': 50,
//       'Entretien Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return progressMap[columnTitle] || 0;
//   }

//   private getRandomColor(): string {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   private getLightColor(): string {
//     const hue = Math.floor(Math.random() * 360);
//     return `hsl(${hue}, 100%, 95%)`;
//   }

//   updateColumnTitle(columnId: string, newTitle: string): void {
//     this.updatePhase(columnId, newTitle);
//   }

//   viewJobPost(): void {
//     this.showJobDescriptionModal = true;
//   }

//   closeJobDescriptionModal(): void {
//     this.showJobDescriptionModal = false;
//   }
// }

// // Type guard function
// function isHttpErrorResponse(error: any): error is HttpErrorResponse {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'status' in error &&
//     'statusText' in error &&
//     'url' in error
//   );
// }

//heda shih 
// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import {
//   CdkDrag,
//   CdkDragDrop,
//   CdkDropList,
//   CdkDropListGroup,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { JobDescription, KanbanColumn, KanbanItem, RecruitmentStep } from '../interfaces/kanban.interface';
// import { KanbanColumnComponent } from '../components/kanban-column.component';
// import { KanbanItemComponent } from '../components/kanban-item.component';
// import { CandidateDashboardComponent } from '../components/candidate-dashboard/candidate-dashboard.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { JobDescriptionModalComponent } from '../job-description-modal/job-description-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
// import { PhaseService } from '../services/phase.service';
// import { CandidatsService } from '../services/candidats.service';
// import { EntretienService } from '../services/entretien.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-kanban',
//   templateUrl: './kanban.component.html',
//   styleUrls: ['./kanban.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     KanbanColumnComponent,
//     CandidateDashboardComponent,
//     KanbanItemComponent,
//     CdkDrag,
//     CdkDropList,
//     CdkDropListGroup,
//     JobDescriptionModalComponent,
//   ]
// })
// export class KanbanComponent implements OnInit {
//   private http = inject(HttpClient);
//   private dialog = inject(MatDialog);
//   private phaseService = inject(PhaseService);
//   private candidatsService = inject(CandidatsService);
//   private entretienService = inject(EntretienService);
//   private snackBar = inject(MatSnackBar);

//   columns = signal<KanbanColumn[]>([]);
//   selectedCandidate: KanbanItem | null = null;
//   showDashboard = false;
//   newColumnTitle = '';
//   showAddColumnForm = false;
//   showJobDescriptionModal = false;
//   errorMessage: string | null = null;

//   recruitmentSteps: RecruitmentStep[] = [
//     {
//       id: 'PresSelectionne',
//       label: 'Pré-sélectionné',
//       color: '#8b5cf6',
//       bgColor: '#f5f3ff',
//       noteType: 'RH',
//       order: 1
//     },
//     {
//       id: 'RH Interview',
//       label: 'Entretien RH',
//       color: '#3b82f6',
//       bgColor: '#eff6ff',
//       noteType: 'RH',
//       order: 2
//     },
//     {
//       id: 'Technique',
//       label: 'Entretien Technique',
//       color: '#06b6d4',
//       bgColor: '#ecfeff',
//       noteType: 'Technique',
//       order: 3
//     },
//     {
//       id: 'Embauché(e)',
//       label: 'Embauché(e)',
//       color: '#10b981',
//       bgColor: '#ecfdf5',
//       noteType: 'Générale',
//       order: 4
//     }
//   ];

//   jobDescription: JobDescription = {
//     title: "Développeur Full Stack Angular/Node.js",
//     technicalSkills: ["Angular", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
//     transversalSkills: ["Travail d'équipe", "Communication", "Résolution de problèmes"],
//     requiredExperience: "3+ ans d'expérience en développement Full Stack",
//     educationLevel: "Bac+5 en informatique ou équivalent"
//   };

//   ngOnInit(): void {
//     this.loadBackendPhases();
//     this.loadCandidatesFromApi();
//   }

//   loadCandidatesFromApi(): void {
//     this.candidatsService.getCandidates().subscribe({
//       next: (kanbanData: KanbanColumn[]) => {
//         this.columns.set(kanbanData);
//       },
//       error: (err: any) => {
//         console.error('Erreur lors du chargement des candidats:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des candidats',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'preselectionne': 25,
//       'entretien_rh': 50,
//       'entretien_technique': 75,
//       'embauche': 100,
//       'refuse': 0
//     };
//     return statusProgressMap[status] || 0;
//   }

//   loadBackendPhases(): void {
//     this.phaseService.getAllPhasesFromBackend().subscribe({
//       next: (phases) => {
//         const backendColumns = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         this.columns.update(currentColumns => {
//           const existingIds = currentColumns.map(c => c.id);
//           const newColumns = backendColumns.filter(c => !existingIds.includes(c.id));
//           return [...currentColumns, ...newColumns];
//         });

//         phases.forEach(phase => {
//           if (!this.recruitmentSteps.some(step => step.id === phase.id.toString())) {
//             this.recruitmentSteps.push({
//               id: phase.id.toString(),
//               label: phase.title,
//               color: this.getRandomColor(),
//               bgColor: this.getLightColor(),
//               noteType: 'Générale',
//               order: phase.order || this.recruitmentSteps.length + 1
//             });
//           }
//         });
//       },
//       error: (err: any) => {
//         console.error('Error loading phases:', err);
//         this.snackBar.open(
//           'Erreur lors du chargement des phases',
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   addNewColumn(): void {
//     if (!this.newColumnTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     this.phaseService.createPhase({
//       title: this.newColumnTitle.trim(),
//       order: this.recruitmentSteps.length + 1
//     }).subscribe({
//       next: (newPhase) => {
//         const phaseId = newPhase.id.toString();

//         this.recruitmentSteps = [...this.recruitmentSteps, {
//           id: phaseId,
//           label: newPhase.title,
//           color: this.getRandomColor(),
//           bgColor: this.getLightColor(),
//           noteType: 'Générale',
//           order: newPhase.order || this.recruitmentSteps.length + 1
//         }];

//         this.columns.update(cols => [...cols, {
//           id: phaseId,
//           title: newPhase.title,
//           tickets: []
//         }]);

//         this.newColumnTitle = '';
//         this.showAddColumnForm = false;
//         this.errorMessage = null;

//         this.snackBar.open('Phase créée avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = err.message || 'Erreur lors de la création de la phase';
//         if (this.errorMessage) {
//           this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
//         }
//       }
//     });
//   }

//   updatePhase(id: string, newTitle: string): void {
//     if (!newTitle.trim()) {
//       this.errorMessage = 'Le nom de la phase ne peut pas être vide';
//       return;
//     }

//     const numericId = Number(id);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     this.phaseService.updatePhaseTitleInBackend(numericId, newTitle.trim()).subscribe({
//       next: (updatedPhase) => {
//         this.columns.update(cols =>
//           cols.map(c => c.id === id ? { ...c, title: updatedPhase.title } : c)
//         );

//         this.recruitmentSteps = this.recruitmentSteps.map(s =>
//           s.id === id ? { ...s, label: updatedPhase.title } : s
//         );

//         this.errorMessage = null;
//         this.snackBar.open('Phase mise à jour avec succès', 'Fermer', {
//           duration: 3000
//         });
//       },
//       error: (err: any) => {
//         this.errorMessage = 'Erreur lors de la mise à jour de la phase';
//         this.snackBar.open(
//           this.errorMessage,
//           'Fermer',
//           { duration: 5000 }
//         );
//       }
//     });
//   }

//   deleteColumn(columnId: string): void {
//     const numericId = Number(columnId);
//     if (isNaN(numericId)) {
//       this.errorMessage = 'ID de phase invalide';
//       return;
//     }

//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       width: '400px',
//       data: {
//         message: `Êtes-vous sûr de vouloir supprimer cette phase ؟ Tous les candidats associés seront perdus.`
//       }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.phaseService.deletePhaseFromBackend(numericId).subscribe({
//           next: () => {
//             this.columns.update(cols => cols.filter(c => c.id !== columnId));
//             this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
//             this.snackBar.open('Phase supprimée avec succès', 'Fermer', {
//               duration: 3000
//             });
//           },
//           error: (err: any) => {
//             this.errorMessage = 'Erreur lors de la suppression de la phase';
//             this.snackBar.open(
//               this.errorMessage,
//               'Fermer',
//               { duration: 5000 }
//             );
//           }
//         });
//       }
//     });
//   }

//   onCandidateSelected(candidate: KanbanItem): void {
//     this.selectedCandidate = candidate;
//     this.showDashboard = true;
//   }

//   onCloseDashboard(): void {
//     this.showDashboard = false;
//   }

//   stats = computed(() => {
//     const cols = this.columns();
//     if (!cols) return null;

//     return {
//       presSelectionne: cols.find(c => c.title === 'Pré-sélectionné')?.tickets.length || 0,
//       rhInterview: cols.find(c => c.title === 'Entretien RH')?.tickets.length || 0,
//       technique: cols.find(c => c.title === 'Entretien Technique')?.tickets.length || 0,
//       embauche: cols.find(c => c.title === 'Embauché(e)')?.tickets.length || 0,
//       refuse: cols.find(c => c.title === 'Refusé')?.tickets.length || 0
//     };
//   });

//   listDrop(event: CdkDragDrop<undefined>): void {
//     const cols = [...this.columns()];
//     moveItemInArray(cols, event.previousIndex, event.currentIndex);
//     this.columns.set(cols);
//   }

//   async drop(event: CdkDragDrop<KanbanItem[]>): Promise<void> {
//     const previousContainer = event.previousContainer;
//     const container = event.container;
//     const previousIndex = event.previousIndex;
//     const currentIndex = event.currentIndex;

//     // Find the corresponding columns
//     const previousColumn = this.columns().find(c => c.tickets === previousContainer.data);
//     const targetColumn = this.columns().find(c => c.tickets === container.data);

//     if (!previousColumn || !targetColumn) return;

//     const item = previousContainer.data[previousIndex];
//     const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

//     if (isMovingBackward) {
//       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//         width: '400px',
//         data: {
//           message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ؟`
//         }
//       });

//       const result = await dialogRef.afterClosed().toPromise();
//       if (!result) return;
//     }

//     try {
//       // Get the new status and progress
//       const newStatus = this.getStatusFromColumnTitle(targetColumn.title);
//       const newProgress = this.getProgressFromColumnTitle(targetColumn.title);

//       // Optimistic update: Update the UI immediately
//       this.updateKanbanBoard(previousColumn.id, targetColumn.id, previousIndex, currentIndex, item, newStatus, newProgress);

//       // Call the backend to update the candidate's status
//       if (!item.shortlistedId) {
//         throw new Error('Shortlisted ID is missing');
//       }

//       await this.candidatsService.updateCandidateStatus(
//         item.shortlistedId,
//         newStatus,
//         newProgress
//       );

//       // API call to create the interview
//       const response = await this.entretienService.createAuto(
//         item.shortlistedId,
//         targetColumn.title
//       );

//       this.loadCandidatesFromApi(); // Reload data after successful update

//       this.snackBar.open('Candidate moved successfully', 'Close', { duration: 3000 });

//     } catch (error) {
//       console.error('Error:', error);

//       // Revert the optimistic update if there's an error
//       this.loadCandidatesFromApi();

//       let errorMessage = 'Error moving candidate';
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (isHttpErrorResponse(error)) {
//         errorMessage = error.error?.message || error.message;
//       }

//       this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
//     }
//   }

//   private updateKanbanBoard(
//     previousColumnId: string,
//     targetColumnId: string,
//     previousIndex: number,
//     currentIndex: number,
//     item: KanbanItem,
//     newStatus: string,
//     newProgress: number
//   ): void {
//     this.columns.update(currentColumns => {
//       const newColumns = [...currentColumns];
//       const prevColIndex = newColumns.findIndex(c => c.id === previousColumnId);
//       const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId);

//       if (prevColIndex === -1 || targetColIndex === -1) return currentColumns;

//       // Update the item's status and progress
//       const updatedItem = {
//         ...item,
//         status: newStatus,
//         progress: newProgress
//       };

//       // Remove from the previous column
//       const prevTickets = [...newColumns[prevColIndex].tickets];
//       const [movedItem] = prevTickets.splice(previousIndex, 1);

//       // Add to the new column
//       const targetTickets = [...newColumns[targetColIndex].tickets];
//       targetTickets.splice(currentIndex, 0, updatedItem);

//       // Update the columns
//       newColumns[prevColIndex] = {
//         ...newColumns[prevColIndex],
//         tickets: prevTickets
//       };
//       newColumns[targetColIndex] = {
//         ...newColumns[targetColIndex],
//         tickets: targetTickets
//       };

//       return newColumns;
//     });
//   }

//   private isMovingBackward(previousTitle: string, newTitle: string): boolean {
//     const previousStep = this.recruitmentSteps.find(step => step.label === previousTitle);
//     const newStep = this.recruitmentSteps.find(step => step.label === newTitle);

//     if (!previousStep || !newStep) return false;
//     return newStep.order < previousStep.order;
//   }

//   private getStatusFromColumnTitle(columnTitle: string): string {
//     const statusMap: Record<string, string> = {
//       'Pré-sélectionné': 'preselectionne',
//       'Entretien RH': 'entretien_rh',
//       'Entretien Technique': 'entretien_technique',
//       'Embauché(e)': 'embauche',
//       'Refusé': 'refuse'
//     };
//     return statusMap[columnTitle] || columnTitle;
//   }

//   private getProgressFromColumnTitle(columnTitle: string): number {
//     const progressMap: Record<string, number> = {
//       'Pré-sélectionné': 25,
//       'Entretien RH': 50,
//       'Entretien Technique': 75,
//       'Embauché(e)': 100,
//       'Refusé': 0
//     };
//     return progressMap[columnTitle] || 0;
//   }

//   private getRandomColor(): string {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   private getLightColor(): string {
//     const hue = Math.floor(Math.random() * 360);
//     return `hsl(${hue}, 100%, 95%)`;
//   }

//   updateColumnTitle(columnId: string, newTitle: string): void {
//     this.updatePhase(columnId, newTitle);
//   }

//   viewJobPost(): void {
//     this.showJobDescriptionModal = true;
//   }

//   closeJobDescriptionModal(): void {
//     this.showJobDescriptionModal = false;
//   }
// }

// // Type guard function
// function isHttpErrorResponse(error: any): error is HttpErrorResponse {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'status' in error &&
//     'statusText' in error &&
//     'url' in error
//   );
// }
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { PhaseService } from '../services/phase.service';
import { CandidatsService } from '../services/candidats.service';
import { EntretienService } from '../services/entretien.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class KanbanComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private phaseService = inject(PhaseService);
  private candidatsService = inject(CandidatsService);
  private entretienService = inject(EntretienService);
  private snackBar = inject(MatSnackBar);

  columns = signal<KanbanColumn[]>([]);
  selectedCandidate: KanbanItem | null = null;
  showDashboard = false;
  newColumnTitle = '';
  showAddColumnForm = false;
  showJobDescriptionModal = false;
  errorMessage: string | null = null;

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

  ngOnInit(): void {
    this.loadBackendPhases();
    this.loadCandidatesFromApi();
  }

  loadCandidatesFromApi(): void {
    this.candidatsService.getCandidates().subscribe({
      next: (kanbanData: KanbanColumn[]) => {
        this.columns.set(kanbanData);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des candidats:', err);
        this.snackBar.open(
          'Erreur lors du chargement des candidats',
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }

  private getProgressFromStatus(status: string): number {
    const statusProgressMap: Record<string, number> = {
      'preselectionne': 25,
      'entretien_rh': 50,
      'entretien_technique': 75,
      'embauche': 100,
      'refuse': 0
    };
    return statusProgressMap[status] || 0;
  }

  loadBackendPhases(): void {
    this.phaseService.getAllPhasesFromBackend().subscribe({
      next: (phases) => {
        const backendColumns = phases.map(phase => ({
          id: phase.id.toString(),
          title: phase.title,
          tickets: []
        }));

        this.columns.update(currentColumns => {
          const existingIds = currentColumns.map(c => c.id);
          const newColumns = backendColumns.filter(c => !existingIds.includes(c.id));
          return [...currentColumns, ...newColumns];
        });

        phases.forEach(phase => {
          if (!this.recruitmentSteps.some(step => step.id === phase.id.toString())) {
            this.recruitmentSteps.push({
              id: phase.id.toString(),
              label: phase.title,
              color: this.getRandomColor(),
              bgColor: this.getLightColor(),
              noteType: 'Générale',
              order: phase.order || this.recruitmentSteps.length + 1
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading phases:', err);
        this.snackBar.open(
          'Erreur lors du chargement des phases',
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }

  addNewColumn(): void {
    if (!this.newColumnTitle.trim()) {
      this.errorMessage = 'Le nom de la phase ne peut pas être vide';
      return;
    }

    this.phaseService.createPhase({
      title: this.newColumnTitle.trim(),
      order: this.recruitmentSteps.length + 1
    }).subscribe({
      next: (newPhase) => {
        const phaseId = newPhase.id.toString();

        this.recruitmentSteps = [...this.recruitmentSteps, {
          id: phaseId,
          label: newPhase.title,
          color: this.getRandomColor(),
          bgColor: this.getLightColor(),
          noteType: 'Générale',
          order: newPhase.order || this.recruitmentSteps.length + 1
        }];

        this.columns.update(cols => [...cols, {
          id: phaseId,
          title: newPhase.title,
          tickets: []
        }]);

        this.newColumnTitle = '';
        this.showAddColumnForm = false;
        this.errorMessage = null;

        this.snackBar.open('Phase créée avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Erreur lors de la création de la phase';
        if (this.errorMessage) {
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
        }
      }
    });
  }

  updatePhase(id: string, newTitle: string): void {
    if (!newTitle.trim()) {
      this.errorMessage = 'Le nom de la phase ne peut pas être vide';
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      this.errorMessage = 'ID de phase invalide';
      return;
    }

    this.phaseService.updatePhaseTitleInBackend(numericId, newTitle.trim()).subscribe({
      next: (updatedPhase) => {
        this.columns.update(cols =>
          cols.map(c => c.id === id ? { ...c, title: updatedPhase.title } : c)
        );

        this.recruitmentSteps = this.recruitmentSteps.map(s =>
          s.id === id ? { ...s, label: updatedPhase.title } : s
        );

        this.errorMessage = null;
        this.snackBar.open('Phase mise à jour avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors de la mise à jour de la phase';
        this.snackBar.open(
          this.errorMessage,
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }

  deleteColumn(columnId: string): void {
    const numericId = Number(columnId);
    if (isNaN(numericId)) {
      this.errorMessage = 'ID de phase invalide';
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: `Êtes-vous sûr de vouloir supprimer cette phase ؟ Tous les candidats associés seront perdus.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.phaseService.deletePhaseFromBackend(numericId).subscribe({
          next: () => {
            this.columns.update(cols => cols.filter(c => c.id !== columnId));
            this.recruitmentSteps = this.recruitmentSteps.filter(s => s.id !== columnId);
            this.snackBar.open('Phase supprimée avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (err: any) => {
            this.errorMessage = 'Erreur lors de la suppression de la phase';
            this.snackBar.open(
              this.errorMessage,
              'Fermer',
              { duration: 5000 }
            );
          }
        });
      }
    });
  }

  onCandidateSelected(candidate: KanbanItem): void {
    this.selectedCandidate = candidate;
    this.showDashboard = true;
  }

  onCloseDashboard(): void {
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

  listDrop(event: CdkDragDrop<undefined>): void {
    const cols = [...this.columns()];
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
    this.columns.set(cols);
  }

    async drop(event: CdkDragDrop<KanbanItem[]>): Promise<void> {
    const previousContainer = event.previousContainer;
    const container = event.container;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    // Find the corresponding columns
    const previousColumn = this.columns().find(c => c.tickets === previousContainer.data);
    const targetColumn = this.columns().find(c => c.tickets === container.data);

    if (!previousColumn || !targetColumn) return;

    const item = previousContainer.data[previousIndex];
    const isMovingBackward = this.isMovingBackward(previousColumn.title, targetColumn.title);

    if (isMovingBackward) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          message: `Êtes-vous sûr de vouloir déplacer "${item.name}" vers "${targetColumn.title}" ؟`
        }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;
    }

    try {
      // Get the new status and progress
      const newStatus = this.getStatusFromColumnTitle(targetColumn.title);
      const newProgress = this.getProgressFromColumnTitle(targetColumn.title);

      // Call the backend to update the candidate's status
      if (!item.shortlistedId) {
        throw new Error('Shortlisted ID is missing');
      }

      await this.candidatsService.updateCandidateStatus(
        item.shortlistedId,
        newStatus,
        newProgress
      );

      // API call to create the interview
      const response = await this.entretienService.createAuto(
        item.shortlistedId,
        targetColumn.title
      );

      // Update the Kanban board in the UI
      this.columns.update(cols => {
        const newColumns = [...cols];
        const prevColIndex = newColumns.findIndex(c => c.id === previousColumn.id);
        const targetColIndex = newColumns.findIndex(c => c.id === targetColumn.id);

        if (prevColIndex === -1 || targetColIndex === -1) return newColumns; // Return the updated columns

        // Update the item's status and progress
        const updatedItem: KanbanItem = {
          ...item,
          status: newStatus,
          progress: newProgress
        };

        // Remove from the previous column
        const prevTickets = [...newColumns[prevColIndex].tickets];
        prevTickets.splice(previousIndex, 1);
        newColumns[prevColIndex] = {
          ...newColumns[prevColIndex],
          tickets: prevTickets
        };

        // Add to the new column
        const targetTickets = [...newColumns[targetColIndex].tickets];
        targetTickets.splice(currentIndex, 0, updatedItem);
        newColumns[targetColIndex] = {
          ...newColumns[targetColIndex],
          tickets: targetTickets
        };

        return newColumns;
      });

      this.snackBar.open('Candidate moved successfully', 'Close', { duration: 3000 });

    } catch (error) {
      console.error('Error:', error);

      // Revert the optimistic update if there's an error
      this.loadCandidatesFromApi();

      let errorMessage = 'Error moving candidate';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (isHttpErrorResponse(error)) {
        errorMessage = error.error?.message || error.message;
      }

      this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
    }
  }
  private isMovingBackward(previousTitle: string, newTitle: string): boolean {
    const previousStep = this.recruitmentSteps.find(step => step.label === previousTitle);
    const newStep = this.recruitmentSteps.find(step => step.label === newTitle);

    if (!previousStep || !newStep) return false;
    return newStep.order < previousStep.order;
  }

  private getStatusFromColumnTitle(columnTitle: string): string {
    const statusMap: Record<string, string> = {
      'Pré-sélectionné': 'preselectionne',
      'Entretien RH': 'entretien_rh',
      'Entretien Technique': 'entretien_technique',
      'Embauché(e)': 'embauche',
      'Refusé': 'refuse'
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

  updateColumnTitle(columnId: string, newTitle: string): void {
    this.updatePhase(columnId, newTitle);
  }

  viewJobPost(): void {
    this.showJobDescriptionModal = true;
  }

  closeJobDescriptionModal(): void {
    this.showJobDescriptionModal = false;
  }
}

// Type guard function
function isHttpErrorResponse(error: any): error is HttpErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'statusText' in error &&
    'url' in error
  );
}