// // import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Chart } from 'chart.js/auto';
// // import { BookingService } from '../services/booking.service';
// // import { FormsModule } from '@angular/forms';
// // import { RouterModule } from '@angular/router';

// // @Component({
// //   selector: 'app-dashboard-rh',
// //   standalone: true,
// //   imports: [CommonModule, RouterModule, FormsModule],
// //   templateUrl: './dashboard-rh.component.html',
// //   styleUrls: ['./dashboard-rh.component.css']
// // })
// // export class DashboardRhComponent implements AfterViewInit, OnInit {
// //   @ViewChild('pieChart') pieChartRef: any;
// //   chart: any;
// //   calendarLoaded = false;
// //   bookings: any[] = [];
// //   loadingBookings = false;
// //   activeDropdown: number | null = null;
// //   showAddGuestsModal = false;
// //   newGuestEmail = '';
// //   selectedBooking: any = null;
  
// //   calendarConfig = {
// //     calLink: 'chadia-massoudi-eeek5f/entretien',
// //     elementId: 'my-cal-inline'
// //   };

// //   candidates = [
// //     { id: 1, name: 'Candidat 1', status: 'PresSelectionne' },
// //     { id: 2, name: 'Candidat 2', status: 'RH Interview' },
// //     { id: 3, name: 'Candidat 3', status: 'Technique' },
// //     { id: 4, name: 'Candidat 4', status: 'Embauché(e)' },
// //     { id: 5, name: 'Candidat 5', status: 'Refusé' },
// //     { id: 6, name: 'Candidat 6', status: 'PresSelectionne' },
// //   ];

// //   currentStats = this.calculateStats();

// //   constructor(private bookingService: BookingService) {}

// //   ngOnInit() {
// //     this.loadBookings();
// //   }

// //   ngAfterViewInit() {
// //     this.initChart();
// //     this.initCalendar();
// //   }

// //   async loadBookings() {
// //   this.loadingBookings = true;
// //   try {
// //     console.log('Début du chargement des réservations...');
// //     const response = await this.bookingService.getUpcomingBookings().toPromise();
    
// //     console.log('Réponse brute:', response);
    
// //     // Testez différentes structures de réponse possibles
// //     let bookingsData = [];
    
// //     if (response) {
// //       // Cas 1: response.data.bookings (structure attendue)
// //       if (response.data && Array.isArray(response.data.bookings)) {
// //         bookingsData = response.data.bookings;
// //       }
// //       // Cas 2: response.data directement
// //       else if (response.data && Array.isArray(response.data)) {
// //         bookingsData = response.data;
// //       }
// //       // Cas 3: response.bookings
// //       else if (Array.isArray(response.bookings)) {
// //         bookingsData = response.bookings;
// //       }
// //       // Cas 4: response est directement un tableau
// //       else if (Array.isArray(response)) {
// //         bookingsData = response;
// //       }
// //       // Cas 5: structure différente
// //       else {
// //         console.warn('Structure de réponse inattendue:', response);
// //         // Essayez de trouver un tableau dans la réponse
// //         const possibleArrays = Object.values(response).filter(value => Array.isArray(value));
// //         if (possibleArrays.length > 0) {
// //           bookingsData = possibleArrays[0] as any[];
// //         }
// //       }
// //     }
    
// //     this.bookings = bookingsData;
// //     console.log('Réservations traitées:', this.bookings);
// //     console.log('Nombre de réservations:', this.bookings.length);
    
// //     if (this.bookings.length === 0) {
// //       console.warn('Aucune réservation trouvée. Vérifiez:');
// //       console.warn('1. Que vous avez des réservations dans votre compte Cal.com');
// //       console.warn('2. Que votre clé API a les bonnes permissions');
// //       console.warn('3. Que les paramètres de filtre sont corrects');
// //     }
    
// //   } catch (error: any) {
// //     console.error('Erreur lors du chargement:', error);
    
// //     // Gestion d'erreur plus détaillée
// //     if (error.status === 401) {
// //       console.error('Erreur d\'authentification - vérifiez votre clé API');
// //     } else if (error.status === 403) {
// //       console.error('Accès refusé - vérifiez les permissions de votre clé API');
// //     } else if (error.status === 404) {
// //       console.error('Endpoint non trouvé - vérifiez l\'URL de l\'API');
// //     }
    
// //     this.bookings = [];
// //   } finally {
// //     this.loadingBookings = false;
// //   }
// // }

// //   formatDate(dateString: string): string {
// //     if (!dateString) return '';
// //     const date = new Date(dateString);
// //     const options: Intl.DateTimeFormatOptions = { 
// //       weekday: 'short', 
// //       day: 'numeric', 
// //       month: 'long',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       timeZone: 'Europe/Paris'
// //     };
// //     return date.toLocaleDateString('fr-FR', options);
// //   }

// //   formatTimeRange(startTime: string, endTime: string): string {
// //     if (!startTime || !endTime) return '';
// //     const start = new Date(startTime);
// //     const end = new Date(endTime);
    
// //     const timeOptions: Intl.DateTimeFormatOptions = { 
// //       hour: '2-digit', 
// //       minute: '2-digit',
// //       timeZone: 'Europe/Paris'
// //     };
    
// //     return `${start.toLocaleTimeString('fr-FR', timeOptions)} - ${end.toLocaleTimeString('fr-FR', timeOptions)}`;
// //   }

// //   toggleDropdown(bookingId: number) {
// //     this.activeDropdown = this.activeDropdown === bookingId ? null : bookingId;
// //   }

// //   closeDropdowns() {
// //     this.activeDropdown = null;
// //   }

// //   cancelBooking(bookingId: number) {
// //     console.log('Annulation de la réservation:', bookingId);
// //     this.closeDropdowns();
// //   }

// //   openAddGuestsModal(booking: any) {
// //     this.selectedBooking = booking;
// //     this.showAddGuestsModal = true;
// //     this.closeDropdowns();
// //   }

// //   closeAddGuestsModal() {
// //     this.showAddGuestsModal = false;
// //     this.newGuestEmail = '';
// //     this.selectedBooking = null;
// //   }

// //   addGuest() {
// //     if (this.newGuestEmail && this.selectedBooking) {
// //       console.log('Ajout de l\'invité:', this.newGuestEmail, 'à la réservation:', this.selectedBooking.id);
// //       this.closeAddGuestsModal();
// //     }
// //   }

// //   calculateStats() {
// //     return {
// //       presSelectionne: this.candidates.filter(c => c.status === 'PresSelectionne').length,
// //       rhInterview: this.candidates.filter(c => c.status === 'RH Interview').length,
// //       technique: this.candidates.filter(c => c.status === 'Technique').length,
// //       embauche: this.candidates.filter(c => c.status === 'Embauché(e)').length,
// //       refuse: this.candidates.filter(c => c.status === 'Refusé').length
// //     };
// //   }

// //   getStatLabel(key: string): string {
// //     const labels: Record<string, string> = {
// //       presSelectionne: 'Pré-sélection',
// //       rhInterview: 'Entretien RH',
// //       technique: 'Technique',
// //       embauche: 'Embauchés',
// //       refuse: 'Refusés'
// //     };
// //     return labels[key] || key;
// //   }

// //   initChart() {
// //     if (!this.pieChartRef?.nativeElement) {
// //       console.error('Canvas non trouvé');
// //       return;
// //     }

// //     this.chart = new Chart(this.pieChartRef.nativeElement, {
// //       type: 'doughnut',
// //       data: {
// //         labels: Object.keys(this.currentStats).map(key => this.getStatLabel(key)),
// //         datasets: [{
// //           data: Object.values(this.currentStats),
// //           backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'],
// //           borderWidth: 1
// //         }]
// //       },
// //       options: {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //           legend: {
// //             position: 'right'
// //           }
// //         }
// //       }
// //     });
// //   }

// //   initCalendar() {
// //     setTimeout(() => {
// //       this.calendarLoaded = true;
// //     }, 1500);
// //   }
// // }

// import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Chart } from 'chart.js/auto';
// import { BookingService } from '../services/booking.service';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import emailjs from '@emailjs/browser';
// import { environment } from '../environment';

// @Component({
//   selector: 'app-dashboard-rh',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule],
//   templateUrl: './dashboard-rh.component.html',
//   styleUrls: ['./dashboard-rh.component.css']
// })
// export class DashboardRhComponent implements AfterViewInit, OnInit {
//   @ViewChild('pieChart') pieChartRef: any;
//   chart: any;
//   calendarLoaded = false;
//   bookings: any[] = [];
//   loadingBookings = false;
//   activeDropdown: number | null = null;
//   showAddGuestsModal = false;
//   newGuestEmail = '';
//   selectedBooking: any = null;
  
//   calendarConfig = {
//     calLink: 'chadia-massoudi-eeek5f/entretien',
//     elementId: 'my-cal-inline'
//   };

//   candidates = [
//     { id: 1, name: 'Candidat 1', status: 'PresSelectionne' },
//     { id: 2, name: 'Candidat 2', status: 'RH Interview' },
//     { id: 3, name: 'Candidat 3', status: 'Technique' },
//     { id: 4, name: 'Candidat 4', status: 'Embauché(e)' },
//     { id: 5, name: 'Candidat 5', status: 'Refusé' },
//     { id: 6, name: 'Candidat 6', status: 'PresSelectionne' },
//   ];

//   // Membres de l'équipe
//   teamMembers = [
//     { id: 1, name: 'Membre Technique 1', email: 'chaimamassoudi72@gmail.com', selected: false },
//     { id: 2, name: 'Membre Technique 2', email: 'sadraouizeineb@gmail.com', selected: false },
//     { id: 3, name: 'Membre RH', email: 'chedia.massoudi@gmail.com', selected: false }
//   ];
//   selectedMember: any = null;
//   isSendingEmail = false;
//   emailStatus = '';

//   currentStats = this.calculateStats();

//   constructor(private bookingService: BookingService) {
//     emailjs.init(environment.emailjs.userId);
//   }

//   ngOnInit() {
//     this.loadBookings();
//   }

//   ngAfterViewInit() {
//     this.initChart();
//     this.initCalendar();
//   }

//   async loadBookings() {
//     this.loadingBookings = true;
//     try {
//       console.log('Début du chargement des réservations...');
//       const response = await this.bookingService.getUpcomingBookings().toPromise();
      
//       console.log('Réponse brute:', response);
      
//       let bookingsData = [];
      
//       if (response) {
//         if (response.data && Array.isArray(response.data.bookings)) {
//           bookingsData = response.data.bookings;
//         }
//         else if (response.data && Array.isArray(response.data)) {
//           bookingsData = response.data;
//         }
//         else if (Array.isArray(response.bookings)) {
//           bookingsData = response.bookings;
//         }
//         else if (Array.isArray(response)) {
//           bookingsData = response;
//         }
//         else {
//           console.warn('Structure de réponse inattendue:', response);
//           const possibleArrays = Object.values(response).filter(value => Array.isArray(value));
//           if (possibleArrays.length > 0) {
//             bookingsData = possibleArrays[0] as any[];
//           }
//         }
//       }
      
//       this.bookings = bookingsData;
//       console.log('Réservations traitées:', this.bookings);
      
//       if (this.bookings.length === 0) {
//         console.warn('Aucune réservation trouvée');
//       }
      
//     } catch (error: any) {
//       console.error('Erreur lors du chargement:', error);
      
//       if (error.status === 401) {
//         console.error('Erreur d\'authentification');
//       } else if (error.status === 403) {
//         console.error('Accès refusé');
//       } else if (error.status === 404) {
//         console.error('Endpoint non trouvé');
//       }
      
//       this.bookings = [];
//     } finally {
//       this.loadingBookings = false;
//     }
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = { 
//       weekday: 'short', 
//       day: 'numeric', 
//       month: 'long',
//       hour: '2-digit',
//       minute: '2-digit',
//       timeZone: 'Europe/Paris'
//     };
//     return date.toLocaleDateString('fr-FR', options);
//   }

//   formatTimeRange(startTime: string, endTime: string): string {
//     if (!startTime || !endTime) return '';
//     const start = new Date(startTime);
//     const end = new Date(endTime);
    
//     const timeOptions: Intl.DateTimeFormatOptions = { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       timeZone: 'Europe/Paris'
//     };
    
//     return `${start.toLocaleTimeString('fr-FR', timeOptions)} - ${end.toLocaleTimeString('fr-FR', timeOptions)}`;
//   }

//   toggleDropdown(bookingId: number) {
//     this.activeDropdown = this.activeDropdown === bookingId ? null : bookingId;
//   }

//   closeDropdowns() {
//     this.activeDropdown = null;
//   }

//   cancelBooking(bookingId: number) {
//     console.log('Annulation de la réservation:', bookingId);
//     this.closeDropdowns();
//   }

//   openAddGuestsModal(booking: any) {
//     this.selectedBooking = booking;
//     this.showAddGuestsModal = true;
//     this.closeDropdowns();
//     this.resetMemberSelection();
//   }

//   closeAddGuestsModal() {
//     this.showAddGuestsModal = false;
//     this.newGuestEmail = '';
//     this.selectedBooking = null;
//     this.emailStatus = '';
//   }

//   resetMemberSelection() {
//     this.teamMembers.forEach(m => m.selected = false);
//     this.selectedMember = null;
//     this.newGuestEmail = '';
//   }

//   toggleMemberSelection(member: any) {
//     this.teamMembers.forEach(m => m.selected = false);
//     member.selected = true;
//     this.selectedMember = member;
//     this.newGuestEmail = member.email;
//   }

//   async sendInterviewInvite() {
//     if (!this.selectedMember || !this.selectedBooking) {
//       console.error('Veuillez sélectionner un membre');
//       return;
//     }

//     this.isSendingEmail = true;
//     this.emailStatus = 'Envoi en cours...';

//     try {
//       const candidate = this.selectedBooking.attendees?.[0];
//       const interviewer = this.selectedBooking.user;

//       const templateParams = {
//         to_email: this.selectedMember.email,
//         to_name: this.selectedMember.name,
//         candidate_name: candidate?.name || 'Candidat',
//         candidate_email: candidate?.email || '',
//         interviewer_name: interviewer?.name || 'Organisateur',
//         interview_date: this.formatDate(this.selectedBooking.startTime || this.selectedBooking.start),
//         interview_time: this.formatTimeRange(
//           this.selectedBooking.startTime || this.selectedBooking.start,
//           this.selectedBooking.endTime || this.selectedBooking.end
//         ),
//         meeting_url: this.selectedBooking.metadata?.videoCallUrl || 
//                    this.selectedBooking.references?.find((r: any) => r.meetingUrl)?.meetingUrl || '',
//         location: this.selectedBooking.location || 'Lieu non spécifié'
//       };

//       await emailjs.send(
//         environment.emailjs.serviceId,
//         environment.emailjs.memberTemplateId,
//         templateParams
//       );

//       this.emailStatus = 'Invitation envoyée avec succès!';
//       setTimeout(() => {
//         this.closeAddGuestsModal();
//       }, 2000);
//     } catch (error) {
//       console.error('Erreur:', error);
//       this.emailStatus = "Erreur lors de l'envoi de l'email";
//     } finally {
//       this.isSendingEmail = false;
//     }
//   }

//   calculateStats() {
//     return {
//       presSelectionne: this.candidates.filter(c => c.status === 'PresSelectionne').length,
//       rhInterview: this.candidates.filter(c => c.status === 'RH Interview').length,
//       technique: this.candidates.filter(c => c.status === 'Technique').length,
//       embauche: this.candidates.filter(c => c.status === 'Embauché(e)').length,
//       refuse: this.candidates.filter(c => c.status === 'Refusé').length
//     };
//   }

//   getStatLabel(key: string): string {
//     const labels: Record<string, string> = {
//       presSelectionne: 'Pré-sélection',
//       rhInterview: 'Entretien RH',
//       technique: 'Technique',
//       embauche: 'Embauchés',
//       refuse: 'Refusés'
//     };
//     return labels[key] || key;
//   }

//   initChart() {
//     if (!this.pieChartRef?.nativeElement) {
//       console.error('Canvas non trouvé');
//       return;
//     }

//     this.chart = new Chart(this.pieChartRef.nativeElement, {
//       type: 'doughnut',
//       data: {
//         labels: Object.keys(this.currentStats).map(key => this.getStatLabel(key)),
//         datasets: [{
//           data: Object.values(this.currentStats),
//           backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'],
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'right'
//           }
//         }
//       }
//     });
//   }

//   initCalendar() {
//     setTimeout(() => {
//       this.calendarLoaded = true;
//     }, 1500);
//   }
// }

import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { BookingService } from '../services/booking.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import emailjs from '@emailjs/browser';
import { environment } from '../environment';

@Component({
  selector: 'app-dashboard-rh',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-rh.component.html',
  styleUrls: ['./dashboard-rh.component.css']
})
export class DashboardRhComponent implements AfterViewInit, OnInit {
  @ViewChild('pieChart') pieChartRef: any;
  chart: any;
  calendarLoaded = false;
  bookings: any[] = [];
  loadingBookings = false;
  activeDropdown: number | null = null;
  showAddGuestsModal = false;
  newGuestEmail = '';
  selectedBooking: any = null;
  
  calendarConfig = {
    calLink: 'chadia-massoudi-eeek5f/entretien',
    elementId: 'my-cal-inline'
  };

  candidates = [
    { id: 1, name: 'Candidat 1', status: 'PresSelectionne' },
    { id: 2, name: 'Candidat 2', status: 'RH Interview' },
    { id: 3, name: 'Candidat 3', status: 'Technique' },
    { id: 4, name: 'Candidat 4', status: 'Embauché(e)' },
    { id: 5, name: 'Candidat 5', status: 'Refusé' },
    { id: 6, name: 'Candidat 6', status: 'PresSelectionne' },
  ];

  // Membres de l'équipe
  teamMembers = [
    { id: 1, name: 'Membre Technique 1', email: 'chaimamassoudi72@gmail.com', selected: false },
    { id: 2, name: 'Membre Technique 2', email: 'sadraouizeineb@gmail.com', selected: false },
    { id: 3, name: 'Membre RH', email: 'chedia.massoudi@gmail.com', selected: false }
  ];
  selectedMember: any = null;
  isSendingEmail = false;
  emailStatus = '';

  currentStats = this.calculateStats();

  constructor(private bookingService: BookingService) {
    // Initialisation d'EmailJS avec la clé publique
    try {
      emailjs.init(environment.emailjs.publicKey);
      console.log('EmailJS initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation d\'EmailJS:', error);
    }
  }

  ngOnInit() {
    this.loadBookings();
  }

  ngAfterViewInit() {
    this.initChart();
    this.initCalendar();
  }

  async loadBookings() {
    this.loadingBookings = true;
    try {
      console.log('Début du chargement des réservations...');
      const response = await this.bookingService.getUpcomingBookings().toPromise();
      
      console.log('Réponse brute:', response);
      
      let bookingsData = [];
      
      if (response) {
        if (response.data && Array.isArray(response.data.bookings)) {
          bookingsData = response.data.bookings;
        }
        else if (response.data && Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        else if (Array.isArray(response.bookings)) {
          bookingsData = response.bookings;
        }
        else if (Array.isArray(response)) {
          bookingsData = response;
        }
        else {
          console.warn('Structure de réponse inattendue:', response);
          const possibleArrays = Object.values(response).filter(value => Array.isArray(value));
          if (possibleArrays.length > 0) {
            bookingsData = possibleArrays[0] as any[];
          }
        }
      }
      
      this.bookings = bookingsData;
      console.log('Réservations traitées:', this.bookings);
      
      if (this.bookings.length === 0) {
        console.warn('Aucune réservation trouvée');
      }
      
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      this.bookings = [];
    } finally {
      this.loadingBookings = false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date non spécifiée';
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Paris'
      };
      return date.toLocaleDateString('fr-FR', options);
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  }
// toggleDropdown(id) : ouvre/ferme un menu d'options pour une réservation spécifique.

// closeDropdowns() : ferme tous les menus.

// cancelBooking(id) : annule une réservation (simulé ici par un console.log).

// openAddGuestsModal(booking) : ouvre la modale pour inviter un membre.

// closeAddGuestsModal() : ferme la modale et réinitialise les champs.

// resetMemberSelection() : désélectionne tous les membres.

// toggleMemberSelection(member) : sélectionne un membre et pré-remplit son email.

  formatTimeRange(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return 'Heure non spécifiée';
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Europe/Paris'
      };
      
      return `${start.toLocaleTimeString('fr-FR', timeOptions)} - ${end.toLocaleTimeString('fr-FR', timeOptions)}`;
    } catch (error) {
      console.error('Erreur de formatage d\'heure:', error);
      return 'Heure invalide';
    }
  }

  toggleDropdown(bookingId: number) {
    this.activeDropdown = this.activeDropdown === bookingId ? null : bookingId;
  }

  closeDropdowns() {
    this.activeDropdown = null;
  }

  cancelBooking(bookingId: number) {
    console.log('Annulation de la réservation:', bookingId);
    this.closeDropdowns();
  }

  openAddGuestsModal(booking: any) {
    this.selectedBooking = booking;
    this.showAddGuestsModal = true;
    this.closeDropdowns();
    this.resetMemberSelection();
    console.log('Réservation sélectionnée:', booking);
  }

  closeAddGuestsModal() {
    this.showAddGuestsModal = false;
    this.newGuestEmail = '';
    this.selectedBooking = null;
    this.emailStatus = '';
    this.resetMemberSelection();
  }

  resetMemberSelection() {
    this.teamMembers.forEach(m => m.selected = false);
    this.selectedMember = null;
    this.newGuestEmail = '';
  }

  toggleMemberSelection(member: any) {
    this.teamMembers.forEach(m => m.selected = false);
    member.selected = true;
    this.selectedMember = member;
    this.newGuestEmail = member.email;
    console.log('Membre sélectionné:', member);
  }

  // dashboard-rh.component.ts
async sendInterviewInvite() {
  if (!this.selectedMember || !this.selectedBooking) {
    console.error('Veuillez sélectionner un membre');
    this.emailStatus = 'Erreur: Veuillez sélectionner un membre';
    return;
  }

  this.isSendingEmail = true;
  this.emailStatus = 'Envoi en cours...';

  try {
    // Extraction des données de la réservation
    
    const candidate = this.selectedBooking.attendees?.[0] || {};
    const interviewer = this.selectedBooking.user || this.selectedBooking.organizer || {};

    // Validation des données critiques
    if (!candidate.name && !candidate.email) {
      throw new Error('Informations du candidat manquantes');
    }

    // Extraction de l'URL de réunion
    let meetingUrl = '';
    if (this.selectedBooking.metadata?.videoCallUrl) {
      meetingUrl = this.selectedBooking.metadata.videoCallUrl;
    } else if (this.selectedBooking.location && this.selectedBooking.location.includes('http')) {
      meetingUrl = this.selectedBooking.location;
    }

    // Paramètres du template EmailJS - CORRESPONDANT À VOTRE TEMPLATE
    const templateParams = {
      // Paramètres pour le template membre (template_eg3p3mv)
      member_name: this.selectedMember.name,
      to_email: this.selectedMember.email,
      candidate_name: candidate.name || 'Candidat',
      candidate_position: 'Poste ..', // Ajoutez cette info si disponible
      interview_date: this.formatDate(
        this.selectedBooking.startTime || 
        this.selectedBooking.start || 
        this.selectedBooking.scheduledAt
      ),
      interview_time: this.formatTimeRange(
        this.selectedBooking.startTime || this.selectedBooking.start,
        this.selectedBooking.endTime || this.selectedBooking.end
      ),
      interview_duration: '15', // Durée par défaut ou calculée
      interview_type: 'Entretien technique', // Type d'entretien
      meeting_url: meetingUrl || 'Lien de réunion à confirmer',
      location: this.selectedBooking.location || 'Lieu non spécifié'
    };

    console.log('=== DEBUG EMAIL ===');
    console.log('Template params:', templateParams);
    console.log('EmailJS config:', {
      serviceId: environment.emailjs.serviceId,
      templateId: environment.emailjs.memberTemplateId,
      publicKey: environment.emailjs.publicKey
    });

    // Envoi de l'email
    const result = await emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.memberTemplateId,
      templateParams,
      environment.emailjs.publicKey
    );

    console.log('Résultat EmailJS:', result);

    if (result.status === 200) {
      this.emailStatus = 'Invitation envoyée avec succès!';
      console.log('Email envoyé avec succès à:', this.selectedMember.email);
      setTimeout(() => {
        this.closeAddGuestsModal();
      }, 2000);
    } else {
      throw new Error(`Échec de l'envoi: ${result.status} - ${result.text}`);
    }

  } catch (error: any) {
    console.error('=== ERREUR EMAIL ===');
    console.error('Erreur complète:', error);
    
    let errorMessage = "Erreur lors de l'envoi de l'email";
    
    if (error.status === 400) {
      errorMessage = "Erreur: Paramètres d'email invalides";
    } else if (error.status === 401) {
      errorMessage = "Erreur: Clé API EmailJS invalide";
    } else if (error.status === 404) {
      errorMessage = "Erreur: Template ou service EmailJS introuvable";
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = "Erreur: Problème de connexion réseau";
    } else if (error.message) {
      errorMessage = `Erreur: ${error.message}`;
    }
    
    this.emailStatus = errorMessage;
  } finally {
    this.isSendingEmail = false;
  }
}

  calculateStats() {
    return {
      presSelectionne: this.candidates.filter(c => c.status === 'PresSelectionne').length,
      rhInterview: this.candidates.filter(c => c.status === 'RH Interview').length,
      technique: this.candidates.filter(c => c.status === 'Technique').length,
      embauche: this.candidates.filter(c => c.status === 'Embauché(e)').length,
      refuse: this.candidates.filter(c => c.status === 'Refusé').length
    };
  }

  getStatLabel(key: string): string {
    const labels: Record<string, string> = {
      presSelectionne: 'Pré-sélection',
      rhInterview: 'Entretien RH',
      technique: 'Technique',
      embauche: 'Embauchés',
      refuse: 'Refusés'
    };
    return labels[key] || key;
  }

  initChart() {
    if (!this.pieChartRef?.nativeElement) {
      console.error('Canvas non trouvé');
      return;
    }

    this.chart = new Chart(this.pieChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.currentStats).map(key => this.getStatLabel(key)),
        datasets: [{
          data: Object.values(this.currentStats),
          backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  initCalendar() {
    setTimeout(() => {
      this.calendarLoaded = true;
    }, 1500);
  }


  
}