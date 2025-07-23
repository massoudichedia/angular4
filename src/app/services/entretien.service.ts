// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { lastValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class EntretienService {
//   private apiUrl = 'http://localhost:3000/api/entretiens';

//   constructor(private http: HttpClient) { }

//   async createAuto(shortlistedId: number, phaseTitle: string): Promise<any> {
//     try {
//       const response = await lastValueFrom(
//         this.http.post(`${this.apiUrl}/auto`, {
//           shortlisted_id: shortlistedId,
//           phase_title: phaseTitle
//         })
//       );
//       return response;
//     } catch (error) {
//       console.error('Erreur création entretien:', error);
//       throw this.handleError(error);
//     }
//   }

//   private handleError(error: any): Error {
//     let errorMessage = 'Erreur lors de la création de l\'entretien';
//     if (error.error?.message) {
//       errorMessage = `Erreur lors de la création de l'entretien: ${error.error.message}`; // Include server message
//     } else if (error.message) {
//       errorMessage = `Erreur lors de la création de l'entretien: ${error.message}`;
//     }
//     return new Error(errorMessage);
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { lastValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class EntretienService {
//   private apiUrl = 'http://localhost:3000/api/entretiens';

//   constructor(private http: HttpClient) { }

//   async createAuto(shortlistedId: number, phaseTitle: string): Promise<any> {
//     try {
//       const response = await lastValueFrom(
//         this.http.post(`${this.apiUrl}/auto`, {
//           shortlisted_id: shortlistedId,
//           phase_title: phaseTitle
//         })
//       );
//       return response;
//     } catch (error) {
//       console.error('Erreur création entretien:', error);
//       throw this.handleError(error);
//     }
//   }

//   private handleError(error: any): Error {
//     let errorMessage = 'Erreur lors de la création de l\'entretien';
//     if (error.error?.message) {
//       errorMessage = `Erreur lors de la création de l'entretien: ${error.error.message}`; // Include server message
//     } else if (error.message) {
//       errorMessage = `Erreur lors de la création de l'entretien: ${error.message}`;
//     }
//     return new Error(errorMessage);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntretienService {
  private apiUrl = 'http://localhost:3000/api/entretiens';

  constructor(private http: HttpClient) { }

  async createAuto(shortlistedId: number, phaseTitle: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.apiUrl}/auto`, {
          shortlisted_id: shortlistedId,
          phase_title: phaseTitle
        })
      );
      return response;
    } catch (error) {
      console.error('Erreur création entretien:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    let errorMessage = 'Erreur lors de la création de l\'entretien';
    if (error.error?.message) {
      errorMessage = `Erreur lors de la création de l'entretien: ${error.error.message}`; // Include server message
    } else if (error.message) {
      errorMessage = `Erreur lors de la création de l'entretien: ${error.message}`;
    }
    return new Error(errorMessage);
  }
}