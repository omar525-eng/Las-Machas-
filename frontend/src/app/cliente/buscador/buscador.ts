import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { Producto } from '../../core/models/producto.interface';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css'
})
export class Buscador implements OnInit {
  private catalogoService = inject(CatalogoService);
  private searchService = inject(SearchService);
  public cartService = inject(CartService);
  private router = inject(Router);

  // Usamos signal para que Angular detecte cuando llegan los datos
  productos = signal<Producto[]>([]);

  // El filtro reacciona automáticamente a la búsqueda y a los productos
  productosFiltrados = computed(() => {
    const termino = this.searchService.searchTerm().toLowerCase();
    const listaActual = this.productos();
    
    return listaActual.filter((p: Producto) => 
      p.Nombre.toLowerCase().includes(termino) || 
      p.Tamano.toLowerCase().includes(termino)
    );
  });

  enviarDudaWhatsApp() {
  const msg = `¡Hola! Estoy viendo el catálogo de *Las Machas* y tengo una duda... 🌶️`;
  const numeroTel = "52461130968"; 
  const url = `https://wa.me/${numeroTel}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

  ngOnInit() {
    this.catalogoService.obtenerProductos().subscribe({
      next: (res: any) => {
        // Guardamos los datos que vienen de la API
        const data = res.data || res;
        this.productos.set(data);
      },
      error: (err) => console.error('Error al cargar salsas', err)
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }

  agregar(producto: Producto) {
    this.cartService.addToCart({
      id: producto.ProductoID,
      nombre: producto.Nombre,
      precio: producto.PrecioRegular,
      cantidad: 1,
      imagen: producto.ImagenURL,
      tamano: producto.Tamano
    });
  }
}