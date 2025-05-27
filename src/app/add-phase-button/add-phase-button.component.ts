import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-phase-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="addPhase.emit()"
      class="min-w-[250px] h-full flex items-center justify-center p-4 gap-2
             border-2 border-dashed border-gray-300 rounded-lg 
             hover:border-violet-400 hover:bg-violet-50 transition-colors 
             text-gray-500 hover:text-violet-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span class="font-medium">Ajouter une phase</span>
    </button>
  `,
  styles: []
})
export class AddPhaseButtonComponent {
  @Output() addPhase = new EventEmitter<void>();
}