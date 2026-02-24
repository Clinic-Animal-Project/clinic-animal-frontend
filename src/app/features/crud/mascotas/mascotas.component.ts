import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [RouterOutlet],
  host: { class: 'block' },
  templateUrl: './mascotas.component.html',
})
export class MascotasComponent {}
