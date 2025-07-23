import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { KanbanColumn, KanbanItem } from '../interfaces/kanban.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidatsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<KanbanColumn[]> {
    return forkJoin([
      this.http.get<any[]>(`${this.apiUrl}/shortlistedCandidates`),
      this.http.get<any[]>(`${this.apiUrl}/phases`),
      this.http.get<KanbanColumn[]>(`${this.apiUrl}/candidates`)
    ]).pipe(
      map(([shortlisted, phases, kanbanData]) => {
        // Créer un mapping entre les titres des phases et leurs IDs
        const phaseMap = new Map<string, number>();
        phases.forEach(phase => {
          phaseMap.set(phase.title.toLowerCase(), phase.id);
        });

        // Créer les colonnes basées sur les phases
        const phaseColumns: KanbanColumn[] = phases.map(phase => ({
          id: phase.id.toString(),
          title: phase.title,
          tickets: []
        }));

        // Ajouter les colonnes par défaut si elles n'existent pas
        const defaultColumns = [
          { id: 'PresSelectionne', title: 'Pré-sélectionné', tickets: [] },
        ];

        // Fusionner les colonnes
        const allColumns = [...phaseColumns, ...defaultColumns.filter(col => 
          !phaseColumns.some(p => p.title === col.title)
        )];

        // Peupler les colonnes avec les candidats
        shortlisted.forEach(candidate => {
          const jsonCandidate = kanbanData
            .flatMap(col => col.tickets)
            .find(t => t.id === candidate.candidateJsonId.toString());
          
          if (jsonCandidate) {
            const status = candidate.statut.toLowerCase();
            let column = allColumns.find(c => 
              c.title.toLowerCase() === status || 
              (status === 'rh1' && c.title.toLowerCase() === 'entretien rh')
            );

            // Si aucune colonne ne correspond exactement, chercher dans le phaseMap
            if (!column) {
              const phaseId = phaseMap.get(status);
              if (phaseId) {
                column = allColumns.find(c => c.id === phaseId.toString());
              }
            }

            // Si toujours pas de colonne, mettre dans Pré-sélectionné par défaut
            if (!column) {
              column = allColumns.find(c => c.id === 'PresSelectionne');
            }

            if (column) {
              column.tickets.push({
                ...jsonCandidate,
                id: jsonCandidate.id,
                candidateId: jsonCandidate.id,
                shortlistedId: candidate.id,
                status: candidate.statut,
                progress: candidate.progress || this.getProgressFromStatus(candidate.statut)
              });
            }
          }
        });

        return allColumns;
      })
    );
  }

  private getProgressFromStatus(status: string): number {
    const statusProgressMap: Record<string, number> = {
      'preselectionne': 25,
      'rh1': 50,
      'entretien_rh': 50,
      'entretien_technique': 75,
      'embauche': 100,
      'refuse': 0
    };
    return statusProgressMap[status.toLowerCase()] || 0;
  }

  updateCandidateStatus(shortlistedId: number, status: string, progress: number): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/shortlistedCandidates/${shortlistedId}/status`, {
      status,
      progress
    }, { headers }).toPromise();
  }
}






























////////////hedi el kdima tjibli les candidat kol

// @Injectable({
//   providedIn: 'root'
// })
// export class CandidatsService {
//   private apiUrl = 'http://localhost:3000/api';

//   constructor(private http: HttpClient) {}

//   getCandidates(): Observable<KanbanColumn[]> {
//     return forkJoin([
//       this.http.get<any[]>(`${this.apiUrl}/shortlistedCandidates`),
//       this.http.get<KanbanColumn[]>(`${this.apiUrl}/candidates`)
//     ]).pipe(
//       map(([shortlisted, kanbanData]) => {
//         return kanbanData.map(column => {
//           return {
//             ...column,
//             tickets: column.tickets.map(ticket => {
//               const shortlistedCandidate = shortlisted.find(sc => sc.candidateJsonId === parseInt(ticket.id));

//               return {
//                 ...ticket,
//                 id: ticket.id, // ID original du JSON
//                 candidateId: ticket.id, // ID du JSON (identique)
//                 shortlistedId: shortlistedCandidate?.id || null,
//                 status: shortlistedCandidate?.statut || ticket.status, // Get status from shortlisted
//                 progress: shortlistedCandidate?.progress || ticket.progress
//               };
//             })
//           };
//         });
//       })
//     );
//   }

//   updateCandidateStatus(shortlistedId: number, status: string, progress: number): Promise<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });

//     return this.http.put(`${this.apiUrl}/shortlistedCandidates/${shortlistedId}/status`, {
//       status,
//       progress
//     }, { headers }).toPromise();
//   }
// }





//heda mtaa stut selon phase  ama probleme shih tekdhm ama tejibi mel statique 


// @Injectable({
//   providedIn: 'root'
// })
// export class CandidatsService {
//   private apiUrl = 'http://localhost:3000/api';

//   constructor(private http: HttpClient) {}

//   getCandidates(): Observable<KanbanColumn[]> {
//     return forkJoin([
//       this.http.get<any[]>(`${this.apiUrl}/shortlistedCandidates`),
//       this.http.get<KanbanColumn[]>(`${this.apiUrl}/candidates`),
//       this.http.get<any[]>(`${this.apiUrl}/phases`)
//     ]).pipe(
//       map(([shortlisted, kanbanData, phases]) => {
//         // Créer les colonnes vides basées sur les phases
//         const columns: KanbanColumn[] = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         // Ajouter les colonnes par défaut si elles n'existent pas
//         const defaultColumns = [
//           { id: 'PresSelectionne', title: 'Pré-sélectionné', tickets: [] },
//           { id: 'RH Interview', title: 'Entretien RH', tickets: [] },
//           { id: 'Technique', title: 'Entretien Technique', tickets: [] },
//           { id: 'Embauché(e)', title: 'Embauché(e)', tickets: [] }
//         ];

//         defaultColumns.forEach(defaultCol => {
//           if (!columns.some(c => c.id === defaultCol.id)) {
//             columns.push(defaultCol);
//           }
//         });

//         // Récupérer tous les candidats depuis le JSON initial
//         const allCandidates: KanbanItem[] = [];
//         kanbanData.forEach(column => {
//           allCandidates.push(...column.tickets);
//         });

//         // Peupler les colonnes selon le statut
//         shortlisted.forEach(candidate => {
//           const jsonCandidate = allCandidates.find(c => c.id === candidate.candidateJsonId.toString());
//           if (jsonCandidate) {
//             const status = candidate.statut;
//             const columnId = this.getColumnIdFromStatus(status);
            
//             const column = columns.find(c => c.id === columnId);
//             if (column) {
//               column.tickets.push({
//                 ...jsonCandidate,
//                 id: jsonCandidate.id,
//                 candidateId: jsonCandidate.id,
//                 shortlistedId: candidate.id,
//                 status: status,
//                 progress: candidate.progress || this.getProgressFromStatus(status)
//               });
//             }
//           }
//         });

//         return columns;
//       })
//     );
//   }

//   private getColumnIdFromStatus(status: string): string {
//     const statusMap: Record<string, string> = {
//       'preselectionne': 'PresSelectionne',
//       'entretien_rh': 'RH Interview',
//       'entretien_technique': 'Technique',
//       'embauche': 'Embauché(e)',
//       'refuse': 'Refusé',
//       'rh1': 'RH Interview', // Ajout pour votre cas spécifique
//       'en_attente': 'PresSelectionne'
//     };
//     return statusMap[status] || 'PresSelectionne';
//   }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'preselectionne': 25,
//       'entretien_rh': 50,
//       'entretien_technique': 75,
//       'embauche': 100,
//       'refuse': 0,
//       'rh1': 50, // Ajout pour votre cas spécifique
//       'en_attente': 0
//     };
//     return statusProgressMap[status] || 0;
//   }

//   updateCandidateStatus(shortlistedId: number, status: string, progress: number): Promise<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });

//     return this.http.put(`${this.apiUrl}/shortlistedCandidates/${shortlistedId}/status`, {
//       status,
//       progress
//     }, { headers }).toPromise();
//   }
// }













/////hedi en principe jaw behi 
// @Injectable({
//   providedIn: 'root'
// })
// export class CandidatsService {
//   private apiUrl = 'http://localhost:3000/api';

//   constructor(private http: HttpClient) {}

//   getCandidates(): Observable<KanbanColumn[]> {
//     return forkJoin([
//       this.http.get<any[]>(`${this.apiUrl}/shortlistedCandidates`),
//       this.http.get<any[]>(`${this.apiUrl}/phases`),
//       this.http.get<KanbanColumn[]>(`${this.apiUrl}/candidates`)
//     ]).pipe(
//       map(([shortlisted, phases, kanbanData]) => {
//         // Créer un mapping entre les titres des phases et leurs IDs
//         const phaseMap = new Map<string, number>();
//         phases.forEach(phase => {
//           phaseMap.set(phase.title.toLowerCase(), phase.id);
//         });

//         // Créer les colonnes basées sur les phases
//         const phaseColumns: KanbanColumn[] = phases.map(phase => ({
//           id: phase.id.toString(),
//           title: phase.title,
//           tickets: []
//         }));

//         // Ajouter les colonnes par défaut si elles n'existent pas
//         const defaultColumns = [
//           { id: 'PresSelectionne', title: 'Pré-sélectionné', tickets: [] },
//         ];

//         // Fusionner les colonnes
//         const allColumns = [...phaseColumns, ...defaultColumns.filter(col => 
//           !phaseColumns.some(p => p.title === col.title)
//         )];

//         // Peupler les colonnes avec les candidats
//         shortlisted.forEach(candidate => {
//           const jsonCandidate = kanbanData
//             .flatMap(col => col.tickets)
//             .find(t => t.id === candidate.candidateJsonId.toString());
          
//           if (jsonCandidate) {
//             const status = candidate.statut.toLowerCase();
//             let column = allColumns.find(c => 
//               c.title.toLowerCase() === status || 
//               (status === 'rh1' && c.title.toLowerCase() === 'entretien rh')
//             );

//             // Si aucune colonne ne correspond exactement, chercher dans le phaseMap
//             if (!column) {
//               const phaseId = phaseMap.get(status);
//               if (phaseId) {
//                 column = allColumns.find(c => c.id === phaseId.toString());
//               }
//             }

//             // Si toujours pas de colonne, mettre dans Pré-sélectionné par défaut
//             if (!column) {
//               column = allColumns.find(c => c.id === 'PresSelectionne');
//             }

//             if (column) {
//               column.tickets.push({
//                 ...jsonCandidate,
//                 id: jsonCandidate.id,
//                 candidateId: jsonCandidate.id,
//                 shortlistedId: candidate.id,
//                 status: candidate.statut,
//                 progress: candidate.progress || this.getProgressFromStatus(candidate.statut)
//               });
//             }
//           }
//         });

//         return allColumns;
//       })
//     );
//   }

//   private getProgressFromStatus(status: string): number {
//     const statusProgressMap: Record<string, number> = {
//       'preselectionne': 25,
//       'rh1': 50,
//       'entretien_rh': 50,
//       'entretien_technique': 75,
//       'embauche': 100,
//       'refuse': 0
//     };
//     return statusProgressMap[status.toLowerCase()] || 0;
//   }

//   updateCandidateStatus(shortlistedId: number, status: string, progress: number): Promise<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });

//     return this.http.put(`${this.apiUrl}/shortlistedCandidates/${shortlistedId}/status`, {
//       status,
//       progress
//     }, { headers }).toPromise();
//   }
// }


