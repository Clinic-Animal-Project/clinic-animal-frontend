import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear fechas en español
 * Ejemplo de uso: {{ appointment.date | dateFormat }}
 */
@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-ES', options);
  }
}
