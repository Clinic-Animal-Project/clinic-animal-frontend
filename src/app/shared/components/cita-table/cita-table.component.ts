import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasResponse, EstadoCita } from '../../../features/citas/model/citas.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-cita-table',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  template: `
    <div class="bg-white shadow-2xl rounded-3xl border border-[var(--color-dark-100)] overflow-x-auto animate-in fade-in duration-500">
  
  @if (citas.length === 0) {
    <div class="text-center py-16 text-[var(--color-dark-400)]">
      <div class="text-6xl mb-4 text-slate-300">📅</div>
      <p class="text-xl font-black uppercase tracking-tight text-slate-400 italic">No hay registros</p>
      <p class="text-xs mt-2 font-medium">{{ emptyMessage }}</p>
    </div>
  } @else {
    <table class="min-w-full text-sm text-left border-collapse">
      <thead class="bg-[var(--color-primary-600)] text-white uppercase tracking-widest text-[10px] font-black">
        <tr>
          <th class="px-6 py-5">ID</th>
          <th class="px-6 py-5">Fecha y Hora</th>
          @if (showCliente) { <th class="px-6 py-5">Cliente</th> }
          @if (showMascota) { <th class="px-6 py-5">Mascota</th> }
          <th class="px-6 py-5">Área</th>
          <th class="px-6 py-5 text-center">Estado</th>
          <th class="px-6 py-5 text-center">Total</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-100">
        @for (cita of citas; track cita.id) {
          <tr class="hover:bg-[var(--color-primary-50)] transition-colors group">
            <td class="px-6 py-4 font-black text-dark-700">#{{ cita.id }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-dark-700">{{ cita.fechaHora | dateFormat:'date' }}</span>
                <span class="text-[10px] text-dark-400 uppercase font-black">{{ cita.fechaHora | dateFormat:'time' }}</span>
              </div>
            </td>
            @if (showCliente) {
              <td class="px-6 py-4">
                <p class="font-bold text-dark-700 leading-none">{{ cita.cliente.nombre }}</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">{{ cita.cliente.dni }}</p>
              </td>
            }
            @if (showMascota) {
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-black uppercase">
                  🐾 {{ cita.mascota.nombre }}
                </span>
              </td>
            }
            <td class="px-6 py-4 text-xs font-bold text-dark-400 uppercase">{{ cita.area.nomArea }}</td>
            <td class="px-6 py-4 text-center">
              <span [ngClass]="getEstadoClass(cita.estado)"
                    class="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border">
                {{ getEstadoLabel(cita.estado) }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="font-black text-primary-600 text-base">S/ {{ calcularTotal(cita) }}</span>
            </td>
          </tr>
        }
      </tbody>
    </table>
  }
</div>
  `,
  styles: []
})
export class CitaTableComponent {
  @Input() citas: CitasResponse[] = [];
  @Input() showCliente: boolean = true;
  @Input() showMascota: boolean = true;
  @Input() emptyMessage: string = 'Aún no hay citas registradas';

  calcularTotal(cita: CitasResponse): string {
    const total = cita.servicios.reduce((sum, s) => sum + s.subTotal, 0);
    return total.toFixed(2);
  }

  getEstadoClass(estado: EstadoCita): string {
    const classes: Record<EstadoCita, string> = {
      [EstadoCita.PROGRAMADA]: 'bg-blue-100 text-blue-700',
      [EstadoCita.EN_COLA]: 'bg-yellow-100 text-yellow-700',
      [EstadoCita.EN_PROGRESO]: 'bg-purple-100 text-purple-700',
      [EstadoCita.TERMINADA]: 'bg-green-100 text-green-700',
      [EstadoCita.PAGADA]: 'bg-emerald-100 text-emerald-700',
      [EstadoCita.CANCELADO]: 'bg-red-100 text-red-700'
    };
    return classes[estado] || 'bg-gray-100 text-gray-700';
  }

  getEstadoLabel(estado: EstadoCita): string {
    const labels: Record<EstadoCita, string> = {
      [EstadoCita.PROGRAMADA]: '📅 Programada',
      [EstadoCita.EN_COLA]: '⏳ En Cola',
      [EstadoCita.EN_PROGRESO]: '🔄 En Progreso',
      [EstadoCita.TERMINADA]: '✅ Terminada',
      [EstadoCita.PAGADA]: '💰 Pagada',
      [EstadoCita.CANCELADO]: '❌ Cancelada'
    };
    return labels[estado] || estado;
  }
}
