import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, CdkDragHandle, FormsModule],
  template: `
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center">
        <button class="mr-2 cursor-pointer" cdkDragHandle>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="stroke-gray-400">
            <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
        </button>
        
        @if (!isEditing) {
          <h2 class="text-xl font-bold">
            {{ title }}
            <span class="ml-2 text-sm font-normal text-gray-500">
              ({{ tickets.length }})
            </span>
          </h2>
        } @else {
          <input 
            type="text" 
            [(ngModel)]="editedTitle"
            (blur)="saveTitle()"
            (keyup.enter)="saveTitle()"
            class="text-xl font-bold border border-gray-300 rounded px-2 py-1"
            autofocus
          />
        }
      </div>
      
      <div class="flex gap-2">
        <button (click)="startEditing()" class="text-gray-500 hover:text-gray-700" *ngIf="!isEditing">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        
        <button (click)="deleteColumn.emit()" class="text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
       
        
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 380px;
    }
  `]
})
export class KanbanColumnComponent {
  @Input() title: string = '';
  @Input() tickets: any[] = [];
  @Output() addCandidate = new EventEmitter<void>();
  @Output() deleteColumn = new EventEmitter<void>();
  @Output() titleChanged = new EventEmitter<string>();
 @Input() color: string = '#64748b';
@Input() bgColor: string = '#f8fafc';
@Input() isLocked: boolean = false;
  
  isEditing = false;
  editedTitle = '';

  startEditing() {
    this.editedTitle = this.title;
    this.isEditing = true;
  }

  saveTitle() {
    this.isEditing = false;
    if (this.editedTitle && this.editedTitle !== this.title) {
      this.titleChanged.emit(this.editedTitle);
    }
  }
}