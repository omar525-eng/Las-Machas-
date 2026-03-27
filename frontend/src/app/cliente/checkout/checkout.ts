import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout {
  public cartService = inject(CartService);
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';

  enviarWhatsApp() {
    const productos = this.cartService.getItems()();
    let msg = `¡Hola! Soy *${this.nombre}*.\nPedido para: _${this.direccion}_\n\n`;
    
    productos.forEach(item => {
      msg += `• ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})\n`;
    });

    msg += `\n*Total: $${this.cartService.total()}*`;
    
    const url = `https://wa.me/+523461130968?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}