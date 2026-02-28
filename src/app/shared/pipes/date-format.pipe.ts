import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null | undefined, format: 'full' | 'date' | 'time' = 'full'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    // Validar si la fecha es inválida
    if (isNaN(date.getTime())) return '';

    if (format === 'time') {
      // Usamos toLocaleTimeString para obtener SOLO la hora
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    }

    if (format === 'date') {
      // Usamos toLocaleDateString para obtener SOLO la fecha
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }

    // Formato 'full' (Fecha + Hora)
    return date.toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

  }
}
