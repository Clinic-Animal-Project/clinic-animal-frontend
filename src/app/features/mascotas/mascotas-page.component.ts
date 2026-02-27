import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../mascotas/models/mascotas.models';
import { MascotaService } from './services/mascotas.services';
import { ClientService } from '../clientes/service/client-service';
import { Client } from '../clientes/model/client-model';

type ClienteSeleccion = {
  id: number;
  nombre: string;
};

@Component({
  selector: 'app-mascotas-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- agregar FormsModule
  templateUrl: './mascotas-page.html'
})

export class MascotasPageComponent {
  mascotas: Mascota [] = [];
private cdr = inject(ChangeDetectorRef);
private clientService = inject(ClientService);
  private mascotaService = inject(MascotaService);
  private zone = inject(NgZone);
nombreBusqueda: string = '';
toastEnDOM = false; // controla si el div está en el DOM
mascotaPendiente: Mascota | null = null;
clientePendiente: ClienteSeleccion | null = null;modalSobreescribir = false; 
mostrarToast = false;
mensajeToast = '';
toastVisible = false;  // Controla la animación

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

buscarPorNombre() {
  console.log("🔎 Buscando mascotas con:", this.nombreBusqueda);

  this.mascotaService.listarMascotas(this.nombreBusqueda).subscribe(data => {

    console.log("🐶 Mascotas recibidas:", data);

    this.mascotas = [...data];

    this.mascotas.forEach(m => {
      console.log("👉 Mascota:", m);

      if (m.idCliente) {
        console.log("📡 Buscando cliente con ID:", m.idCliente);

        this.clientService.buscarClientePorId(m.idCliente).subscribe(client => {
          console.log("✅ Cliente recibido:", client);

          m.nombreCliente = client?.data?.nombre || '';
          console.log("🧩 Nombre asignado:", m.nombreCliente);

          this.cdr.detectChanges();
        });

      } else {
        console.warn("⚠️ Mascota sin idCliente:", m);
      }
    });

    this.cdr.detectChanges();
  });
}

guardarSeleccion(mascota: Mascota) {
  if (!mascota) return;

  const existeMascota = localStorage.getItem('mascotaSeleccionada');
  if (existeMascota) {
    // 👉 guardar temporalmente lo nuevo
    this.mascotaPendiente = mascota;

this.clientePendiente = {
  id: mascota.idCliente!,
  nombre: mascota.nombreCliente!
};

    this.abrirModalSobreescribir();
    return;
  }

  // 🐶 Mascota
  const mascotaData = {
    id: mascota.id,
    nombre: mascota.nombre
  };

  // 👤 Cliente (sale de la mascota)
  const clienteData = {
    id: mascota.idCliente,
    nombre: mascota.nombreCliente
  };

  localStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
  localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));
  this.mostrarMensaje('Mascota y cliente guardados correctamente 🐾', 'success');

  console.log("🐶 Mascota guardada 👉", mascotaData);
  console.log("👤 Cliente guardado 👉", clienteData);
}

abrirModalSobreescribir(){
  this.modalSobreescribir = true;
}

cerrarModal() {
  this.modalSobreescribir = false;
  this.mascotaPendiente = null;
  this.clientePendiente = null;
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

    localStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
    localStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));
    this.mostrarMensaje('Mascota y cliente guardados correctamente 🐾', 'success');

    console.log("✅ Selección sobreescrita 👉", mascotaData);

    this.cerrarModal();
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
}
