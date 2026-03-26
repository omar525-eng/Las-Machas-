// carrito.ts
import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  public cartService = inject(CartService);
  items = this.cartService.getItems();

  // Lógica de descuento del 20% si llevan > 10 botes de 500ml
  totalConDescuento = computed(() => {
    const productos = this.items();
    const subtotal = this.cartService.total();
    
    const cantidad500ml = productos
      .filter(item => item.nombre.includes('500'))
      .reduce((acc, item) => acc + item.cantidad, 0);

    return cantidad500ml > 10 ? subtotal * 0.80 : subtotal;
  });
}