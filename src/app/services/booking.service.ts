// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, catchError, tap, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BookingService {
//   public apiUrl = '/api/v2/bookings';
  
//   constructor(private http: HttpClient) { }

//   getUpcomingBookings(): Observable<any> {
//     const headers = new HttpHeaders({
//       'Authorization': 'Bearer cal_live_8008f0840ad940f04adb696bb3762107',
//       'cal-api-version': '2024-08-13',
//       'Cache-Control': 'no-cache',
//       'Pragma': 'no-cache'
//     });

//     return this.http.get<any>(this.apiUrl, { 
//       headers: headers,
//       params: { 
//         status: 'upcoming', // Ou essayez avec un tableau : ['upcoming']
//         take: '100',
//         skip: '0'
//       }
//     }).pipe(
//       tap(response => {
//         console.log('API Response complète:', response);
//         console.log('Type de response:', typeof response);
//         console.log('Clés de response:', Object.keys(response || {}));
//       }),
//       catchError(error => {
//         console.error('Erreur détaillée:', {
//           status: error.status,
//           statusText: error.statusText,
//           message: error.message,
//           error: error.error
//         });
//         return throwError(() => error);
//       })
//     );
//   }
// }
// booking.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, catchError, tap, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BookingService {
//   private apiUrl = 'https://api.cal.com/v2/bookings'; // URL complète
  
//   constructor(private http: HttpClient) { }

//   getUpcomingBookings(): Observable<any> {
//     const headers = new HttpHeaders({
//       'Authorization': 'Bearer cal_live_8008f0840ad940f04adb696bb3762107',
//       'cal-api-version': '2024-08-13'
//     });

//     return this.http.get<any>(this.apiUrl, { 
//       headers: headers,
//       params: { 
//         status: 'upcoming',
//         take: '100',
//         skip: '0'
//       }
//     }).pipe(
//       tap(response => {
//         console.log('API Response complète:', response);
//       }),
//       catchError(error => {
//         console.error('Erreur API Cal.com:', {
//           status: error.status,
//           statusText: error.statusText,
//           message: error.message,
//           error: error.error
//         });
//         return throwError(() => error);
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://api.cal.com/v2/bookings';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer cal_live_8008f0840ad940f04adb696bb3762107',
      'cal-api-version': '2024-08-13'
    });
  }

  // Récupérer tous les types de réservations
  getAllBookings(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: { 
        take: '100',
        skip: '0'
      }
    }).pipe(
      tap(response => console.log('Toutes les réservations:', response)),
      catchError(this.handleError)
    );
  }

  getBookings(status: 'upcoming' | 'past' | 'cancelled' = 'upcoming'): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer cal_live_8008f0840ad940f04adb696bb3762107',
      'cal-api-version': '2024-08-13'
    });

    return this.http.get<any>(this.apiUrl, { 
      headers: headers,
      params: { 
        status: status,
        take: '100',
        skip: '0'
      }
    }).pipe(
      tap(response => {
        console.log(`API Response ${status}:`, response);
      }),
      catchError(error => {
        console.error(`Erreur API Cal.com ${status}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les réservations à venir
  getUpcomingBookings(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: { 
        status: 'upcoming',
        take: '100',
        skip: '0'
      }
    }).pipe(
      tap(response => console.log('Réservations à venir:', response)),
      catchError(this.handleError)
    );
  }

  // Récupérer les réservations passées
  getPastBookings(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: { 
        status: 'past',
        take: '100',
        skip: '0'
      }
    }).pipe(
      tap(response => console.log('Réservations passées:', response)),
      catchError(this.handleError)
    );
  }

  // Récupérer les réservations annulées
  getCancelledBookings(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: { 
        status: 'cancelled',
        take: '100',
        skip: '0'
      }
    }).pipe(
      tap(response => console.log('Réservations annulées:', response)),
      catchError(this.handleError)
    );
  }

  // Récupérer les réservations pour une période donnée
  getBookingsForDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: { 
        take: '100',
        skip: '0',
      }
    }).pipe(
      tap(response => console.log('Réservations pour la période:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erreur API Cal.com:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error
    });
    return throwError(() => error);
  }
}