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
mascotaPendiente: Mascota | null = null;
clientePendiente: ClienteSeleccion | null = null;modalSobreescribir = false; 


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

    console.log("✅ Selección sobreescrita 👉", mascotaData);

    this.cerrarModal();
  }

}
