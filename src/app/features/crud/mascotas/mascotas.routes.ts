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
      },
      {
        path: 'crear',
        loadComponent: () => import('./components/mascota-form/mascotas-form.component')
          .then(m => m.MascotaFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/mascota-form/mascotas-form.component')
          .then(m => m.MascotaFormComponent)
      }
    ]
  }
];