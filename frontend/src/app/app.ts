import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { SearchService } from './core/services/search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

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

  // 1. Señal que siempre escucha en qué URL te encuentras
  private currentUrlSignal = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  // 2. Lógica para mostrar los botones: Solo si estás logueado Y NO estás en el login
  public showLayout = computed(() => {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUrl = this.currentUrlSignal();
    return isLoggedIn && currentUrl !== '/login';
  });

  actualizarBusqueda(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.searchService.searchTerm.set(elemento.value);
  }
}