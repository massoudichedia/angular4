import { Injectable } from '@angular/core';

declare global {
  interface Window {
    Cal: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalComService {
  constructor() {}

  async initCalendar(calLink: string, elementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Cal = window.Cal || function() {
        (window.Cal.q = window.Cal.q || []).push(arguments);
      };

      const checkReady = () => {
        if (window.Cal && document.getElementById(elementId)) {
          window.Cal('init', { 
            origin: 'https://cal.com',
            debug: false
          });
          
          window.Cal('inline', {
            elementOrSelector: `#${elementId}`,
            calLink: calLink.replace('https://cal.com/', ''),
            config: {
              layout: 'month_view',
              showFullHeader: true,
              header: {
                hideLogo: false,
                hideBooker: false
              }
            }
          });
          resolve();
          return true;
        }
        return false;
      };

      if (!checkReady()) {
        const interval = setInterval(() => {
          if (checkReady()) clearInterval(interval);
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('Le calendrier n\'a pas pu charger'));
        }, 10000);
      }
    });
  }
}