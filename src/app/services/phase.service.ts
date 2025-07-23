import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Phase {
  id: number;
  title: string;
  order?: number;
  entretiens?: any[];
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhaseService {
  private apiUrl = 'http://127.0.0.1:3000/api/phases';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAllPhasesFromBackend(): Observable<Phase[]> {
    return this.http.get<Phase[]>(this.apiUrl).pipe(
      catchError(err => {
        this.showError('Erreur de chargement des phases');
        return of([]);
      })
    );
  }

  createPhase(phaseData: { title: string; order?: number }): Observable<Phase> {
    return this.http.post<Phase>(this.apiUrl, phaseData).pipe(
      catchError(error => {
        let errorMessage = 'Erreur inconnue';
        if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        } else if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur client: ${error.error.message}`;
        } else {
          errorMessage = `Erreur serveur: ${error.status} - ${error.error?.message || error.message}`;
        }
        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updatePhaseTitleInBackend(id: number, title: string): Observable<Phase> {
    return this.http.put<Phase>(`${this.apiUrl}/${id}`, { title }).pipe(
      catchError(err => {
        this.showError('Erreur lors de la mise à jour de la phase');
        return throwError(() => err);
      })
    );
  }

  deletePhaseFromBackend(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        this.showError('Erreur lors de la suppression de la phase');
        return throwError(() => err);
      })
    );
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
