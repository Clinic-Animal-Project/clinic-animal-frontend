import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Login (sin layout) - solo para usuarios NO autenticados
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/components/login/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },

  // Rutas con layout (requieren autenticación)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Inicio
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/inicio/inicio.component')
          .then(m => m.InicioComponent)
      },
      // Clientes
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes-page.component')
          .then(m => m.ClientesPageComponent)
      },
      // Mascotas
      {
        path: 'mascotas',
        loadComponent: () => import('./features/mascotas/mascotas-page.component')
          .then(m => m.MascotasPageComponent)
      },
      // Citas
      {
        path: 'citas',
        loadComponent: () => import('./features/citas/citas-page.component')
          .then(m => m.CitasPageComponent)
      },
      // Mantenimiento CRUD
      {
        path: 'mantenimiento',
        children: [
          {
            path: 'clientes',
            loadChildren: () => import('./features/crud/clientes/clientes.routes')
              .then(m => m.CLIENTES_CRUD_ROUTES)
          },
          {
            path: 'mascotas',
            loadChildren: () => import('./features/crud/mascotas/mascotas.routes')
              .then(m => m.MASCOTAS_CRUD_ROUTES)
          }
        ]
      }
    ]
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: ''
  }
];
