// buscador.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})
export class Buscador implements OnInit {
  productosBD: any[] = []; 

  private http = inject(HttpClient);
  private cartService = inject(CartService);
  public searchService = inject(SearchService);
  private cdr = inject(ChangeDetectorRef);

  get productos() {
    const term = this.searchService.searchTerm().toLowerCase();
    if (!term) return this.productosBD;
    
    return this.productosBD.filter(p => 
      (p.Nombre?.toLowerCase().includes(term)) ||
      (p.Categoria?.toLowerCase().includes(term))
    );
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/catalogos').subscribe({
      next: (res) => {
        this.productosBD = res.data || res;
        this.cdr.detectChanges();
      }
    });
  }

  agregarAlCarrito(producto: any) {
    this.cartService.addToCart({
      id: producto.ProductoID,
      nombre: producto.Nombre,
      precio: producto.PrecioRegular,
      cantidad: 1
    });
    alert(`¡${producto.Nombre} añadido!`);
  }
}