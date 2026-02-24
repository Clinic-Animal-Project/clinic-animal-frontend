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

  Math = Math;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading.set(true);

    this.clienteService.getClientes(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.clientes.set(response);
        this.loading.set(false);
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
