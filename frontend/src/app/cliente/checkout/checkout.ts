import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  // Es vital tener FormsModule para que el [(ngModel)] del HTML funcione
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  public cartService = inject(CartService);
  
  // Estas variables guardan lo que el usuario escribe en los inputs
  nombre: string = '';
  direccion: string = '';

  enviarWhatsApp() {
    // 1. Obtenemos los productos actuales del carrito
    const productos = this.cartService.getItems()();
    
    // 2. Si el carrito está vacío, avisamos al usuario
    if (productos.length === 0) {
      alert('Tu carrito está vacío. Agrega unas salsas antes de continuar.');
      return;
    }

    // 3. Construimos el cuerpo del mensaje
    let textoMensaje = `¡Hola! Quisiera hacer un pedido:\n\n`;
    textoMensaje += `👤 *Nombre:* ${this.nombre || 'No especificado'}\n`;
    textoMensaje += `📍 *Dirección:* ${this.direccion || 'No especificada'}\n\n`;
    textoMensaje += `🌶️ *Detalle del Pedido:*\n`;

    productos.forEach(item => {
      textoMensaje += `- ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})\n`;
    });

    textoMensaje += `\n💰 *Total a pagar: $${this.cartService.total()}*`;

    // 4. Configuramos el enlace (Usa tu número real aquí)
    const numeroTel = "52461130968"; // Formato: código de país + número
    const url = `https://wa.me/${numeroTel}?text=${encodeURIComponent(textoMensaje)}`;
    
    // 5. Abrimos WhatsApp en una pestaña nueva
    window.open(url, '_blank');
  }
}