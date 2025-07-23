// import { Routes } from '@angular/router';
// import { CandidateEvaluationComponent } from './candidate-evaluation/candidate-evaluation.component';
// import { AppComponent } from './app.component';
// import { DashboardRhComponent } from './dashboard-rh/dashboard-rh.component';
// import { KanbanComponent } from './kanban/kanban.component';
// import { CalendarViewComponent } from './calendar-view/calendar-view.component';
// import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
// import { MembresComponent } from './membres/membres.component';

// export const routes: Routes = [
//   {
//     path: 'evaluation/:stepId',
//     component: CandidateEvaluationComponent,
//     outlet: 'modal'
//   },
  
//   {
//     path: 'dashboard',
//     component: DashboardRhComponent
//   },
//   {
//     path: '',
//     component: KanbanComponent,
//     pathMatch: 'full'
//   },
//   {
//     path: 'calendar-view', 
//     component: CalendarViewComponent
//   },


 
//   { path: '**', redirectTo: '' },
//   { path: 'membres', component: MembresComponent },



// ];
// app.routes.ts
import { Routes } from '@angular/router';
import { CandidateEvaluationComponent } from './candidate-evaluation/candidate-evaluation.component';
import { DashboardRhComponent } from './dashboard-rh/dashboard-rh.component';
import { KanbanComponent } from './kanban/kanban.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { MembresComponent } from './membres/membres.component';

export const routes: Routes = [
  {
    path: 'evaluation/:stepId',
    component: CandidateEvaluationComponent,
    outlet: 'modal'
  },
  {
    path: 'dashboard',
    component: DashboardRhComponent
  },
  {
    path: 'calendar-view', 
    component: CalendarViewComponent
  },
  {
    path: 'membres',
    component: MembresComponent
  },
  {
    path: '',
    component: KanbanComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];