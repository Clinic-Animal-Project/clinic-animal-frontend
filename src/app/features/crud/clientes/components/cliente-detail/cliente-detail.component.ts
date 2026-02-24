import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  templateUrl: './cliente-detail.component.html'
})
export class ClienteDetailComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cliente = signal<Cliente | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCliente(Number(id));
    }
  }

  cargarCliente(id: number): void {
    this.loading.set(true);

    this.clienteService.getClienteById(id).subscribe({
      next: (response) => {
        this.cliente.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.loading.set(false);
        this.volver();
      }
    });
  }

  editarCliente(): void {
    if (this.cliente()) {
      this.router.navigate(['/mantenimiento/clientes/editar', this.cliente()!.id]);
    }
  }

  eliminarCliente(): void {
    const cliente = this.cliente();
    if (!cliente) return;

    if (confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      this.clienteService.deleteCliente(cliente.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Cliente eliminado exitosamente');
            this.volver();
          }
        },
        error: () => {
          this.notificationService.error('Error al eliminar cliente');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/mantenimiento/clientes']);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
