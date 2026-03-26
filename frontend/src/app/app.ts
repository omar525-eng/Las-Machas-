import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { SearchService } from './core/services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public searchService = inject(SearchService);
  public router = inject(Router);

  actualizarBusqueda(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.searchService.searchTerm.set(elemento.value);
  }
}