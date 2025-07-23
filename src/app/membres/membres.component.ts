import { Component, OnInit } from '@angular/core';
import { MembresService } from '../services/membres.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
}

interface MembreComplet {
  id: number;
  utilisateur: Utilisateur;
  statut: string;
  entretien: any;
  evaluation: any;
}

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './membres.component.html',
  styleUrls: ['./membres.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))])
    ]),
    trigger('slideInOut', [
      transition(':enter', [style({ transform: 'translateY(-20px)', opacity: 0 }), animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))])
    ])
  ]
})
export class MembresComponent implements OnInit {
  membres: MembreComplet[] = [];
  filteredMembres: MembreComplet[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  roleFilter: string = '';
  showModal: boolean = false;
  currentMembre: any = {
    utilisateur: { nom: '', email: '', role: 'RH' },
    statut: 'En attente'
  };
  isEditing: boolean = false;
  isLoading: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private membresService: MembresService) {}

  ngOnInit() {
    this.loadMembres();
  }

  loadMembres() {
    this.isLoading = true;
    this.membresService.getMembres().subscribe({
      next: (response) => {
        this.membres = response.data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erreur lors du chargement des membres: ' + this.extractErrorMessage(error));
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.membres.filter(membre => {
      const matchesSearch = this.searchTerm ? 
        membre.utilisateur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        membre.utilisateur.email.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesStatus = this.statusFilter ? membre.statut === this.statusFilter : true;
      const matchesRole = this.roleFilter ? membre.utilisateur.role === this.roleFilter : true;
      return matchesSearch && matchesStatus && matchesRole;
    });

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredMembres = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  updateStatus(membre: MembreComplet, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.membresService.updateMembre(membre.id, { statut: newStatus }).subscribe({
      next: () => {
        membre.statut = newStatus;
        this.showSuccess('Statut mis à jour avec succès');
      },
      error: (error) => this.showError('Erreur de mise à jour: ' + this.extractErrorMessage(error))
    });
  }

  // Gestion des modales
  openAddModal() {
    this.currentMembre = {
      utilisateur: { nom: '', email: '', role: 'RH' },
      statut: 'En attente'
    };
    this.isEditing = false;
    this.showModal = true;
  }

  openEditModal(membre: MembreComplet) {
    this.currentMembre = JSON.parse(JSON.stringify(membre));
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Soumission du formulaire
  submitForm() {
    if (this.isEditing) {
      this.updateMembre();
    } else {
      this.createUserAndMembre();
    }
  }

  private updateMembre() {
    this.membresService.updateMembre(this.currentMembre.id, { 
      statut: this.currentMembre.statut 
    }).subscribe({
      next: () => {
        this.loadMembres();
        this.closeModal();
        this.showSuccess('Membre mis à jour avec succès');
      },
      error: (error) => this.showError('Erreur de mise à jour: ' + this.extractErrorMessage(error))
    });
  }

  private createUserAndMembre() {
    const userData = {
      nom: this.currentMembre.utilisateur.nom,
      email: this.currentMembre.utilisateur.email,
      role: this.currentMembre.utilisateur.role
    };

    this.membresService.createUser(userData).subscribe({
      next: (userResponse) => {
        const membreData = {
          user_id: userResponse.data.id,
          statut: this.currentMembre.statut
        };
        this.createMembre(membreData);
      },
      error: (error) => this.showError('Erreur création utilisateur: ' + this.extractErrorMessage(error))
    });
  }

  private createMembre(membreData: {user_id: number, statut: string}) {
    this.membresService.createMembre(membreData).subscribe({
      next: () => {
        this.loadMembres();
        this.closeModal();
        this.showSuccess('Membre créé avec succès');
      },
      error: (error) => this.showError('Erreur création membre: ' + this.extractErrorMessage(error))
    });
  }

  // Gestion des membres
  deleteMembre(membreId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      this.membresService.deleteMembre(membreId).subscribe({
        next: () => {
          this.membres = this.membres.filter(m => m.id !== membreId);
          this.applyFilters();
          this.showSuccess('Membre supprimé avec succès');
        },
        error: (error) => this.showError('Erreur de suppression: ' + this.extractErrorMessage(error))
      });
    }
  }

  // Pagination
  getPages(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  // Helpers
  private extractErrorMessage(error: any): string {
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    return 'Erreur inconnue';
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }
}