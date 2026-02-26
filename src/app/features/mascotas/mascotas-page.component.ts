import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../mascotas/models/mascotas.models';
import { MascotaService } from './services/mascotas.services';

@Component({
  selector: 'app-mascotas-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- agregar FormsModule
  templateUrl: './mascotas-page.html'
})
export class MascotasPageComponent {
  mascotas: Mascota [] = [];
private cdr = inject(ChangeDetectorRef);
  private mascotaService = inject(MascotaService);
  private zone = inject(NgZone);
nombreBusqueda: string = '';

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
  this.mascotaService.listarMascotas(this.nombreBusqueda).subscribe(data => {
    console.log("Busqueda nombre 👉", data);
    this.mascotas = [...data];
    this.cdr.detectChanges();
  });
}
guardarSeleccion(mascota: Mascota) {
  if (!mascota) return;
  const existeSeleccion = sessionStorage.getItem('mascotaSeleccionada');

  if (existeSeleccion) {
    alert("⚠️ Ya hay una mascota seleccionada. Debes quitarla primero.");
    return;
  }

  const mascotaData = {
    id: mascota.id,
    nombre: mascota.nombre
  };
  sessionStorage.setItem('mascotaSeleccionada', JSON.stringify(mascotaData));
  console.log("Mascota guardada 👉", mascotaData);
}
}
