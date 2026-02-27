
import { ChangeDetectionStrategy, Component, computed, inject, Input, signal } from '@angular/core';
import { CitasResponse, EstadoCita } from 'src/app/features/citas/model/citas.model';
import { CitasService } from 'src/app/features/citas/service/citas.service';

@Component({
  selector: 'app-cita-detail.component',
  imports: [],
  templateUrl: './cita-detail.component.html',
})
export class CitaDetailComponent { 

  private citasService = inject(CitasService);

  // Angular mapeará el :id de la ruta a esta propiedad
  @Input() id!: string; 

  cita = signal<CitasResponse | null>(null);


  // Definimos el orden lógico de los estados para Clinicanimal
  private flujoEstados: Record<string, { etiqueta: EstadoCita, siguiente: EstadoCita }> = {
    'PROGRAMADA': { etiqueta: EstadoCita.PROGRAMADA, siguiente: EstadoCita.EN_COLA },
    'EN_COLA': { etiqueta: EstadoCita.EN_COLA, siguiente: EstadoCita.EN_PROGRESO },
    'EN_PROGRESO': { etiqueta: EstadoCita.EN_PROGRESO, siguiente: EstadoCita.FINALIZADA },
    'FINALIZADA': { etiqueta: EstadoCita.FINALIZADA, siguiente: EstadoCita.PAGADA },
    'PAGADA': { etiqueta: EstadoCita.PAGADA, siguiente: EstadoCita.PAGADA }
  };
  // Computado para obtener la info del botón dinámicamente
  proximoPaso = computed(() => {
    const estadoActual = this.cita()?.estado;
    return estadoActual ? this.flujoEstados[estadoActual] : null;
  });

  ngOnInit(): void {
    if (this.id) {
      this.obtenerDetalleCita();
    }
  }

  obtenerDetalleCita() {
    // Usamos el ID recibido para consultar al Backend de Java
    this.citasService.obtenerPorId(Number(this.id)).subscribe({
      next: (data) => this.cita.set(data),
      error: (err) => console.error('Error al cargar detalle', err)
    });
  }

  cambiarEstado() {
    const siguiente = this.proximoPaso()?.siguiente;
    if (!siguiente) return;

    // Llamada a APIs distintas según el estado (Buenas prácticas de Backend)
    switch (siguiente) {
      case 'EN_COLA':
        // this.citasService.cambiarEstadoCitaEncola(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
      case 'FINALIZADA':
        this.citasService.cambiarEstadoCitaEnTerminada(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
      case 'PAGADA':
        this.citasService.cambiarEstadoCitaEnPagada(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
    }
  }
}
