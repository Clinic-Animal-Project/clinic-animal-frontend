import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CitasService } from '../../citas/service/citas.service';
import { MascotaService } from '../../mascotas/services/mascotas.services';
import { CitasResponse } from '../../citas/model/citas.model';
import { Mascota } from '../../mascotas/models/mascotas.models';
import { CitaTableComponent } from '../../../shared/components/cita-table/cita-table.component';

@Component({
  selector: 'app-historial-mascota',
  standalone: true,
  imports: [CommonModule, CitaTableComponent],
  template: `
    <div class="p-11 bg-[var(--color-dark-50)] min-h-screen">
      
      <div class="flex items-center gap-4 mb-8">
        <button (click)="volver()"
                class="flex items-center gap-2 px-6 py-3 
                       bg-white border-2 border-[var(--color-primary-600)]
                       text-[var(--color-primary-600)] rounded-2xl
                       hover:bg-[var(--color-primary-50)] transition-all font-black uppercase text-xs tracking-widest shadow-sm active:scale-95">
          <span class="text-xl">←</span>
          Volver
        </button>
        
        <div class="flex-1">
          <h1 class="text-4xl font-extrabold text-[var(--color-dark-700)] tracking-tight">
            Historial Clínico
          </h1>
          
          @if (mascota()) {
            <div class="mt-3 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="bg-[var(--color-primary-100)] px-4 py-2 rounded-xl border border-[var(--color-primary-200)] shadow-sm">
                <span class="text-[var(--color-primary-700)] font-black uppercase text-[10px] tracking-widest">Paciente:</span>
                <span class="text-[var(--color-dark-700)] font-black ml-2 uppercase">🐾 {{ mascota()?.nombre }}</span>
              </div>
              <div class="bg-white px-4 py-2 rounded-xl border border-[var(--color-dark-200)] shadow-sm">
                <span class="text-[var(--color-dark-500)] text-xs font-bold uppercase tracking-tight">
                  {{ mascota()?.especie }} • {{ mascota()?.raza }}
                </span>
              </div>
              <div class="bg-white px-4 py-2 rounded-xl border border-[var(--color-dark-200)] shadow-sm">
                <span class="text-[var(--color-dark-500)] text-xs font-bold uppercase tracking-tight">
                  {{ mascota()?.edad }} año(s) | {{ mascota()?.sexo }}
                </span>
              </div>
              <div class="bg-[var(--color-primary-600)] px-4 py-2 rounded-xl shadow-lg shadow-primary-600/20">
                <span class="text-white text-xs font-black uppercase tracking-widest">
                  {{ citas().length }} Atenciones
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (cargando()) {
        <div class="flex flex-col justify-center items-center py-40 gap-4 animate-in fade-in">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary-600)]"></div>
          <p class="text-[var(--color-primary-600)] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Sincronizando registros médicos...
          </p>
        </div>
      } @else {
        <div class="animate-in fade-in zoom-in-95 duration-500">
          <app-cita-table 
            [citas]="citas()"
            [showCliente]="true"
            [showMascota]="false"
            [emptyMessage]="'Esta mascota aún no tiene historial de citas en la clínica'">
          </app-cita-table>
        </div>
      }

    </div>
  `
})
export class HistorialMascotaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private citasService = inject(CitasService);
  private mascotaService = inject(MascotaService);

  // Pasamos todo a Signals para máxima reactividad
  citas = signal<CitasResponse[]>([]);
  mascota = signal<Mascota | null>(null);
  cargando = signal(true);
  idMascota: number = 0;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idMascota = Number(idParam);
    
    if (!idParam || isNaN(this.idMascota)) {
      this.router.navigate(['/mascotas']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // Sincronizamos ambas llamadas de Backend (Java)
    forkJoin({
      mascota: this.mascotaService.obtenerMascotaPorId(this.idMascota),
      citas: this.citasService.listadoPorMascota(this.idMascota)
    }).subscribe({
      next: (res) => {
        // res.mascota.data porque tu API de Java parece devolver un wrapper
        this.mascota.set(res.mascota.data ?? null);
        this.citas.set(res.citas);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al sincronizar historial:', err);
        this.cargando.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/mascotas']);
  }
}