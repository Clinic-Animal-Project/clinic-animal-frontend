import { Component,effect,inject,OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AreasService } from '../crud/areas/service/areas.service';
import { AreasResponse } from '../crud/areas/model/areas.model';
import { PersonalService } from '../crud/personal/service/personal.service';
import { PersonalResponse } from '../crud/personal/model/personal.model';
import { ServicioService } from '../crud/servicios/service/servicio.service';
import { ServicioResponse } from '../crud/servicios/model/servicio.model';
import { CitaServicioRequestDto, EstadoCita, CitasRequest, CitasResponse } from './model/citas.model';
import { CitasService } from './service/citas.service';

interface ClienteSession {
  id: number;
  nombre: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-citas-page',
  templateUrl: './citas-page.html'
})
export class CitasPageComponent {

  constructor() {
    // Este efecto se ejecuta cada vez que cliente() cambia
    effect(() => {
      const datosCliente = this.cliente();
      const datosMascota = this.mascota();

      this.cita.update(actual => ({
        ...actual,
        idCliente: datosCliente?.id ?? actual.idCliente,
        idMascota: datosMascota?.id ?? actual.idMascota
      }));
      console.log('Cita actualizada automáticamente:', this.cita().idCliente, this.cita().idMascota);
    });
  }

  
  ngOnInit(): void {
  this.listarAreas(); // Llama al método listarAreas al inicializar el componente
  this.listarPersonal(); // Llama al método listarPersonal al inicializar el componente
  this.listarServicios(); // Llama al método listarServicios al inicializar el componente

  this.loadClienteAndMascota(); // Carga cliente y mascota desde sessionStorage al iniciar el componente
}

  areasServicio = inject(AreasService);
  personalService = inject(PersonalService);
  servicioService = inject(ServicioService);
  citaService = inject(CitasService);

  areaslist = signal<AreasResponse[]>([]);
  personalist = signal<PersonalResponse[]>([]);
  servicioslist = signal<ServicioResponse[]>([]);

  cliente = signal<ClienteSession | null>(null);
  mascota = signal<ClienteSession | null>(null);
  estadosCita: EstadoCita[] = [EstadoCita.PROGRAMADA, EstadoCita.EN_COLA];

   // Formulario
  cita = signal<CitasRequest>({
    idCliente: 0,
    idMascota: 0,
    fechaHora: '',
    idArea: 0,
    idVeterinario: null,
    estado: EstadoCita.PROGRAMADA,
    servicios: []
  });

  serviciosSeleccionados = signal<CitaServicioRequestDto[]>([]);
  servicioActual = { id: 0, cantidad: 1 };

  // En tu componente
  mostrarModal = signal(false);
  citaRegistrada = signal<CitasResponse | null>(null);

  registrarCita(cita: CitasRequest) {
    console.log("Registrando cita con datos:", cita);

    this.citaService.registrarCita(cita).subscribe({
      next: (response) => {
        console.log("Cita registrada con éxito:", response.data);
        this.citaRegistrada.set(response.data);
        this.mostrarModal.set(true);
      },
      error: (error) => {
        console.error("Error al registrar cita:", error.mensaje || error);
        alert("Error al registrar cita");
      }
    });
  }
  
  cerrarYRegresar() {
      this.mostrarModal.set(false);
      // Lógica para limpiar el formulario o navegar al inicio
      this.cita.set({
        idCliente: 0,
        idMascota: 0,
        fechaHora: '',
        idArea: 0,
        idVeterinario: null,
        estado: EstadoCita.PROGRAMADA,
        servicios: []
      });
      this.serviciosSeleccionados.set([]);

      // Limpiar cliente y mascota seleccionados
      this.cliente.set(null);
      this.mascota.set(null);
      localStorage.removeItem('clienteSeleccionado');
      localStorage.removeItem('mascotaSeleccionada');
  }
  loadClienteAndMascota() {
    // Simulación de carga de cliente y mascota
    localStorage.getItem('clienteSeleccionado') ? this.cliente.set(JSON.parse(localStorage.getItem('clienteSeleccionado')!)): null;
    localStorage.getItem('mascotaSeleccionada') ? this.mascota.set(JSON.parse(localStorage.getItem('mascotaSeleccionada')!)) : null;

  }

  listarAreas() {
    this.areasServicio.listarAreas().subscribe({
      next: (areas) => {
        console.log("Áreas obtenidas 👉", areas);
        this.areaslist.set(areas);
      },
      error: (err) => console.error("Error al listar áreas:", err)
    });
  }

  listarServicios() {
    this.servicioService.listarServicios().subscribe({
      next: (servicios) => {
        console.log("Servicios obtenidos 👉", servicios);
        this.servicioslist.set(servicios);
      },
      error: (err) => console.error("Error al listar servicios:", err)
    });
  }

  listarPersonal() {
    this.personalService.listarPersonal().subscribe({
      next: (personal) => {
        console.log("Personal obtenido 👉", personal);
        this.personalist.set(personal);
      },
      error: (err) => console.error("Error al listar personal:", err)
    });
  }

 


  agregarServicio() {
    const base = this.servicioslist().find(s => s.id == this.servicioActual.id);
    console.log("Servicio encontrado:", base?.id); // Debug para ver si lo encuentra
    console.log("ID buscado:", this.servicioActual.id);
    if (base && this.servicioActual.cantidad > 0) {

      this.serviciosSeleccionados.update(servicios => [...servicios, {
        idServicio: base.id,
        cantidad: this.servicioActual.cantidad,
        precioBase: base.precio
      }]);

      this.cita.update(actual => ({
        ...actual,
        servicios: this.serviciosSeleccionados()
      }));

      console.log("Servicios seleccionados:", this.serviciosSeleccionados());

      // Reset temporal
      this.servicioActual = { id: 0, cantidad: 1 };
    }
  }

  eliminarServicio(id: number) {
    this.serviciosSeleccionados.update(servicios => servicios.filter(s => s.idServicio !== id));
  }

  get totalCita() {
    return this.serviciosSeleccionados().reduce((acc, s) => acc + (s.precioBase * s.cantidad), 0);
  }

}
