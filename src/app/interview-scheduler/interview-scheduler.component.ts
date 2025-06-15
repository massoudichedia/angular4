import { Component, Input } from '@angular/core';
import { InterviewService } from '../interview.service';

@Component({
  selector: 'app-interview-scheduler',
  templateUrl: './interview-scheduler.component.html',
  styleUrls: ['./interview-scheduler.component.css']
})
export class InterviewSchedulerComponent {
  @Input() candidate: any;
  calLink = 'https://your-cal.com/username'; // Remplacez par votre lien Cal.com

  constructor(private interviewService: InterviewService) {}

  onScheduleInterview() {
    this.interviewService.scheduleInterview(this.candidate.id, this.calLink)
      .subscribe({
        next: (response) => {
          console.log('Interview scheduled', response);
          // Ouvrir le lien Cal.com dans un nouvel onglet
          window.open(this.calLink, '_blank');
        },
        error: (err) => {
          console.error('Error scheduling interview', err);
        }
      });
  }
}