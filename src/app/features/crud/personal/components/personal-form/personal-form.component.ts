import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonalService } from '../../service/personal.service';
import { EstadoPersonal, RegistrarUsuarioInputDTO, RolUsuario } from '../../model/personal.model';
import { AreasService } from '../../../areas/service/areas.service';
import { AreasResponse } from '../../../areas/model/areas.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-personal-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './personal-form.component.html'
})
export class PersonalFormComponent implements OnInit {
    personalForm!: FormGroup;

    personalService = inject(PersonalService);
    areasService = inject(AreasService);
    router = inject(Router);
    fb = inject(FormBuilder);
    http = inject(HttpClient);

    areas: AreasResponse[] = [];
    roles: any[] = [];
    estados = Object.values(EstadoPersonal);
    rolesUsuario = Object.values(RolUsuario);

    ngOnInit(): void {
        this.initForm();
        this.loadAreas();
        this.loadRoles();
    }

    initForm(): void {
        this.personalForm = this.fb.group({
            // Datos de acceso
            nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
            claveUsuario: ['', [Validators.required, Validators.minLength(6)]],
            correo: ['', [Validators.required, Validators.email]],
            dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            // Datos del personal
            nombrePersonal: ['', [Validators.required, Validators.maxLength(100)]],
            apellidoPersonal: ['', [Validators.required, Validators.maxLength(100)]],
            edad: ['', [Validators.required, Validators.min(18)]],
            telefono: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
            idRol: ['', Validators.required],
            idArea: ['', Validators.required],
            estadoPersonal: [EstadoPersonal.DISPONIBLE, Validators.required],
            // Rol de acceso al sistema
            rolUsuario: [RolUsuario.EMPLEADO, Validators.required]
        });
    }

    loadAreas(): void {
        this.areasService.listarAreas().subscribe({
            next: (data: AreasResponse[]) => {
                this.areas = data;
            },
            error: (err: any) => console.error('Error cargando areas', err)
        });
    }

    loadRoles(): void {
        this.http.get<any>(`${environment.apiUrl}/roles`).subscribe({
            next: (resp: any) => {
                this.roles = resp.data || resp;
            },
            error: (err: any) => console.error('Error cargando roles', err)
        });
    }

    onSubmit(): void {
        if (this.personalForm.valid) {
            const formValue = this.personalForm.value;
            const dto: RegistrarUsuarioInputDTO = {
                ...formValue,
                idRol: Number(formValue.idRol),
                idArea: Number(formValue.idArea),
                edad: Number(formValue.edad)
            };

            this.personalService.registrarPersonal(dto).subscribe({
                next: () => {
                    window.alert('Personal registrado correctamente');
                    this.router.navigate(['/mantenimiento/personal']);
                },
                error: (err: any) => {
                    console.error('Error registrando personal', err);
                    const msg = err?.error?.mensaje || err?.error?.message || 'No se pudo registrar el personal';
                    window.alert(msg);
                }
            });
        } else {
            this.personalForm.markAllAsTouched();
            window.alert('El formulario es inválido. Revisa los campos en rojo.');
        }
    }

    cancelar(): void {
        this.router.navigate(['/mantenimiento/personal']);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.personalForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}
