import { Routes } from '@angular/router';
import { LeaguesListComponent } from './components/leagues-list/leagues-list.component';

export const routes: Routes = [
  { path: '', component: LeaguesListComponent },
  { path: '**', redirectTo: '' }
];
