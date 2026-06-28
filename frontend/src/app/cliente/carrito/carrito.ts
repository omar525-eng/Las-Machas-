import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {
  public cartService = inject(CartService);

  incrementar(id: string) {
    this.cartService.updateQuantity(id, 1);
  }

  decrementar(id: string) {
    // 1. Buscamos el producto actual para ver cuántos tiene
    const items = this.cartService.getItems()();
    const item = items.find(i => i.cartItemId === id);

    // 2. Si solo le queda 1 e intenta bajar la cantidad, le preguntamos si lo quiere eliminar
    if (item && item.cantidad <= 1) {
      this.eliminar(id);
    } else {
      // Si tiene más de 1, le bajamos la cantidad normalmente
      this.cartService.updateQuantity(id, -1);
    }
  }

  eliminar(id: string) {
    // Buscamos el nombre de la salsa para hacer la alerta más personalizada
    const items = this.cartService.getItems()();
    const item = items.find(i => i.cartItemId === id);
    const nombreSalsa = item ? item.nombre : 'este producto';

    Swal.fire({
      title: '¿Quitar del carrito?',
      text: `¿Estás seguro de que deseas eliminar ${nombreSalsa} de tu pedido?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E75A88', // El rosa oficial de Las Machas
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        // Si dice que sí, lo borramos del servicio
        this.cartService.removeFromCart(id);
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Producto eliminado',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
      }
    });
  }
}