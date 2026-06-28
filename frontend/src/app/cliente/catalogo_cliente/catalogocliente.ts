import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { CatalogoService } from '../../core/services/catalogo.service';
import { SearchService } from '../../core/services/search.service';
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogocliente.html',
  styleUrl: './catalogocliente.css' 
})
export class CatalogoCliente implements OnInit {
  private catalogoService = inject(CatalogoService);
  private searchService = inject(SearchService);
  private cartService = inject(CartService);

  // Variables con Signals
  productosBD = signal<Producto[]>([]);
  cargando = signal<boolean>(false);

  // Filtro Seguro (Igual que en el admin)
  productosFiltrados = computed(() => {
    const term = this.searchService.searchTerm()?.toLowerCase() || '';
    const lista = this.productosBD();

    if (!term) return lista;
    
    return lista.filter((p: Producto) => 
      p.Nombre.toLowerCase().includes(term) || 
      (p.Categoria && p.Categoria.toLowerCase().includes(term))
    );
  });

  ngOnInit() {
    this.cargando.set(true);
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        this.productosBD.set(respuesta.data || respuesta);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al conectar con Azure:', error);
        this.cargando.set(false);
        // Alerta si se cae el servidor
        Swal.fire({
          title: '¡Ups!',
          text: 'Tuvimos un problema cargando las salsas. Por favor, recarga la página.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88' // Rosa Machas
        });
      }
    });
  }

  agregarAlCarrito(producto: Producto) {
    const skuId = producto.SkuID || producto.ProductoID;
    this.cartService.addToCart({
      id: skuId,
      nombre: producto.Nombre,
      precio: producto.PrecioRegular,
      cantidad: 1,
      imagen: producto.ImagenURL,
      tamano: producto.Tamano
    });
    
    Swal.fire({
      toast: true,
      position: 'top-end', // Sale abajo a la derecha (muy estilo app móvil)
      icon: 'success',
      title: `¡${producto.Nombre} en tu carrito!`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#fff',
      color: '#212121'
    });
  }

  enviarDudaWhatsApp() {
    const msg = `¡Hola! Estoy viendo el catálogo de *Las Machas* y tengo una duda...`;
    const numeroTel = "523461130968"; 
    const url = `https://wa.me/${numeroTel}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}