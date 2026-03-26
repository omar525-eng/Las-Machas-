import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.interface';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  public cartService = inject(CartService);
  private location = inject(Location);

  producto?: Producto;

  ngOnInit() {
    // Obtenemos el ID de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.catalogoService.obtenerProductos().subscribe({
      next: (productos: any) => {
        const data = productos.data || productos;
        this.producto = data.find((p: Producto) => p.ProductoID === id);
      },
      error: (err) => console.error('Error al cargar detalle', err)
    });
  }

  regresar() {
    this.location.back();
  }

  agregarAlCarrito() {
    if (this.producto) {
      this.cartService.addToCart({
        id: this.producto.ProductoID,
        nombre: this.producto.Nombre,
        precio: this.producto.PrecioRegular,
        cantidad: 1,
        imagen: this.producto.ImagenURL,
        tamano: this.producto.Tamano
      });
      alert('¡Salsa añadida al carrito! 🌶️');
    }
  }
}