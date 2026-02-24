import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterOutlet],
  host: { class: 'block' },
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {}
