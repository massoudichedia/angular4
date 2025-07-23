// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class EvaluationService {
//   private apiUrl = 'http://127.0.0.1:3000/api/evaluations';

//   constructor(private http: HttpClient) { }

//   createEvaluation(evaluationData: any): Observable<any> {
//     return this.http.post(this.apiUrl, evaluationData);
//   }

//   getEvaluationsByCandidate(candidateId: number): Observable<any> {
//     return this.http.get(`${this.apiUrl}/candidate/${candidateId}`);
//   }

//   updateEvaluation(id: number, evaluationData: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, evaluationData);
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class EvaluationService {
//   private apiUrl = 'http://localhost:3000/api/evaluations'; // URL directe

//   constructor(private http: HttpClient) { }

//   createEvaluation(evaluationData: any): Observable<any> {
//     return this.http.post(this.apiUrl, evaluationData)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Une erreur inconnue est survenue';
    
//     if (error.error instanceof ErrorEvent) {
//       // Erreur côté client
//       errorMessage = `Erreur: ${error.error.message}`;
//     } else {
//       // Erreur côté serveur
//       if (error.error && error.error.message) {
//         errorMessage = error.error.message;
//       } else if (error.status) {
//         switch (error.status) {
//           case 400:
//             errorMessage = 'Requête incorrecte';
//             break;
//           case 401:
//             errorMessage = 'Non autorisé';
//             break;
//           case 403:
//             errorMessage = 'Accès refusé';
//             break;
//           case 404:
//             errorMessage = 'Ressource non trouvée';
//             break;
//           case 500:
//             errorMessage = 'Erreur interne du serveur';
//             break;
//           default:
//             errorMessage = `Erreur ${error.status}`;
//         }
//       }
//     }
    
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
//   getJuryMembers(): Observable<any> {
//   return this.http.get('http://localhost:3000/api/jury')
//     .pipe(catchError(this.handleError));
// }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class EvaluationService {
//   private apiUrl = 'http://localhost:3000/api/evaluations';
//   private juryUrl = 'http://localhost:3000/api/jury'; // Nouvelle URL pour les jurys

//   constructor(private http: HttpClient) { }

//   createEvaluation(evaluationData: any): Observable<any> {
//     return this.http.post(this.apiUrl, evaluationData)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   getJuryMembers(): Observable<any> {
//     return this.http.get(this.juryUrl)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Une erreur inconnue est survenue';
    
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Erreur: ${error.error.message}`;
//     } else {
//       if (error.error && error.error.message) {
//         errorMessage = error.error.message;
//       } else if (error.status) {
//         switch (error.status) {
//           case 400: errorMessage = 'Requête incorrecte'; break;
//           case 401: errorMessage = 'Non autorisé'; break;
//           case 403: errorMessage = 'Accès refusé'; break;
//           case 404: errorMessage = 'Ressource non trouvée'; break;
//           case 500: errorMessage = 'Erreur interne du serveur'; break;
//           default: errorMessage = `Erreur ${error.status}`;
//         }
//       }
//     }
    
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:3000/api/evaluations';
  private juryUrl = 'http://localhost:3000/api/jury'; // Nouvelle URL pour les jurys

  constructor(private http: HttpClient) { }

  createEvaluation(evaluationData: any): Observable<any> {
    return this.http.post(this.apiUrl, evaluationData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getJuryMembers(): Observable<any> {
    return this.http.get(this.juryUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status) {
        switch (error.status) {
          case 400: errorMessage = 'Requête incorrecte'; break;
          case 401: errorMessage = 'Non autorisé'; break;
          case 403: errorMessage = 'Accès refusé'; break;
          case 404: errorMessage = 'Ressource non trouvée'; break;
          case 500: errorMessage = 'Erreur interne du serveur'; break;
          default: errorMessage = `Erreur ${error.status}`;
        }
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}