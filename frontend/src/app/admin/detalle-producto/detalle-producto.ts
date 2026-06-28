import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProductoAdmin implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private location = inject(Location);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  producto = signal<any>(null);
  cargando = signal<boolean>(true);
  esAdmin = signal<boolean>(false);

  ngOnInit() {
    this.esAdmin.set(this.authService.isAdmin());
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.cargarDetalle(id);
    } else {
      this.cargando.set(false);
    }
  }

  cargarDetalle(id: string) {
    this.catalogoService.obtenerDetalleProducto(id).subscribe({
      next: (res: any) => {
        const datos = res.data || res;
        const infoProducto = datos.producto || {};
        const infoSku = (datos.skus && datos.skus.length > 0) ? datos.skus[0] : {};

        // Juntamos la info y actualizamos el Signal
        this.producto.set({
          ...infoProducto,
          ...infoSku,
          Nombre: infoProducto.NombreProducto || infoProducto.Nombre,
          Descripcion: infoProducto.Descripcion,
          ImagenURL: infoProducto.ImagenURL
        });
        
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la ficha técnica completa:', err);
        this.cargando.set(false);
      }
    });
  }

  regresar() {
    this.location.back(); 
  }

  agregarAlCarrito() {
    const prod = this.producto(); // Leemos el valor actual del signal
    if (!prod) return;
    
    const skuId = prod.SkuID || prod.ProductoID;
    this.cartService.addToCart({
      id: skuId,
      nombre: prod.Nombre,
      precio: prod.PrecioRegular || prod.Precio,
      cantidad: 1,
      imagen: prod.ImagenURL,
      tamano: prod.Tamano
    });
    alert('¡Producto agregado al carrito!');
  }
}