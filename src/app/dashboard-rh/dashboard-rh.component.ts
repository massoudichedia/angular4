// dashboard-rh.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-rh',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-rh.component.html',
  styleUrls: ['./dashboard-rh.component.css']
})
export class DashboardRhComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef: any;
  
  stats = {
    candidats: 124,
    entretiens: 42,
    embauches: 8,
    rejets: 76,
    enAttente: 38
  };

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    setTimeout(() => {
      const ctx = this.pieChartRef.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Pré-sélection', 'Entretien RH', 'Technique', 'Embauchés', 'Refusés'],
          datasets: [{
            data: [25, 20, 15, 8, 32],
            backgroundColor: [
              '#8b5cf6',
              '#3b82f6',
              '#06b6d4',
              '#10b981',
              '#ef4444'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
    }, 100);
  }
}