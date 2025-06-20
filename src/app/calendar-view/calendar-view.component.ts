// // calendar-view.component.ts - Version complète améliorée
// import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { BookingService } from '../services/booking.service';

// declare global {
//   interface Window {
//     Cal: any;
//   }
// }

// interface BookingSummary {
//   upcoming: number;
//   past: number;
//   cancelled: number;
//   total: number;
// }

// @Component({
//   selector: 'app-calendar-view',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './calendar-view.component.html',
//   styleUrls: ['./calendar-view.component.css']
// })
// export class CalendarViewComponent implements OnInit, AfterViewInit, OnDestroy {
//   calendarLoaded = false;
//   isLoading = true;
//   error: string | null = null;
//   bookings: any[] = [];
//   bookingSummary: BookingSummary = {
//     upcoming: 0,
//     past: 0,
//     cancelled: 0,
//     total: 0
//   };
  
//   calendarConfig = {
//     calLink: 'chadia-massoudi-eeek5f/entretien',
//     elementId: 'cal-weekly-view'
//   };

//   constructor(private bookingService: BookingService) {}

//   ngOnInit() {
//     this.loadAllBookings();
//   }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.initCalendar();
//     }, 100);
//   }

//   ngOnDestroy() {
//     this.cleanupCalendar();
//   }

//   async loadAllBookings() {
//     try {
//       const response = await this.bookingService.getAllBookings().toPromise();
      
//       if (response?.data) {
//         this.bookings = response.data.bookings || [];
//         this.bookingSummary = response.data.summary || this.bookingSummary;
//       }
      
//       console.log('Toutes les réservations chargées:', {
//         bookings: this.bookings,
//         summary: this.bookingSummary
//       });
      
//     } catch (error) {
//       console.error('Erreur lors du chargement des réservations:', error);
//       this.error = 'Erreur lors du chargement des données';
//     }
//   }

//   initCalendar() {
//     this.isLoading = true;
//     this.error = null;

//     if (!document.getElementById('cal-embed-script')) {
//       const script = document.createElement('script');
//       script.id = 'cal-embed-script';
//       script.src = 'https://app.cal.com/embed/embed.js';
//       script.onload = () => {
//         this.setupCalendarEmbed();
//       };
//       script.onerror = () => {
//         this.error = 'Erreur lors du chargement du calendrier Cal.com';
//         this.isLoading = false;
//       };
//       document.head.appendChild(script);
//     } else {
//       this.setupCalendarEmbed();
//     }
//   }

//   private setupCalendarEmbed() {
//     try {
//       if (window.Cal) {
//         window.Cal('init', {
//           origin: 'https://app.cal.com'
//         });

//         window.Cal('inline', {
//           elementOrSelector: `#${this.calendarConfig.elementId}`,
//           calLink: this.calendarConfig.calLink,
//           config: {
//             theme: 'light',
//             hideEventTypeDetails: false,
//             branding: {
//               brandColor: '#5E48E8'
//             }
//           }
//         });

//         window.Cal('on', {
//           action: '*',
//           callback: (e: any) => {
//             console.log('Événement Cal.com:', e.detail);
//             this.handleCalendarEvent(e.detail);
//           }
//         });

//         this.calendarLoaded = true;
//         this.isLoading = false;
//         console.log('Calendrier Cal.com initialisé avec succès');
//       } else {
//         throw new Error('Cal.com script non disponible');
//       }
//     } catch (error) {
//       console.error('Erreur lors de l\'initialisation du calendrier:', error);
//       this.error = 'Erreur lors de l\'initialisation du calendrier';
//       this.isLoading = false;
//     }
//   }

//   private handleCalendarEvent(eventDetail: any) {
//     switch (eventDetail.type) {
//       case 'bookingSuccessfulV2':
//         console.log('Nouvelle réservation créée:', eventDetail.data);
//         this.loadAllBookings();
//         break;
//       case 'linkReady':
//         console.log('Calendrier prêt');
//         this.isLoading = false;
//         break;
//       case 'linkFailed':
//         console.error('Erreur de chargement du calendrier:', eventDetail.data);
//         this.error = 'Erreur de chargement du calendrier';
//         this.isLoading = false;
//         break;
//     }
//   }

//   private cleanupCalendar() {
//     if (window.Cal) {
//       try {
//         window.Cal('destroy');
//       } catch (error) {
//         console.warn('Erreur lors du nettoyage du calendrier:', error);
//       }
//     }
//   }

//   refreshCalendar() {
//     this.calendarLoaded = false;
//     this.isLoading = true;
//     this.error = null;
    
//     this.loadAllBookings();
    
//     setTimeout(() => {
//       this.initCalendar();
//     }, 500);
//   }

//   goBack() {
//     window.history.back();
//   }

//   getStatusColor(status: string): string {
//     switch (status?.toLowerCase()) {
//       case 'confirmed':
//       case 'upcoming':
//         return 'bg-green-500';
//       case 'cancelled':
//         return 'bg-red-500';
//       case 'completed':
//       case 'past':
//         return 'bg-blue-500';
//       default:
//         return 'bg-gray-500';
//     }
//   }
// }

// // calendar-view.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BookingService } from '../services/booking.service';

// @Component({
//   selector: 'app-calendar-view',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="min-h-screen bg-gray-50">
//       <!-- En-tête -->
//       <div class="bg-white shadow-sm border-b">
//         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div class="flex justify-between items-center py-4">
//             <div class="flex items-center gap-4">
//               <button (click)="goBack()" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Retour
//               </button>
//               <h1 class="text-2xl font-bold text-gray-900">Calendrier des Entretiens</h1>
//             </div>
            
//             <div class="flex items-center gap-3">
//               <button (click)="refreshCalendar()" class="flex items-center gap-2 px-4 py-2 text-[#5E48E8] border border-[#5E48E8] rounded-lg hover:bg-[#5E48E8] hover:text-white transition">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Actualiser
//               </button>
              
//               <div class="flex items-center gap-2 text-sm text-gray-600">
//                 <div class="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span>{{ allBookings.length }} événement(s)</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Vue Calendrier Personnalisée -->
//       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div class="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div class="p-6 border-b border-gray-200">
//             <div class="flex items-center justify-between">
//               <h2 class="text-lg font-semibold text-gray-900">Vue Hebdomadaire</h2>
//               <div class="flex items-center gap-4">
//                 <button (click)="previousWeek()" class="p-2 hover:bg-gray-100 rounded">
//                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <span class="text-lg font-medium">{{ currentWeekLabel }}</span>
//                 <button (click)="nextWeek()" class="p-2 hover:bg-gray-100 rounded">
//                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           <!-- Calendrier hebdomadaire -->
//           <div class="overflow-x-auto">
//             <div class="min-w-full">
//               <!-- En-têtes des jours -->
//               <div class="grid grid-cols-8 border-b">
//                 <div class="p-4 text-sm font-medium text-gray-500"></div>
//                 <div *ngFor="let day of weekDays" class="p-4 text-center">
//                   <div class="text-sm font-medium text-gray-900">{{ day.name }}</div>
//                   <div class="text-2xl font-bold" [class.text-blue-600]="day.isToday" [class.text-gray-900]="!day.isToday">
//                     {{ day.date }}
//                   </div>
//                 </div>
//               </div>

//               <!-- Grille horaire -->
//               <div class="grid grid-cols-8">
//                 <!-- Colonne des heures -->
//                 <div class="border-r">
//                   <div *ngFor="let hour of hours" class="h-16 border-b flex items-center justify-center text-sm text-gray-500">
//                     {{ hour }}
//                   </div>
//                 </div>

//                 <!-- Colonnes des jours -->
//                 <div *ngFor="let day of weekDays; let dayIndex = index" class="border-r relative">
//                   <div *ngFor="let hour of hours; let hourIndex = index" class="h-16 border-b relative">
//                     <!-- Événements pour ce jour et cette heure -->
//                     <div *ngFor="let booking of getBookingsForDayAndHour(day.fullDate, hourIndex)" 
//                          class="absolute inset-x-1 bg-blue-100 border-l-4 border-blue-500 rounded p-1 text-xs z-10"
//                          [style.top.px]="getEventPosition(booking.startTime, hourIndex)"
//                          [style.height.px]="getEventHeight(booking.duration)"
//                          [class.bg-green-100]="booking.status === 'confirmed'"
//                          [class.border-green-500]="booking.status === 'confirmed'"
//                          [class.bg-yellow-100]="booking.status === 'pending'"
//                          [class.border-yellow-500]="booking.status === 'pending'"
//                          [class.bg-red-100]="booking.status === 'cancelled'"
//                          [class.border-red-500]="booking.status === 'cancelled'">
//                       <div class="font-medium truncate">{{ booking.title }}</div>
//                       <div class="text-gray-600 truncate">{{ booking.attendeeName }}</div>
//                       <div class="text-gray-500">{{ formatTime(booking.startTime) }}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <!-- Légende -->
//         <div class="mt-6 flex items-center gap-6">
//           <div class="flex items-center gap-2">
//             <div class="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
//             <span class="text-sm text-gray-600">Confirmé</span>
//           </div>
//           <div class="flex items-center gap-2">
//             <div class="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
//             <span class="text-sm text-gray-600">En attente</span>
//           </div>
//           <div class="flex items-center gap-2">
//             <div class="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"></div>
//             <span class="text-sm text-gray-600">Annulé</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `
// })
// export class CalendarViewComponent implements OnInit {
//   allBookings: any[] = [];
//   isLoading = true;
//   error: string | null = null;
  
//   currentWeek = new Date();
//   weekDays: any[] = [];
//   hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8h à 19h
//   currentWeekLabel = '';

//   constructor(private bookingService: BookingService) {}

//   ngOnInit() {
//     this.generateWeekDays();
//     this.loadAllBookings();
//   }

//   async loadAllBookings() {
//     try {
//       this.isLoading = true;
      
//       // Charger tous les types de réservations
//       const [upcoming, past, cancelled] = await Promise.all([
//         this.bookingService.getBookings('upcoming').toPromise(),
//         this.bookingService.getBookings('past').toPromise(),
//         this.bookingService.getBookings('cancelled').toPromise()
//       ]);

//       this.allBookings = [
//         ...this.extractBookings(upcoming),
//         ...this.extractBookings(past),
//         ...this.extractBookings(cancelled)
//       ];

//       console.log('Toutes les réservations chargées:', this.allBookings);
      
//     } catch (error) {
//       console.error('Erreur lors du chargement des réservations:', error);
//       this.error = 'Erreur lors du chargement des données';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   private extractBookings(response: any): any[] {
//     if (!response) return [];
    
//     if (response.data && Array.isArray(response.data.bookings)) {
//       return response.data.bookings;
//     } else if (response.data && Array.isArray(response.data)) {
//       return response.data;
//     } else if (Array.isArray(response.bookings)) {
//       return response.bookings;
//     } else if (Array.isArray(response)) {
//       return response;
//     }
    
//     return [];
//   }

//   generateWeekDays() {
//     const startOfWeek = new Date(this.currentWeek);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lundi

//     this.weekDays = [];
//     const today = new Date();
    
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(startOfWeek);
//       day.setDate(startOfWeek.getDate() + i);
      
//       this.weekDays.push({
//         name: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
//         date: day.getDate(),
//         fullDate: day.toISOString().split('T')[0],
//         isToday: day.toDateString() === today.toDateString()
//       });
//     }

//     this.currentWeekLabel = `${startOfWeek.toLocaleDateString('fr-FR', { 
//       day: 'numeric', 
//       month: 'long' 
//     })} - ${this.weekDays[6].date} ${startOfWeek.toLocaleDateString('fr-FR', { 
//       month: 'long', 
//       year: 'numeric' 
//     })}`;
//   }

//   getBookingsForDayAndHour(date: string, hourIndex: number): any[] {
//     return this.allBookings.filter(booking => {
//       const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
//       const bookingHour = new Date(booking.startTime).getHours();
      
//       return bookingDate === date && bookingHour >= (hourIndex + 8) && bookingHour < (hourIndex + 9);
//     });
//   }

//   getEventPosition(startTime: string, hourIndex: number): number {
//     const bookingTime = new Date(startTime);
//     const minutes = bookingTime.getMinutes();
//     return (minutes / 60) * 64; // 64px = hauteur d'une heure
//   }

//   getEventHeight(duration: number): number {
//     return Math.max((duration / 60) * 64, 20); // Minimum 20px de hauteur
//   }

//   formatTime(dateTime: string): string {
//     return new Date(dateTime).toLocaleTimeString('fr-FR', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   }

//   previousWeek() {
//     this.currentWeek.setDate(this.currentWeek.getDate() - 7);
//     this.generateWeekDays();
//   }

//   nextWeek() {
//     this.currentWeek.setDate(this.currentWeek.getDate() + 7);
//     this.generateWeekDays();
//   }

//   refreshCalendar() {
//     this.loadAllBookings();
//   }

//   goBack() {
//     window.history.back();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.animate-element', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('bookingAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class CalendarViewComponent implements OnInit {
  allBookings: any[] = [];
  isLoading = true;
  error: string | null = null;
  
  currentWeek = new Date();
  weekDays: any[] = [];
  hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  currentWeekLabel = '';

  stats = {
    upcoming: 0,
    ongoing: 0,
    past: 0,
    cancelled: 0,
    total: 0
  };

  constructor(private bookingService: BookingService) {}

  async ngOnInit() {
    this.generateWeekDays();
    await this.loadAllBookings();
  }

  private async loadAllBookings() {
    try {
      this.isLoading = true;
      
      const [upcoming, past, cancelled] = await Promise.all([
        this.bookingService.getBookings('upcoming').toPromise(),
        this.bookingService.getBookings('past').toPromise(),
        this.bookingService.getBookings('cancelled').toPromise()
      ]);

      this.allBookings = this.normalizeBookings([
        ...this.extractBookings(upcoming),
        ...this.extractBookings(past),
        ...this.extractBookings(cancelled)
      ]);

      this.updateStats();
      
    } catch (error) {
      console.error('Loading error:', error);
      this.error = 'Erreur lors du chargement des réservations';
    } finally {
      this.isLoading = false;
    }
  }

  private normalizeBookings(bookings: any[]): any[] {
    const now = new Date();
    return bookings.map(booking => {
      const startTime = new Date(booking.startTime || booking.start);
      const endTime = new Date(booking.endTime || booking.end);
      
      let status = 'upcoming';
      if (booking.cancelled) status = 'cancelled';
      else if (endTime < now) status = 'past';
      else if (startTime <= now && endTime >= now) status = 'ongoing';

      return {
        ...booking,
        id: booking.id || Math.random().toString(36).substring(2),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: (endTime.getTime() - startTime.getTime()) / (1000 * 60),
        title: booking.title || 'Entretien',
        attendeeName: this.getAttendeeName(booking),
        status: status
      };
    });
  }

  private getAttendeeName(booking: any): string {
    if (booking.attendees?.length > 0) {
      return booking.attendees[0].name || booking.attendees[0].email || 'Invité';
    }
    return booking.user?.name || 'Organisateur';
  }

  private extractBookings(response: any): any[] {
    if (!response) return [];
    if (response.data?.bookings) return response.data.bookings;
    if (response.data) return response.data;
    if (response.bookings) return response.bookings;
    return response || [];
  }

  private updateStats() {
    this.stats = {
      upcoming: this.allBookings.filter(b => b.status === 'upcoming').length,
      ongoing: this.allBookings.filter(b => b.status === 'ongoing').length,
      past: this.allBookings.filter(b => b.status === 'past').length,
      cancelled: this.allBookings.filter(b => b.status === 'cancelled').length,
      total: this.allBookings.length
    };
  }

  generateWeekDays() {
    const startOfWeek = new Date(this.currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    
    this.weekDays = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      this.weekDays.push({
        name: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
        date: day.getDate(),
        fullDate: day.toISOString().split('T')[0],
        isToday: day.toDateString() === today.toDateString()
      });
    }

    const endDate = new Date(startOfWeek);
    endDate.setDate(startOfWeek.getDate() + 6);
    
    this.currentWeekLabel = `${startOfWeek.getDate()} ${startOfWeek.toLocaleDateString('fr-FR', { month: 'short' })} - 
            ${endDate.getDate()} ${endDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`;
  }

  getBookingsForDayAndHour(date: string, hourIndex: number): any[] {
    const startHour = hourIndex + 8;
    return this.allBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      const bookingDay = bookingDate.toISOString().split('T')[0];
      const bookingHour = bookingDate.getHours();
      
      return bookingDay === date && 
             bookingHour >= startHour && 
             bookingHour < (startHour + 1);
    });
  }

  getEventPosition(startTime: string): number {
    const bookingTime = new Date(startTime);
    return (bookingTime.getMinutes() / 60) * 64;
  }

  getEventHeight(duration: number): number {
    return Math.max((duration / 60) * 64, 20);
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  previousWeek() {
    this.currentWeek.setDate(this.currentWeek.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentWeek.setDate(this.currentWeek.getDate() + 7);
    this.generateWeekDays();
  }

  refreshCalendar() {
    this.loadAllBookings();
  }

  goBack() {
    window.history.back();
  }

  getBookingClass(status: string): any {
    return {
      'bg-green-100 border-l-4 border-green-500': status === 'upcoming',
      'bg-yellow-100 border-l-4 border-yellow-500': status === 'ongoing',
      'bg-gray-100 border-l-4 border-gray-500': status === 'past',
      'bg-red-100 border-l-4 border-red-500': status === 'cancelled'
    };
  }
}