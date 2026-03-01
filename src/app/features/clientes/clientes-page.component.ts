import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientService } from '../../features/clientes/service/client-service';
import { Client } from '../../features/clientes/model/client-model';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../mascotas/models/mascotas.models';
import { ClienteRequestDto } from '../../features/clientes/model/client-model';


@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-page.html'
})

export class ClientesPageComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private clientService = inject(ClientService);
  private zone = inject(NgZone);
  private router = inject(Router);
  nombreBusqueda: string = '';
  toastVisible = false;
  toastEnDOM = false;

  nuevoCliente: ClienteRequestDto = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: '',
    email: ''
  };
  clientes: Client[] = [];
  mascotas: Mascota[] = [];
  clienteId!: number;
  clienteSeleccionado: Client | null = null;
  mostrarModal = false;
  mascotaPendiente: Mascota | null = null;
  clientePendiente: Client | null = null;
  modalSobreescribir = false;
  mostrarToast = false;
  mensajeToast = '';
  errores: any = {};
  modalCrear = false;
  tipoToast: 'success' | 'error' = 'success';

  // --- Edición ---
  modalEditar = false;
  clienteEditando: ClienteRequestDto = {
    nombre: '', apellido: '', dni: '', telefono: '', direccion: '', email: ''
  };
  clienteEditandoId: number | null = null;

  // --- Cliente destacado (recién creado) ---
  clienteDestacadoId: number | null = null;

  ngOnInit(): void {
    this.cargarTodosLosClientes();
  }

  constructor() {
    console.log("🔥 COMPONENTE CREADO");
  }

  ngOnDestroy() {
    console.log("💀 COMPONENTE DESTRUIDO");
  }

  cargarTodosLosClientes() {
    this.clientService.listarClientes('').subscribe(data => {
      this.clientes = [...data];
      this.cdr.detectChanges();
    });
  }

  abrirModal(cliente: Client) {
    this.clienteSeleccionado = cliente;
    this.mostrarModal = true;
    this.buscarMascotaPorIdCliente(cliente.id);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.clienteSeleccionado = null;
    this.mascotaPendiente = null;
    this.clientePendiente = null;
    this.modalSobreescribir = false;
    this.modalCrear = false;
    this.mascotas = [];
  }

  buscarPorNombre() {
    this.clientService.listarClientes(this.nombreBusqueda).subscribe(data => {
      console.log("Busqueda nombre 👉", data);
      this.clientes = [...data];
      this.cdr.detectChanges();
    });
  }

  buscarMascotaPorIdCliente(id: number) {
    this.clientService.listarMascotasPorCliente(id).subscribe(data => {
      console.log("Mascotas del cliente 👉", data);
      this.mascotas = [...data];
      this.cdr.detectChanges();
    });
  }

  guardarSeleccion(mascota: Mascota, cliente: Client | null) {
    if (!cliente) return;
    const existeSeleccion = localStorage.getItem('mascotaSeleccionada');

    if (existeSeleccion) {
      this.mascotaPendiente = mascota;
      this.clientePendiente = cliente;
      this.sobreescribirSeleccion();
      return;
    }

    const mascotaData = { id: mascota.id, nombre: mascota.nombre };
    const clienteData = { id: cliente.id, nombre: cliente.nombre };

    localStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
    localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));
    this.mostrarMensaje('Mascota y cliente guardados correctamente 🐾', 'success');
    console.log("Mascota guardada 👉", mascotaData);
  }

  sobreescribirSeleccion() {
    this.modalSobreescribir = true;
  }

  aceptarSobreescripcion() {
    if (!this.mascotaPendiente || !this.clientePendiente) return;

    const mascotaData = { id: this.mascotaPendiente.id, nombre: this.mascotaPendiente.nombre };
    const clienteData = { id: this.clientePendiente.id, nombre: this.clientePendiente.nombre };

    localStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
    localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));
    this.mostrarMensaje('Mascota y cliente guardados correctamente 🐾', 'success');
    console.log("✅ Selección sobreescrita 👉", mascotaData);

    this.mascotaPendiente = null;
    this.clientePendiente = null;
    this.modalSobreescribir = false;
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.toastVisible = true;
      this.cdr.detectChanges();
    }, 40);

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
      setTimeout(() => this.mostrarToast = false, 500);
    }, 3000);
  }

  registrar() {
    this.clientService.registrarCliente(this.nuevoCliente)
      .subscribe({
        next: (resp: any) => {
          this.mostrarMensaje('Cliente registrado correctamente ✅', 'success');
          this.limpiarFormulario();
          this.modalCrear = false;

          // Recargar lista y destacar el nuevo cliente
          this.clientService.listarClientes('').subscribe(data => {
            this.clientes = [...data];
            this.cdr.detectChanges();

            // Intentar identificar el cliente creado: es el nuevo en la lista
            const clienteCreado = resp?.data ?? resp;
            if (clienteCreado?.id) {
              this.destacarCliente(clienteCreado.id);
            } else {
              // fallback: destacar el último de la lista
              if (this.clientes.length > 0) {
                const ultimo = this.clientes[this.clientes.length - 1];
                this.destacarCliente(ultimo.id);
              }
            }
          });
        },
        error: (error) => {
          console.log("STATUS:", error.status);
          console.log("ERROR OBJ:", error.error);
          if (error.error?.mensaje) {
            this.mostrarMensaje(error.error.mensaje, 'error');
          } else {
            this.mostrarMensaje('Error inesperado ❌', 'error');
          }
        }
      });
  }

  destacarCliente(id: number) {
    this.clienteDestacadoId = id;
    // Quitar el destacado después de 4 segundos
    setTimeout(() => {
      this.clienteDestacadoId = null;
      this.cdr.detectChanges();
    }, 4000);
  }

  limpiarFormulario() {
    this.nuevoCliente = {
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      direccion: '',
      email: ''
    };
    this.errores = {};
  }

  modalCrearCliente() {
    this.modalCrear = true;
  }

  // ========== EDICIÓN ==========

  abrirModalEditar(cliente: Client, event: Event) {
    event.stopPropagation(); // evitar que abra el modal de mascotas
    this.clienteEditandoId = cliente.id;
    this.clienteEditando = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      dni: cliente.dni,
      telefono: cliente.telefono,
      direccion: cliente.direccion ?? '',
      email: cliente.email
    };
    this.modalEditar = true;
  }

  cerrarModalEditar() {
    this.modalEditar = false;
    this.clienteEditandoId = null;
    this.clienteEditando = {
      nombre: '', apellido: '', dni: '', telefono: '', direccion: '', email: ''
    };
    this.errores = {};
  }

  guardarEdicion() {
    if (!this.clienteEditandoId) return;

    this.clientService.actualizarCliente(this.clienteEditandoId, this.clienteEditando)
      .subscribe({
        next: () => {
          this.mostrarMensaje('Cliente actualizado correctamente ✅', 'success');
          this.cerrarModalEditar();
          this.clientService.listarClientes(this.nombreBusqueda).subscribe(data => {
            this.clientes = [...data];
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.log("ERROR:", error);
          if (error.error?.mensaje) {
            this.mostrarMensaje(error.error.mensaje, 'error');
          } else {
            this.mostrarMensaje('Error al actualizar ❌', 'error');
          }
        }
      });
  }

  verHistorial(idCliente: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/historial/cliente', idCliente]);
  }
}