import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  isLoggedIn = false;

  usuario = {
    nombreCompleto: '',
    direccionDefecto: '',
    telefono: ''
  };

  // Función para leer el ID que viene oculto en el Token
  private obtenerUsuarioId(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.UsuarioID || payload.id || payload.userId || payload.usuarioId || payload.idUsuario;
    } catch (e) {
      return null;
    }
  }

  ngOnInit() {
    // Si el usuario ya está registrado/logueado, obtenemos sus datos
    const token = localStorage.getItem('token');
    if (token) {
      const usuarioId = this.obtenerUsuarioId(token);
      if (usuarioId) {
        this.isLoggedIn = true;
        this.http.get<any>(`http://localhost:3000/api/usuarios/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (res) => {
            let nombre = '';
            let telefono = '';
            let direccion = '';
            
            // Buscador invencible para asegurar que agarramos los datos
            const buscarDatos = (obj: any) => {
              if (!obj || typeof obj !== 'object') return;
              for (const key of Object.keys(obj)) {
                const k = key.toLowerCase();
                if (k === 'nombre' || k === 'nombrecompleto' || k === 'nombre_completo') { if (!nombre) nombre = obj[key]; }
                if (k === 'telefono' || k === 'tel') { if (!telefono) telefono = obj[key]; }
                if (k === 'direccion' || k === 'direcciondefecto' || k === 'direccion_defecto') { if (!direccion) direccion = obj[key]; }
                if (typeof obj[key] === 'object') buscarDatos(obj[key]);
              }
            };
            buscarDatos(res);

            this.usuario.nombreCompleto = nombre || '';
            this.usuario.telefono = telefono || '';
            this.usuario.direccionDefecto = direccion || '';

            // Obligar a la pantalla a refrescarse
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando datos del perfil:', err);
            if (err.status === 401 || err.status === 403) {
              this.isLoggedIn = false;
            }
          }
        });
      }
    }
  }

  enviarPedido() {
    if (!this.usuario.nombreCompleto || !this.usuario.direccionDefecto || !this.usuario.telefono) {
      alert('Por favor, llena todos los campos para el envío.');
      return;
    }

    const pedido = {
      cliente: this.usuario.nombreCompleto,
      direccion: this.usuario.direccionDefecto,
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
    msg += `*Cliente:* ${this.usuario.nombreCompleto}\n`;
    msg += `*Teléfono:* ${this.usuario.telefono}\n`;
    msg += `*Dirección:* ${this.usuario.direccionDefecto}\n\n`;
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
