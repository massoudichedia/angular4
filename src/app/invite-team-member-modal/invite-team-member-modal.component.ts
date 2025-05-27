import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faUserShield, faEye, faPen, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-invite-team-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <!-- Header -->
        <div class="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            <fa-icon [icon]="faUserPlus" class="mr-2"></fa-icon>
            Inviter un membre de l'équipe
          </h3>
          <button (click)="onClose()" class="text-gray-400 hover:text-gray-500">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4">
          <!-- Email Input -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              <fa-icon [icon]="faEnvelope" class="mr-2"></fa-icon>
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              (input)="validateForm()"
              placeholder="Entrez l'adresse e-mail"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <!-- Permissions Dropdown -->
          <div class="mb-6">
            <label for="permissions" class="block text-sm font-medium text-gray-700 mb-1">
              <fa-icon [icon]="faUserShield" class="mr-2"></fa-icon>
              Rôle/Permission
            </label>
            <select
              id="permissions"
              [(ngModel)]="selectedPermission"
              (change)="validateForm()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled selected>Choisir un rôle</option>
              <option value="view">
                <fa-icon [icon]="faEye"></fa-icon> Voir seulement
              </option>
              <option value="edit">
                <fa-icon [icon]="faPen"></fa-icon> Modifier seulement
              </option>
              <option value="view_edit">
                <fa-icon [icon]="faEye"></fa-icon> <fa-icon [icon]="faPen"></fa-icon> Voir & Modifier
              </option>
            </select>
          </div>

          <!-- Invited Members List -->
          <div *ngIf="invitedMembers.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Membres invités</h4>
            <ul class="divide-y divide-gray-200">
              <li *ngFor="let member of invitedMembers" class="py-3 flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ member.email }}</p>
                  <p class="text-xs text-gray-500">{{ getPermissionLabel(member.permission) }}</p>
                </div>
                <button 
                  (click)="removeMember(member)"
                  class="text-red-500 hover:text-red-700"
                >
                  <fa-icon [icon]="faTimes"></fa-icon>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-4 py-3 flex justify-end gap-3">
          <button
            (click)="onClose()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            (click)="inviteMember()"
            [disabled]="!isFormValid"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Inviter
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    select {
      background-image: none; /* Remove default dropdown arrow */
    }
  `]
})
export class InviteTeamMemberModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() invite = new EventEmitter<{email: string, permission: string}>();

  // Icons
  faEnvelope = faEnvelope;
  faUserShield = faUserShield;
  faEye = faEye;
  faPen = faPen;
  faTimes = faTimes;
  faUserPlus = faUserPlus;

  email = '';
  selectedPermission = '';
  isFormValid = false;
  invitedMembers: {email: string, permission: string}[] = [];

  validateForm() {
    this.isFormValid = 
      this.email.trim() !== '' && 
      this.email.includes('@') && 
      this.selectedPermission !== '';
  }

  inviteMember() {
    if (this.isFormValid) {
      this.invite.emit({
        email: this.email,
        permission: this.selectedPermission
      });
      this.invitedMembers.push({
        email: this.email,
        permission: this.selectedPermission
      });
      this.email = '';
      this.selectedPermission = '';
      this.isFormValid = false;
    }
  }

  removeMember(member: {email: string, permission: string}) {
    this.invitedMembers = this.invitedMembers.filter(m => m.email !== member.email);
  }

  getPermissionLabel(permission: string): string {
    switch(permission) {
      case 'view': return 'Voir seulement';
      case 'edit': return 'Modifier seulement';
      case 'view_edit': return 'Voir & Modifier';
      default: return '';
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}