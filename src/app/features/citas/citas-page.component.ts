import { Component,inject,OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AreasService } from '../crud/areas/service/areas.service';
import { AreasResponse } from '../crud/areas/model/areas.model';
import { PersonalService } from '../crud/personal/service/personal.service';
import { PersonalResponse } from '../crud/personal/model/personal.model';
import { ServicioService } from '../crud/servicios/service/servicio.service';
import { ServicioResponse } from '../crud/servicios/model/servicio.model';
import { EstadoCita } from './model/citas.model';

interface ServicioAgregado {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  imports: [FormsModule],
  selector: 'app-citas-page',
  templateUrl: './citas-page.html'
})
export class CitasPageComponent {

  ngOnInit(): void {
  this.listarAreas(); // Llama al método listarAreas al inicializar el componente
  this.listarPersonal(); // Llama al método listarPersonal al inicializar el componente
  this.listarServicios(); // Llama al método listarServicios al inicializar el componente
}

  areasServicio = inject(AreasService);
  personalService = inject(PersonalService);
  servicioService = inject(ServicioService);

  areaslist = signal<AreasResponse[]>([]);
  personalist = signal<PersonalResponse[]>([]);
  servicioslist = signal<ServicioResponse[]>([]);

  estadosCita: EstadoCita[] = [EstadoCita.PROGRAMADA, EstadoCita.EN_COLA];

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



 
  serviciosBase = [
    { nombre: 'Consulta Médica', precio: 50 },
    { nombre: 'Vacunación', precio: 45 },
    { nombre: 'Profilaxis', precio: 200 }
  ];
  veterinarios = ['Dr. Paredes', 'Dra. Castro', 'Dr. Mamani'];
  estados = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'];

  // Formulario
  cita = {
    cliente: '',
    mascota: '',
    fecha: '',
    area: '',
    veterinario: '',
    estado: 'PENDIENTE'
  };

  serviciosSeleccionados: ServicioAgregado[] = [];
  servicioActual = { nombre: '', cantidad: 1 };



  agregarServicio() {
    const base = this.serviciosBase.find(s => s.nombre === this.servicioActual.nombre);
    if (base && this.servicioActual.cantidad > 0) {
      this.serviciosSeleccionados.push({
        id: Date.now(),
        nombre: base.nombre,
        precio: base.precio,
        cantidad: this.servicioActual.cantidad
      });
      // Reset temporal
      this.servicioActual = { nombre: '', cantidad: 1 };
    }
  }

  eliminarServicio(id: number) {
    this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== id);
  }

  get totalCita() {
    return this.serviciosSeleccionados.reduce((acc, s) => acc + (s.precio * s.cantidad), 0);
  }
}
