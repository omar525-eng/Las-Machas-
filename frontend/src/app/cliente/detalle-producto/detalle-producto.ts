import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { CartService } from '../../core/services/cart.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-detalle-producto-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.html', 
  styleUrl: './detalle-producto.css'
})
export class DetalleProductoCliente implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private location = inject(Location);
  private cartService = inject(CartService);

  producto = signal<any>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalle(id);
    }
  }

  cargarDetalle(id: string) {
    this.catalogoService.obtenerDetalleProducto(id).subscribe({
      next: (res: any) => {
        const datos = res.data || res;
        const infoProducto = datos.producto || {};
        const infoSku = (datos.skus && datos.skus.length > 0) ? datos.skus[0] : {};

        this.producto.set({
          ...infoProducto,
          ...infoSku,
          Nombre: infoProducto.NombreProducto || infoProducto.Nombre,
          Descripcion: infoProducto.Descripcion,
          ImagenURL: infoProducto.ImagenURL
        });
      },
      error: (err) => {
        console.error('Error al cargar la macha:', err);
        // 🔥 Alerta de error y redirección automática
        Swal.fire({
          title: '¡Ups!',
          text: 'No pudimos cargar los detalles de esta salsa. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Regresar',
          confirmButtonColor: '#E75A88'
        }).then(() => {
          this.regresar();
        });
      }
    });
  }

  regresar() {
    this.location.back();
  }

  agregarAlCarrito() {
    const prod = this.producto();
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
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `¡${prod.Nombre} en tu carrito!`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#fff',
      color: '#212121'
    });
  }
}