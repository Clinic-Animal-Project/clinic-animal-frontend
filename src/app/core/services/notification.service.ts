import { Injectable } from '@angular/core';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];

  /**
   * Mostrar notificación de éxito
   */
  success(message: string, duration: number = 3000): void {
    this.show(NotificationType.SUCCESS, message, duration);
  }

  /**
   * Mostrar notificación de error
   */
  error(message: string, duration: number = 5000): void {
    this.show(NotificationType.ERROR, message, duration);
  }

  /**
   * Mostrar notificación de advertencia
   */
  warning(message: string, duration: number = 4000): void {
    this.show(NotificationType.WARNING, message, duration);
  }

  /**
   * Mostrar notificación informativa
   */
  info(message: string, duration: number = 3000): void {
    this.show(NotificationType.INFO, message, duration);
  }

  /**
   * Mostrar notificación genérica
   */
  private show(type: NotificationType, message: string, duration: number): void {
    // Aquí puedes integrar una librería de notificaciones como ngx-toastr
    // o usar tu propio sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Ejemplo simple con alert (reemplazar con UI real)
    // alert(`${type.toUpperCase()}: ${message}`);
  }
}
