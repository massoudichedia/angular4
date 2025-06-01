import { Routes } from '@angular/router';
import { CandidateEvaluationComponent } from './candidate-evaluation/candidate-evaluation.component';
import { AppComponent } from './app.component';
import { DashboardRhComponent } from './dashboard-rh/dashboard-rh.component';
import { KanbanComponent } from './kanban/kanban.component';

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
    path: '',
    component: KanbanComponent,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }
];