import { Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';

export const PERSONAL_CRUD_ROUTES: Routes = [
  {
    path: '',
    component: PersonalComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./personal.component')
          .then(m => m.PersonalComponent)
      }
    ]
  }
];
