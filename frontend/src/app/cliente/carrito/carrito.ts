import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito {
  public cartService = inject(CartService);

  // Funciones para controlar cantidades
  incrementar(id: number) {
    this.cartService.updateQuantity(id, 1);
  }

  decrementar(id: number) {
    this.cartService.updateQuantity(id, -1);
  }

  eliminar(id: number) {
    this.cartService.removeFromCart(id);
  }
}