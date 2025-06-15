import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CalComService {
  constructor(private http: HttpClient) { }

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