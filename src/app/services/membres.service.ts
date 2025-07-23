import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembresService {
  private apiUrl = 'http://localhost:3000/api/jury';
  private usersApiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getMembres(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(this.usersApiUrl, userData, { headers }).pipe(
      tap(response => console.log('User created:', response)),
      catchError(this.handleError)
    );
  }

  createMembre(membreData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Format complet des données attendues par l'API
    const completeData = {
      user_id: membreData.user_id,
      statut: membreData.statut || 'En attente',
      entretien: null,
      evaluation: null,
      date_creation: new Date().toISOString(),
      date_maj: new Date().toISOString()
    };

    return this.http.post(this.apiUrl, completeData, { headers }).pipe(
      tap(response => console.log('Member created:', response)),
      catchError(this.handleError)
    );
  }

  updateMembre(membreId: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${membreId}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteMembre(membreId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${membreId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      if (error.error && error.error.errors) {
        errorMessage += '\nDétails: ' + JSON.stringify(error.error.errors);
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}