import { Routes } from '@angular/router';
import { InicioComponent } from './inicio.component';

export const INICO_CRUD_ROUTES: Routes = [
  {
    path: '',
    component: InicioComponent,
    children: [
      {
        path: '', // Ruta por defecto: /inicio
        loadComponent: () => import('./components/cita-list/cita-list.component')
          .then(m => m.CitaListComponent)
      },
      {
        path: 'cita/:id',
        loadComponent: () => import('./components/cita-detail/cita-detail.component')
          .then(m => m.CitaDetailComponent)
      }
    ]
  }
];
