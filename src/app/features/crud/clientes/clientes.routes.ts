import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';

export const CLIENTES_CRUD_ROUTES: Routes = [
  {
    path: '',
    component: ClientesComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/cliente-list/cliente-list.component')
          .then(m => m.ClienteListComponent)
      },
      {
        path: 'crear',
        loadComponent: () => import('./components/cliente-form/cliente-form.component')
          .then(m => m.ClienteFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/cliente-form/cliente-form.component')
          .then(m => m.ClienteFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/cliente-detail/cliente-detail.component')
          .then(m => m.ClienteDetailComponent)
      }
    ]
  }
];
