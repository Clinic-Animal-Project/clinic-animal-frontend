import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Componente de botón reutilizable
 * Ejemplo de uso:
 * <app-button 
 *   label="Guardar" 
 *   variant="primary"
 *   (clicked)="onSave()">
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="getButtonClasses()"
      (click)="handleClick()">
      @if (loading()) {
        <svg class="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      {{ label() }}
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  // Inputs usando signals (Angular 18+)
  label = input.required<string>();
  type = input<ButtonType>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  // Output para el click
  clicked = output<void>();

  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Size classes
    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-5 py-2.5 text-base',
      large: 'px-7 py-3.5 text-lg'
    };

    // Variant classes with Clínicanimal colors
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
      secondary: 'bg-dark-700 text-white hover:bg-dark-800 focus:ring-dark-500 shadow-sm hover:shadow-md',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md'
    };

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`;
  }
}
