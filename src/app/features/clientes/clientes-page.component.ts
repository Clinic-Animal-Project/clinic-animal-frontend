import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../features/clientes/service/client-service';
import { Client } from '../../features/clientes/model/client-model';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../mascotas/models/mascotas.models';
import { ClienteRequestDto } from '../../features/clientes/model/client-model';


@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- agregar FormsModule
  templateUrl: './clientes-page.html'
})

export class ClientesPageComponent implements OnInit {

private cdr = inject(ChangeDetectorRef);
  private clientService = inject(ClientService);
  private zone = inject(NgZone);
nombreBusqueda: string = '';
toastVisible = false;  // Controla la animación
toastEnDOM = false; // controla si el div está en el DOM

  nuevoCliente: ClienteRequestDto = {
    nombre: '',
    apellido:'',
    dni: '',
    telefono: '',
    direccion: '',
    email: ''
  };
  clientes: Client[] = [];
  mascotas: Mascota [] = [];
clienteId!: number; // variable enlazada al input
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
ngOnInit(): void {
  this.buscarPorNombre(); // carga todo al abrir

}
  constructor() {
  console.log("🔥 COMPONENTE CREADO");
}

ngOnDestroy() {
  console.log("💀 COMPONENTE DESTRUIDO");
}

abrirModal(cliente: Client) {
  this.clienteSeleccionado = cliente;
  this.mostrarModal = true;

  // 🔥 cargar mascotas automáticamente
  this.buscarMascotaPorIdCliente(cliente.id);
}

cerrarModal() {
  this.mostrarModal = false;
  this.clienteSeleccionado = null;
    this.mascotaPendiente = null;
  this.clientePendiente = null;
  this.modalSobreescribir = false; 
  this.modalCrear = false; // Reiniciar estado del modal de sobreescritura
  this.mascotas = []; // Limpiar mascotas al cerrar el modal
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
    // Aquí podrías asignar las mascotas a una propiedad del cliente o manejarlas como necesites
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

  const mascotaData = {
    id: mascota.id,
    nombre: mascota.nombre
  };

  const clienteData = {
    id: cliente.id,
    nombre: cliente.nombre
  };

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

  const mascotaData = {
    id: this.mascotaPendiente.id,
    nombre: this.mascotaPendiente.nombre
  };

  const clienteData = {
    id: this.clientePendiente.id,
    nombre: this.clientePendiente.nombre
  };

  // 🔥 reemplazar storage
  localStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
  localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));
this.mostrarMensaje('Mascota y cliente guardados correctamente 🐾', 'success');
  console.log("✅ Selección sobreescrita 👉", mascotaData);

  // limpiar temporales y cerrar modal
  this.mascotaPendiente = null;
  this.clientePendiente = null;
  this.modalSobreescribir = false;

}

mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
  this.mensajeToast = mensaje;
  this.tipoToast = tipo;

  // Mostrar el toast
  this.mostrarToast = true;
  // asegurar que el DOM se actualice antes de activar la clase de entrada
  this.cdr.detectChanges();

  // Activar animación fade-in (usar un frame corto para garantizar que
  // el navegador registre el estado inicial antes de la transición)
  setTimeout(() => {
    this.toastVisible = true;
    this.cdr.detectChanges();
  }, 40);

  // Después de 3s, iniciar fade-out
  setTimeout(() => {
    this.toastVisible = false;
    this.cdr.detectChanges();

    // Después de la transición (500ms), ocultar del DOM
    setTimeout(() => this.mostrarToast = false, 500);
  }, 3000);
}

registrar() {
  this.clientService.registrarCliente(this.nuevoCliente)
    .subscribe({
      next: () => {
        this.mostrarMensaje('Cliente registrado correctamente ✅', 'success');
        this.limpiarFormulario();
        this.buscarPorNombre(); // refrescar lista
            this.cerrarModal(); 
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

limpiarFormulario() {
  this.nuevoCliente = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: '',
    email: ''
  };

  this.errores = {}; // limpia errores del backend también
}

modalCrearCliente(){
  this.modalCrear = true;
}
}