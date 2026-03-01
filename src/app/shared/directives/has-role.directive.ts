import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

/**
 * Directiva estructural para mostrar/ocultar elementos según el rol del usuario
 * 
 * Uso:
 * <div *hasRole="'ADMIN'">Solo administradores</div>
 * <div *hasRole="['ADMIN', 'EMPLEADO']">Admins y empleados</div>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  
  private roles: string[] = [];

  @Input() set hasRole(roles: string | string[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    // Reactivamente actualizar la vista cuando cambie el usuario
    effect(() => {
      const user = this.authService.currentUser();
      this.updateView();
    });
  }

  private updateView(): void {
    const user = this.authService.currentUser();
    const hasRole = user && this.roles.includes(user.rol);

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
