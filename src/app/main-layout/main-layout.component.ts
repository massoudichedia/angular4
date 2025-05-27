// main-layout.component.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside class="w-64 min-h-screen bg-purple-800 text-white fixed md:relative z-40">
        <!-- Contenu de la sidebar -->
        <nav class="flex flex-col gap-1 p-4">
          <a 
            routerLink="/dashboard" 
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Tableau de bord RH</span>
          </a>
          <!-- Autres liens -->
        </nav>
      </aside>

      <!-- Contenu principal -->
      <div class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}