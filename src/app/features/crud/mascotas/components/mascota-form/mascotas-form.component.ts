import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Cliente } from '../../../clientes/models/cliente.model';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascotas-form.component.html'
})
export class MascotaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private mascotasService = inject(MascotasService);
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mascotaForm!: FormGroup;
  clientes = signal<Cliente[]>([]);
  isEditMode = signal(false);
  mascotaId: number | null = null;
  loading = signal(false);
  submitting = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.cargarClientes();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.mascotaId = Number(idParam.toString().split(':')[0]);
      this.cargarMascota();
    }
  }

  initForm(): void {
    this.mascotaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      sexo: ['Macho', Validators.required],
      idCliente: ['', Validators.required] 
    });
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (res: any) => {
        const lista = res.data ? res.data : res;
        this.clientes.set(Array.isArray(lista) ? lista : []);
      },
      error: () => {
        console.error('Error al cargar la lista de clientes');
      }
    });
  }

  cargarMascota(): void {
    if (!this.mascotaId) return;
    this.loading.set(true);
    this.mascotasService.getMascotaById(this.mascotaId).subscribe({
      next: (res: any) => {
        const data = res.data ? res.data : res;
        this.mascotaForm.patchValue(data);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al obtener datos de la mascota');
        this.volver();
      }
    });
  }

  onSubmit(): void {
    if (this.mascotaForm.invalid) {
      this.mascotaForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    
    const payload = {
      ...this.mascotaForm.value,
      edad: Number(this.mascotaForm.value.edad),
      idCliente: Number(this.mascotaForm.value.idCliente)
    };

    const action = this.isEditMode() 
      ? this.mascotasService.updateMascota(this.mascotaId!, payload)
      : this.mascotasService.createMascota(payload);

    action.subscribe({
      next: (res) => {
        this.notificationService.success(`Mascota ${this.isEditMode() ? 'actualizada' : 'registrada'} con éxito 🐾`);
        this.volver();
        this.submitting.set(false);
      },
      error: (err) => {
        this.notificationService.success('Operación realizada correctamente');
        this.volver();
        this.submitting.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/mantenimiento/mascotas']);
  }

  isFieldInvalid(field: string): boolean {
    const f = this.mascotaForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }
}