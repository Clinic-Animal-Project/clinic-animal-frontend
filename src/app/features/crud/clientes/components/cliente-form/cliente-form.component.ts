import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CreateClienteDto, UpdateClienteDto } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  host: { class: 'block' },
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteForm!: FormGroup;
  isEditMode = signal(false);
  clienteId: number | null = null;
  loading = signal(false);
  submitting = signal(false);

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.clienteId = Number(id);
      this.cargarCliente();
    }
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['']
    });
  }

  cargarCliente(): void {
    if (!this.clienteId) return;

    this.loading.set(true);

    this.clienteService.getClienteById(this.clienteId).subscribe({
      next: (response) => {
        this.clienteForm.patchValue(response);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.loading.set(false);
        this.volver();
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    if (this.isEditMode() && this.clienteId) {
      this.actualizarCliente();
    } else {
      this.crearCliente();
    }
  }

  crearCliente(): void {
    const clienteData: CreateClienteDto = this.clienteForm.value;

    this.clienteService.createCliente(clienteData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Cliente creado exitosamente');
          const nuevoId = (response.data as any)?.id ?? null;
          this.router.navigate(['/mantenimiento/clientes'], {
            state: { clienteNuevoId: nuevoId }
          });
        }
        this.submitting.set(false);
      },
      error: () => {
        this.notificationService.error('Error al crear cliente');
        this.submitting.set(false);
      }
    });
  }

  actualizarCliente(): void {
    if (!this.clienteId) return;

    const clienteData: UpdateClienteDto = {
      ...this.clienteForm.value,
      id: this.clienteId
    };

    this.clienteService.updateCliente(clienteData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Cliente actualizado exitosamente');
          this.volver();
        }
        this.submitting.set(false);
      },
      error: () => {
        this.notificationService.error('Error al actualizar cliente');
        this.submitting.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/mantenimiento/clientes']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clienteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clienteForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (field?.hasError('pattern')) {
      if (fieldName === 'dni') {
        return 'El DNI debe tener 8 dígitos';
      }
      if (fieldName === 'telefono') {
        return 'El teléfono debe tener 9 dígitos';
      }
    }

    if (field?.hasError('email')) {
      return 'Email inválido';
    }

    return '';
  }
}
