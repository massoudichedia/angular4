import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CalComService {
    private apiUrl = 'https://api.cal.com/v2';

  constructor(private http: HttpClient) { }

   getUpcomingBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`, {
      params: {
        status: 'upcoming',
        limit: '10'
      }
    });
  }

  async initCalendar(calLink: string, elementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (document.querySelector(`script[src*="cal.com/embed.js"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://cal.com/embed.js`;
        script.async = true;
        
        script.onload = () => {
          (window as any).Cal('init', {
            origin: 'https://cal.com',
            calLink: calLink,
            elementId: elementId,
            config: {
              theme: 'light',
              branding: {
                brandColor: '#3B82F6'
              }
            }
          });
          resolve();
        };
        
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      } catch (error) {
        reject(error);
      }
    });
  }
}