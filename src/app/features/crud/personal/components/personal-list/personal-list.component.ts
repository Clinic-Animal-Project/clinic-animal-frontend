import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PersonalService } from '../../service/personal.service';
import { PersonalResponse } from '../../model/personal.model';

@Component({
    selector: 'app-personal-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './personal-list.component.html'
})
export class PersonalListComponent implements OnInit {

    personalList = signal<PersonalResponse[]>([]);    isLoading = true;
    personalService = inject(PersonalService);
    router = inject(Router);

    ngOnInit(): void {
        this.loadPersonal();
    }

    loadPersonal(): void {
        this.isLoading = true;
        this.personalService.listarPersonal().subscribe({
            next: (data) => {
                console.log("personal ",data)
                this.personalList.set(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error al cargar personal', err);
            }
        });
    }

    deletePersonal(id: number): void {
        if (window.confirm('¿Estás seguro? No podrás revertir esto!')) {
            this.personalService.eliminarPersonal(id).subscribe({
                next: () => {
                    window.alert('El registro ha sido eliminado.');
                    this.loadPersonal();
                },
                error: (err: any) => {
                    console.error('Error eliminando', err);
                    window.alert('No se pudo eliminar el registro');
                }
            });
        }
    }

    navigateToCreate(): void {
        this.router.navigate(['/mantenimiento/personal/crear']);
    }

    trackByPersonal(index: number, personal: PersonalResponse): number {
        return personal.id;
    }
}
