import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-widget',
  imports: [],
  templateUrl: './calendar-widget.component.html',
  styleUrl: './calendar-widget.component.css'
})
export class CalendarWidgetComponent implements OnInit {
  monthName: string = '';
  year: number = 0;
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  calendarDays: (number | null)[] = [];

  ngOnInit(): void {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.monthName = today.toLocaleString('default', { month: 'long' });
    this.year = year;

    const tempDays: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      tempDays.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      tempDays.push(d);
    }

    this.calendarDays = tempDays;
  }
}
