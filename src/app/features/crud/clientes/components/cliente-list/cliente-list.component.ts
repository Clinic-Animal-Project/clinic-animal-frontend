import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  templateUrl: './cliente-list.component.html'
})
export class ClienteListComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  pageSize = 10;
  totalItems = signal(0);
  totalPages = signal(0);

  // ID del cliente recién creado (para resaltarlo)
  clienteNuevoId: number | null = null;

  Math = Math;

  ngOnInit(): void {
    // Detectar si venimos de crear un cliente (state de la navegación)
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { clienteNuevoId?: number } | undefined;
    if (state?.clienteNuevoId) {
      this.clienteNuevoId = state.clienteNuevoId;
      // Quitar resaltado después de 4 segundos
      setTimeout(() => { this.clienteNuevoId = null; }, 4000);
    }

    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading.set(true);

    this.clienteService.getClientes(this.currentPage(), this.pageSize).subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
        this.loading.set(false);

        // Si no detectamos el ID desde el state (timing), buscar el último añadido
        if (this.clienteNuevoId === null) {
          const history = (window.history.state) as { clienteNuevoId?: number };
          if (history?.clienteNuevoId) {
            this.clienteNuevoId = history.clienteNuevoId;
            setTimeout(() => { this.clienteNuevoId = null; }, 4000);
          }
        }
      },
      error: () => {
        this.notificationService.error('Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }

  nuevoCliente(): void {
    this.router.navigate(['/mantenimiento/clientes/crear']);
  }

  verDetalle(cliente: Cliente): void {
    this.router.navigate(['/mantenimiento/clientes', cliente.id]);
  }

  editarCliente(cliente: Cliente): void {
    this.router.navigate(['/mantenimiento/clientes/editar', cliente.id]);
  }

  eliminarCliente(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      this.clienteService.deleteCliente(cliente.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Cliente eliminado exitosamente');
            this.cargarClientes();
          }
        },
        error: () => {
          this.notificationService.error('Error al eliminar cliente');
        }
      });
    }
  }

  cambiarPagina(page: number): void {
    this.currentPage.set(page);
    this.cargarClientes();
  }

  paginaAnterior(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.cargarClientes();
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.cargarClientes();
    }
  }
}
