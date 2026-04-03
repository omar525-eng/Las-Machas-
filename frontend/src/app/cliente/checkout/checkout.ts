import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  public cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);

  usuario = {
    nombre: '',
    direccion: '',
    telefono: ''
  };

  ngOnInit() {
    // Si el usuario ya está registrado/logueado, obtenemos sus datos
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>('http://localhost:3000/api/usuarios/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res) => {
          const data = res.data || res;
          this.usuario.nombre = data.nombre || data.Nombre || '';
          this.usuario.direccion = data.direccion || data.Direccion || '';
          this.usuario.telefono = data.telefono || data.Telefono || '';
        },
        error: (err) => console.error('Error cargando datos del perfil:', err)
      });
    }
  }

  enviarPedido() {
    if (!this.usuario.nombre || !this.usuario.direccion || !this.usuario.telefono) {
      alert('Por favor, llena todos los campos para el envío.');
      return;
    }

    const pedido = {
      cliente: this.usuario.nombre,
      direccion: this.usuario.direccion,
      telefono: this.usuario.telefono,
      total: this.cartService.total(),
      items: this.cartService.getItems()().map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        // Usamos la función del servicio para que respete el descuento
        precio: this.cartService.getPrecioUnitarioFinal(item) 
      }))
    };

    // 1. Mandar al backend para guardar la venta y restar el stock
    this.http.post('http://localhost:3000/api/pedidos', pedido).subscribe({
      next: () => {
        // 2. Si fue exitoso, abrimos WhatsApp
        this.abrirWhatsApp();
        // 3. Limpiamos carrito y regresamos a la tienda
        this.cartService.clearCart();
        this.router.navigate(['/tienda']);
      },
      error: (err) => {
        console.error('Error al procesar el pedido:', err);
        alert('Hubo un problema al procesar tu pedido. Intenta nuevamente.');
      }
    });
  }

  abrirWhatsApp() {
    let msg = `*🌶️ NUEVO PEDIDO - LAS MACHAS 🌶️*\n\n`;
    msg += `*Cliente:* ${this.usuario.nombre}\n`;
    msg += `*Teléfono:* ${this.usuario.telefono}\n`;
    msg += `*Dirección:* ${this.usuario.direccion}\n\n`;
    msg += `*📦 Productos:*\n`;
    
    this.cartService.getItems()().forEach(item => {
      const precioUnitario = this.cartService.getPrecioUnitarioFinal(item);
      msg += `- ${item.cantidad}x ${item.nombre} ($${precioUnitario * item.cantidad})\n`;
    });
    
    msg += `\n*Total a pagar:* $${this.cartService.total()}\n\n`;
    msg += `¡Gracias por tu compra!`;

    const numeroTel = "52461130968"; 
    const url = `https://wa.me/${numeroTel}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}
