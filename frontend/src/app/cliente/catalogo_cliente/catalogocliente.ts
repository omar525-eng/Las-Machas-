import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SearchService } from '../../core/services/search.service'; // <--- Importante
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogocleinte.html',
  styleUrl: './catalogocliente.css'
})
export class CatalogoCliente implements OnInit {
  private catalogoService = inject(CatalogoService);
  private searchService = inject(SearchService);
  private cartService = inject(CartService);

  productosBD = signal<Producto[]>([]); // Guardamos los datos de Azure aquí

  // FILTRO MÁGICO: Esta lista se actualiza sola cuando alguien escribe en el buscador
  productosFiltrados = computed(() => {
    const term = this.searchService.searchTerm().toLowerCase();
    if (!term) return this.productosBD();
    
    return this.productosBD().filter((p: Producto) => 
      p.Nombre.toLowerCase().includes(term) || 
      p.Categoria.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        // Ajuste para la respuesta de Azure
        this.productosBD.set(respuesta.data || respuesta);
      },
      error: (error) => console.error('Error al conectar con Azure:', error)
    });
  }

  agregarAlCarrito(producto: Producto) {
    this.cartService.addToCart({
      id: producto.ProductoID,
      nombre: producto.Nombre,
      precio: producto.PrecioRegular,
      cantidad: 1
    });
    alert(`¡${producto.Nombre} lista para enviar!`);
  }
}