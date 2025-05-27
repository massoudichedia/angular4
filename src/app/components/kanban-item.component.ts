import { Component, input, computed, Output, EventEmitter } from '@angular/core';
import { KanbanItem } from '../interfaces/kanban.interface';
import { CircleProgressComponent } from '../circle-progress/circle-progress.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-item',
  standalone: true,
  imports: [CommonModule, CircleProgressComponent],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md w-full min-w-[350px] relative hover:shadow-lg transition-shadow">
      <button 
        (click)="openDetails.emit(item())" 
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="View details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>

      <div class="flex items-center gap-4 mb-6">
        <img [src]="item().avatar" alt="Avatar de {{item().name}}" class="w-14 h-14 rounded-full object-cover">
        <div>
          <h3 class="font-bold text-lg text-gray-900">{{ item().name }}</h3>
          <p class="text-base text-gray-500 truncate">{{ item().email }}</p>
        </div>
      </div>
      
      <div class="flex justify-between items-center">
        <app-circle-progress 
          [progress]="item().progress" 
          [color]="progressColor()"
          [size]="50"
        />
        <span class="text-sm font-medium px-3 py-1 rounded-full"
              [ngClass]="{
                'bg-red-100 text-red-800': item().status === 'Refusé',
                'bg-blue-100 text-blue-800': item().status === 'Technique',
                'bg-green-100 text-green-800': item().status === 'Embauché(e)',
                'bg-orange-100 text-orange-800': item().status === 'RH Interview',
                'bg-purple-100 text-purple-800': item().status === 'PresSelectionne'
              }">
          {{ getStatusLabel(item().status) }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class KanbanItemComponent {
  item = input.required<KanbanItem>();
  
  progressValue = computed(() => this.item().progress ?? 0);

  @Output() openDetails = new EventEmitter<KanbanItem>();

  progressColor = computed(() => {
    const status = this.item().status;
    if (status === 'Refusé') return '#ef4444';
    if (status === 'Technique') return '#06b6d4';
    if (status === 'Embauché(e)') return '#10b981';
    if (status === 'RH Interview') return '#3b82f6';
    if (status === 'PresSelectionne') return '#8b5cf6';
    return '#9ca3af';
  });

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      'PresSelectionne': 'Pré-sélection',
      'RH Interview': 'Entretien RH',
      'Technique': 'Technique',
      'Embauché(e)': 'Embauché',
      'Refusé': 'Refusé'
    };
    return statusMap[status] || status;
  }
}