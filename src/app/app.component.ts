import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
   
    RouterOutlet,
  ]
})
export class AppComponent {
  #http = inject(HttpClient);
  router = inject(Router);

  // Variables pour la sidebar
  isSidebarCollapsed = false;
  activeSection: string = 'dashboard';

  // Méthode pour basculer la sidebar
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Méthode pour changer de section
  setActiveSection(section: string) {
    console.log('setActiveSection called with:', section);
    this.activeSection = section;

    if (section === 'stats') {
      this.router.navigateByUrl('/dashboard');
    } else if (section === 'dashboard') {
      this.router.navigateByUrl('/');
    } else if (section === 'candidates') {
      this.router.navigateByUrl('/');
    }
     else if (section === 'settings') {
      this.router.navigateByUrl('/');
    }

    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }
}