import { Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';

export const PERSONAL_CRUD_ROUTES: Routes = [
  {
    path: '',
    component: PersonalComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/personal-list/personal-list.component')
          .then(m => m.PersonalListComponent)
      },
      {
        path: 'crear',
        loadComponent: () => import('./components/personal-form/personal-form.component')
          .then(m => m.PersonalFormComponent)
      }
    ]
  }
];
