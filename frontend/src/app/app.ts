import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
 
// --- SERVICIOS NAOMI (SE RESPETAN) ---
import { SearchService } from './core/services/search.service';
 
// --- SERVICIOS MIKE (SE INTEGRAN) ---
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 
  title = 'Las Machas';
 
  // 🔥 NAOMI (se mantiene)
  private searchService = inject(SearchService);
 
  // 🔥 MIKE (se integran)
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public router = inject(Router);
 
  // 🔥 SIGNAL DE MIKE (para detectar ruta actual)
  private currentUrlSignal = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url)
    )
  );
 
  // 🔥 LAYOUT CONDICIONAL (MEJORADO)
  public showLayout = computed(() => {
    const currentUrl = this.currentUrlSignal();
    return !currentUrl?.includes('/login') && !currentUrl?.includes('/registro');
  });
 
  // 🔥 MÉTODO UNIFICADO (USA EL DE NAOMI)
  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchService.searchTerm.set(input.value);
  }
}
 