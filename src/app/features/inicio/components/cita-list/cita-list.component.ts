import {  Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CitasResponse, EstadoCita } from 'src/app/features/citas/model/citas.model';
import { CitasService } from 'src/app/features/citas/service/citas.service';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';

@Component({
  selector: 'app-cita-list.component',
  imports: [CommonModule,RouterModule,LoaderComponent],
  templateUrl: './cita-list.component.html',
})
export class CitaListComponent { 

   private citasService = inject(CitasService);

  // Signals para el estado global de la página
  estadosCita = Object.values(EstadoCita);
  estadoSeleccionado = signal<EstadoCita >(EstadoCita.PROGRAMADA); // Estado seleccionado para filtrar
  citas = signal<CitasResponse[]>([]); // Lista que devuelve el backend
  cargando = signal<boolean>(false);

  constructor() {
    // Cada vez que cambie el estadoSeleccionado, pedimos datos al Backend
    effect(() => {
      this.cargarCitas();
    });
  }

  cargarCitas() {
    this.cargando.set(true);
    const estado = this.estadoSeleccionado();
    
    // Llamamos al backend pasando el estado como filtro
    this.citasService.listarPorEstados(estado).subscribe({
      next: (data) => {
        this.citas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al traer citas', err);
        this.cargando.set(false);
      }
    });
  }

  filtrarPorEstado(estado: EstadoCita) {
    // Si hace clic en el que ya está, deselecciona para traer todas
    // if (this.estadoSeleccionado() === estado) {
    //   this.estadoSeleccionado.set(EstadoCita.PROGRAMADA); // O podrías usar null para no filtrar
    // } else {
    //   this.estadoSeleccionado.set(estado);
    // }
    this.estadoSeleccionado.set(estado);
  }

  // Método para el contador de las tarjetas (puedes traer estos totales en otro endpoint)
  contarCitasPorEstado(estado: string): number {
    return this.citas().filter(c => c.estado === estado).length;
  }


}
