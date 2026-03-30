import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { BusquedaService } from './core/services/busqueda.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Las Machas';
  private busquedaService = inject(BusquedaService);

  onBuscar(event: any) {
    this.busquedaService.cambiarTermino(event.target.value);
  }
}