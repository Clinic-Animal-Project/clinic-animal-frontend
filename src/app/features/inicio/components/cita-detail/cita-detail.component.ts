import { ChangeDetectionStrategy, Component, computed, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { CitasResponse, EstadoCita } from 'src/app/features/citas/model/citas.model';
import { CitasService } from 'src/app/features/citas/service/citas.service';
import { PersonalResponse } from 'src/app/features/crud/personal/model/personal.model';
import { PersonalService } from 'src/app/features/crud/personal/service/personal.service';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';

@Component({
  selector: 'app-cita-detail.component',
  imports: [FormsModule,DateFormatPipe],
  templateUrl: './cita-detail.component.html',
})
export class CitaDetailComponent { 

  private citasService = inject(CitasService);
  private personalService = inject(PersonalService);

  cita = signal<CitasResponse | null>(null);
  veterinarios = signal<PersonalResponse[]>([]); // Lista de médicos
  vetSeleccionado = signal<number | null>(null); // ID del médico elegido en el select

  // Angular mapeará el :id de la ruta a esta propiedad
  @Input() id!: string; 

  // Definimos el orden lógico de los estados para Clinicanimal
  private flujoEstados: Record<string, { etiqueta: EstadoCita, siguiente: EstadoCita }> = {
    'PROGRAMADA': { etiqueta: EstadoCita.PROGRAMADA, siguiente: EstadoCita.EN_COLA },
    'EN_COLA': { etiqueta: EstadoCita.EN_COLA, siguiente: EstadoCita.EN_PROGRESO },
    'EN_PROGRESO': { etiqueta: EstadoCita.EN_PROGRESO, siguiente: EstadoCita.TERMINADA },
    'TERMINADA': { etiqueta: EstadoCita.TERMINADA, siguiente: EstadoCita.PAGADA },
    'PAGADA': { etiqueta: EstadoCita.PAGADA, siguiente: EstadoCita.PAGADA }
  };
  mostrarConfirmacion = signal(false);
  // Computado para obtener la info del botón dinámicamente
  proximoPaso = computed(() => {
    const estadoActual = this.cita()?.estado;
    const paso = estadoActual ? this.flujoEstados[estadoActual] : null;

    if (paso?.siguiente === EstadoCita.PAGADA) return null;
  
  return paso;
  });
  abrirConfirmacion() {
    this.mostrarConfirmacion.set(true);
  }

  confirmarCambio() {
    this.mostrarConfirmacion.set(false);
    this.cambiarEstado(); // Ejecuta la lógica que ya tenías
  }

  ngOnInit(): void {
    if (this.id) {
      
      this.citasService.obtenerPorId(Number(this.id)).pipe(

        switchMap(cita => {
          this.cita.set(cita);
          // Si la cita está PROGRAMADA, cargamos los veterinarios disponibles para ese área
          if (cita.estado === EstadoCita.PROGRAMADA) {
            //este return se usa en el subscribe para obtener la lista de vets filtrada por área, si no es PROGRAMADA se devuelve un array vacío para evitar errores
            return this.personalService.listarPersonal();
          } else {
            return [];
          }
        }
      )
      ).subscribe({
      next: (vets) => {
        // Aquí ya es seguro filtrar porque this.cita() tiene datos
        const areaId = this.cita()?.area?.id;
        const listaFiltrada = vets.filter(v => v.idArea === areaId);
        
        console.log("Vets filtrados por área " + areaId + ":", listaFiltrada);
        this.veterinarios.set(listaFiltrada);
      },
      error: (err) => console.error('Error en el flujo de datos:', err)
    });
    }
  }

  obtenerDetalleCita() {
    // Usamos el ID recibido para consultar al Backend de Java
    this.citasService.obtenerPorId(Number(this.id)).subscribe({
      next: (data) =>{ this.cita.set(data); console.log('Detalle de cita:', data); },
      error: (err) => console.error('Error al cargar detalle', err)
    });
  }

  cambiarEstado() {
    const siguiente = this.proximoPaso()?.siguiente;
    if (!siguiente) return;

    // Llamada a APIs distintas según el estado (Buenas prácticas de Backend)
    switch (siguiente) {
      case EstadoCita.EN_COLA:
        this.cambiarAEnCola();
        break;
      case EstadoCita.EN_PROGRESO:
        this.citasService.cambiarEstadoCitaEnProgreso(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
      case EstadoCita.TERMINADA:
        this.citasService.cambiarEstadoCitaEnTerminada(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
      case EstadoCita.PAGADA:
        this.citasService.cambiarEstadoCitaEnPagada(Number(this.id)).subscribe(() => this.obtenerDetalleCita());
        break;
    }
  }

  cargarVeterinarios() {
    this.personalService.listarPersonal().subscribe(data => {
      console.log("vets todo:", data)
      // Filtramos para que solo aparezcan los del área de la cita
      const listaFiltrada = data.filter((v: PersonalResponse) => v.idArea === this.cita()?.area?.id);
      console.log("vets filtrados:", listaFiltrada)
      this.veterinarios.set(listaFiltrada);
    });
  }

  cambiarAEnCola() {
    const idVet = this.vetSeleccionado();
    if (!idVet) {
      alert('Por favor, selecciona un veterinario para pasar a cola.');
      return;
    }
    console.log("idVet",{idVet});
    this.citasService.cambiarEstadoCitaEncola(Number(this.id), idVet).subscribe({
      next: () => {
        this.obtenerDetalleCita(); // Refrescamos para ver el nuevo estado
      },
      error: (err) => alert('Error al procesar el cambio')
    });
  }
}
