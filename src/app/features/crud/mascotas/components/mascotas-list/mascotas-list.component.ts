import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service';
import { Mascota } from '../../model/mascotas.model';

@Component({
  selector: 'app-mascotas-list',
  standalone: true,
  imports: [],
  host: { class: 'block' },
  templateUrl: './mascotas-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotasListComponent implements OnInit {

  private mascotasService = inject(MascotasService);
  private router = inject(Router);

  mascotas = signal<Mascota[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.cargarMascotas();
  }
cargarMascotas(): void {
  this.loading.set(true);

  this.mascotasService.getMascotas().subscribe({
    next: (response: any) => {
      this.mascotas.set(response.data);
      this.loading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
    }
  });
}

  verDetalle(mascota: Mascota): void {
    this.router.navigate(['/mantenimiento/mascotas', mascota.id]);
  }

  editarMascota(mascota: Mascota): void {
    this.router.navigate(['/mantenimiento/mascotas/editar', mascota.id]);
  }

  nuevaMascota(): void {
    this.router.navigate(['/mantenimiento/mascotas/crear']);
  }
}
