import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from '../../citas/service/citas.service';
import { ClientService } from '../../clientes/service/client-service';
import { CitasResponse } from '../../citas/model/citas.model';
import { Client } from '../../clientes/model/client-model';
import { CitaTableComponent } from '../../../shared/components/cita-table/cita-table.component';
import { forkJoin } from 'rxjs'; // Importante importar esto

@Component({
  selector: 'app-historial-cliente',
  standalone: true,
  imports: [CommonModule, CitaTableComponent],
  template: `
    <div class="p-11 bg-[var(--color-dark-50)] min-h-screen">
      
      <div class="flex items-center gap-4 mb-8">
        <button (click)="volver()"
                class="flex items-center gap-2 px-4 py-2 
                       bg-white border-2 border-[var(--color-primary-600)]
                       text-[var(--color-primary-600)] rounded-xl
                       hover:bg-[var(--color-primary-50)] transition font-semibold shadow-sm">
          <span class="text-xl">←</span>
          Volver
        </button>
        
        <div class="flex-1">
          <h1 class="text-4xl font-extrabold text-[var(--color-dark-700)] tracking-tight">
            Historial de Citas
          </h1>
          
          @if (cliente) {
            <div class="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="bg-[var(--color-primary-100)] px-4 py-2 rounded-xl border border-[var(--color-primary-200)]">
                <span class="text-[var(--color-primary-700)] font-semibold">
                  Cliente:
                </span>
                <span class="text-[var(--color-dark-700)] font-bold ml-2">
                  {{ cliente.nombre }} {{ cliente.apellido }}
                </span>
              </div>
              <div class="bg-white px-4 py-2 rounded-xl border border-[var(--color-dark-200)]">
                <span class="text-[var(--color-dark-500)] text-sm font-medium">
                  DNI: {{ cliente.dni }}
                </span>
              </div>
              <div class="bg-white px-4 py-2 rounded-xl border border-[var(--color-dark-200)]">
                <span class="text-[var(--color-primary-600)] font-black">
                  {{ citas().length }} cita(s) registrada(s)
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (cargando()) {
        <div class="flex flex-col justify-center items-center py-40 gap-4">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary-600)]"></div>
          <p class="text-[var(--color-primary-600)] font-black uppercase tracking-widest text-xs animate-pulse">
            Consultando historial médico...
          </p>
        </div>
      } @else {
        <div class="animate-in fade-in zoom-in-95 duration-500">
          <app-cita-table 
            [citas]="citas()"
            [showCliente]="false"
            [showMascota]="true"
            [emptyMessage]="'Este cliente aún no tiene citas registradas en la clínica'">
          </app-cita-table>
        </div>
      }

    </div>
  `,
  styles: []
})
export class HistorialClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private citasService = inject(CitasService);
  private clientService = inject(ClientService);

  citas = signal<CitasResponse[]>([]);
  cliente: Client | null = null;
  cargando = signal(true);
  idCliente: number = 0;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idCliente = Number(idParam);
    
    if (!idParam || isNaN(this.idCliente)) {
      this.router.navigate(['/clientes']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // Cargar cliente
    forkJoin({
    cliente: this.clientService.buscarClientePorId(this.idCliente),
    citas: this.citasService.listadoPorCliente(this.idCliente)
  }).subscribe({
    next: (resultado) => {
      // 1. Seteamos los datos
      this.cliente = resultado.cliente;
      this.citas.set(resultado.citas);
      
      // 2. Quitamos el loader solo cuando TODO está listo
      this.cargando.set(false);
      console.log("Datos cargados con éxito", resultado);
    },
    error: (err) => {
      console.error('Error en la carga masiva:', err);
      this.cargando.set(false); // También quitamos el loader en error para no bloquear la UI
    }
  });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }
}