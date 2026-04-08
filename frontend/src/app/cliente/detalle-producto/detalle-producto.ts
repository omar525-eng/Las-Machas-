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
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private location = inject(Location);

  // El signal almacenará solo el objeto del producto
  producto = signal<Producto | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
      this.http.get<any>(`http://localhost:3000/api/productos/${id}`).subscribe({
  next: (response) => {
    console.log('--- EXTRACCIÓN DE DATOS ---', response);
    
    // Entramos a data -> producto
    let p = response.data?.producto;

    // Si 'p' es una lista (Array), tomamos el primer elemento [0]
    if (Array.isArray(p)) {
      p = p[0];
    }

    if (p) {
      this.producto.set(p);
    }
  },
  error: (err) => {
    console.error('Error al conectar con la API', err);
    this.producto.set(null);
  }
});
      }
    });
  }

  agregarAlCarrito(): void {
    const p = this.producto();
    if (p) {
      this.cartService.addToCart({ 
        id: p.ProductoID, 
        nombre: p.Nombre, 
        precio: p.PrecioRegular, 
        cantidad: 1, 
        imagen: p.ImagenURL, 
        tamano: p.Tamano 
      });
      alert(`¡${p.Nombre} se agregó al carrito!`);
    }
  }

  regresar(): void {
    this.location.back();
  }
}