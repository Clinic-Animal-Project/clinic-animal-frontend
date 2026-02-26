import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../features/clientes/service/client-service';
import { Client } from '../../features/clientes/model/client-model';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../mascotas/models/mascotas.models';



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
  clientes: Client[] = [];
  mascotas: Mascota [] = [];
clienteId!: number; // variable enlazada al input
clienteSeleccionado: Client | null = null;
mostrarModal = false;
ngOnInit(): void {
  this.buscarPorNombre(); // carga todo al abrir

}
  constructor() {
  console.log("🔥 COMPONENTE CREADO");
}

ngOnDestroy() {
  console.log("💀 COMPONENTE DESTRUIDO");
  sessionStorage.removeItem('clienteSeleccionado');
  sessionStorage.removeItem('mascotasDelCliente');
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
  const existeSeleccion = sessionStorage.getItem('mascotaSeleccionada');

  if (existeSeleccion) {
    alert("⚠️ Ya hay una mascota seleccionada. Debes quitarla primero.");
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

  sessionStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
  sessionStorage.setItem('clienteSeleccionado', JSON.stringify(clienteData));

  console.log("Mascota guardada 👉", mascotaData);
}
}