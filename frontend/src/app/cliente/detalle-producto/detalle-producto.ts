import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../core/models/producto.interface';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private location = inject(Location);

  producto = signal<Producto | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Hacemos la petición a la API para obtener un solo producto
        this.http.get<any>(`http://localhost:3000/api/productos/${id}`).subscribe({
          next: (response) => {
            // Asignamos el producto a nuestro signal para que la vista se actualice
            this.producto.set(response.data || response);
          },
          error: (err) => {
            console.error('Error al cargar los detalles del producto', err);
            this.producto.set(null);
          }
        });
      }
    });
  }

  agregarAlCarrito(): void {
    const p = this.producto();
    if (p) {
      this.cartService.addToCart({ id: p.ProductoID, nombre: p.Nombre, precio: p.PrecioRegular, cantidad: 1, imagen: p.ImagenURL, tamano: p.Tamano });
      alert(`¡${p.Nombre} se agregó al carrito!`);
    }
  }

  regresar(): void {
    this.location.back();
  }
}