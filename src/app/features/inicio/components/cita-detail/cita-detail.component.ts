import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { CitasResponse } from 'src/app/features/citas/model/citas.model';
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

}
