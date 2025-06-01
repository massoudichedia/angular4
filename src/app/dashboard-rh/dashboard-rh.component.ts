import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CalComService } from '../cal-com.service';

@Component({
  selector: 'app-dashboard-rh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-rh.component.html',
  styleUrls: ['./dashboard-rh.component.css']
})
export class DashboardRhComponent implements AfterViewInit {
  @ViewChild('pieChart') pieChartRef: any;
  chart: any;
  calendarLoaded = false;
  
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

  currentStats = this.calculateStats();

  constructor(private calComService: CalComService) {}

  ngAfterViewInit() {
    this.initChart();
    this.initCalendar();
  }

  async initCalendar() {
    try {
      await this.calComService.initCalendar(
        this.calendarConfig.calLink,
        this.calendarConfig.elementId
      );
      this.calendarLoaded = true;
    } catch (error) {
      console.error('Erreur calendrier:', error);
      this.calendarLoaded = false;
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
}