 import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDescription } from '../interfaces/kanban.interface';

@Component({
  selector: 'app-job-description-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-purple-800">Fiche de Poste</h2>
            <button (click)="onClose.emit()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div *ngIf="jobDescription" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Poste/Mission</h3>
              <p class="mt-1 text-gray-700">{{ jobDescription.title }}</p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900">Phases associées</h3>
             
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900">Compétences techniques requises</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <span *ngFor="let skill of jobDescription.technicalSkills" 
                      class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900">Compétences transversales requises</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <span *ngFor="let skill of jobDescription.transversalSkills" 
                      class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div *ngIf="jobDescription.requiredExperience">
              <h3 class="text-lg font-semibold text-gray-900">Expérience requise</h3>
              <p class="mt-1 text-gray-700">{{ jobDescription.requiredExperience }}</p>
            </div>

            <div *ngIf="jobDescription.educationLevel">
              <h3 class="text-lg font-semibold text-gray-900">Niveau d'éducation</h3>
              <p class="mt-1 text-gray-700">{{ jobDescription.educationLevel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class JobDescriptionModalComponent {
  @Input() jobDescription: JobDescription | null = null;
  @Output() onClose = new EventEmitter<void>();
} 