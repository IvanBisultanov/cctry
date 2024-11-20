import { Routes } from '@angular/router';
import { ShellComponent } from '@cc/shell';

export const shellRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: async () => (await import('@cc/dashboard')).DashboardComponent,
      },
    ]
  },
];
