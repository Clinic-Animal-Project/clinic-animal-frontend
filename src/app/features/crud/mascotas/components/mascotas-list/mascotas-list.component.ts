import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MascotasService } from '../../services/mascotas.service';
import { Mascota } from '../../model/mascotas.model';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-mascotas-list',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  templateUrl: './mascotas-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotasListComponent implements OnInit {

  private mascotasService = inject(MascotasService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  mascotas = signal<Mascota[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading.set(true);
    this.mascotasService.getMascotas().subscribe({
      next: (response: any) => {
        const data = response.data ? response.data : response;
        
        if (Array.isArray(data)) {
          
          this.mascotas.set(data);
        } else {
          this.mascotas.set([]);
        }
        
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarMascota(mascota: Mascota): void {
    if (confirm(`¿Estás seguro de eliminar a ${mascota.nombre}?`)) {
      
      const idLimpio = Number(mascota.id.toString().split(':')[0]);

      this.mascotasService.deleteMascota(idLimpio).subscribe({
        next: () => {
          this.notificationService.success('Mascota eliminada correctamente');
          this.cargarMascotas(); 
        },
        error: () => {
          this.notificationService.success('Registro actualizado correctamente');
          this.cargarMascotas();
        }
      });
    }
  }

  editarMascota(mascota: Mascota): void {
   
    const idLimpio = Number(mascota.id.toString().split(':')[0]);
    this.router.navigate(['/mantenimiento/mascotas/editar', idLimpio]);
  }

  verDetalle(mascota: Mascota): void {
    const idLimpio = Number(mascota.id.toString().split(':')[0]);
    this.router.navigate(['/mantenimiento/mascotas', idLimpio]);
  }

  nuevaMascota(): void {
    this.router.navigate(['/mantenimiento/mascotas/crear']);
  }
}