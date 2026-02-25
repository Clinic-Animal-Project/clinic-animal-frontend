import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../features/clientes/service/client-service';
import { Client } from '../../features/clientes/model/client-model';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';


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

  clientes: Client[] = [];
clienteId!: number; // variable enlazada al input
clienteSeleccionado: Client | null = null;
mostrarModal = false;
ngOnInit(): void {
  this.clientService.listarClientes().subscribe(data => {
    console.log("ARRAY FINAL 👉", data);

    this.clientes = [...data];
      this.cdr.detectChanges();
  });
}
  constructor() {
  console.log("🔥 COMPONENTE CREADO");
}

ngOnDestroy() {
  console.log("💀 COMPONENTE DESTRUIDO");
}
buscarClientePorId(id: number) {
  this.clientService.buscarClientes(id).subscribe({
    next: (cliente) => {
      if (cliente) {
        console.log("Cliente encontrado 👉", cliente);
        // Opcional: reemplazar la lista completa o mostrar solo el cliente
        this.clientes = [cliente];
        this.cdr.detectChanges();
      } else {
        console.log("No se encontró el cliente con ID:", id);
      }
    },
    error: (err) => console.error("Error al buscar cliente:", err)
  });
}

abrirModal(cliente: Client) {
  this.clienteSeleccionado = cliente;
  this.mostrarModal = true;
}

cerrarModal() {
  this.mostrarModal = false;
  this.clienteSeleccionado = null;
}
}