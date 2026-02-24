import { Routes } from '@angular/router';
import { MascotasComponent } from './mascotas.component';

export const MASCOTAS_CRUD_ROUTES: Routes = [
  {
    path: '',
    component: MascotasComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/mascotas-list/mascotas-list.component')
          .then(m => m.MascotasListComponent)
      }
    ]
  }
];
