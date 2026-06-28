import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
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

  private obtenerUsuarioId(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.UsuarioID || payload.id || payload.userId || payload.usuarioId || payload.idUsuario;
    } catch (e) {
      return null;
    }
  }

  ngOnInit() {
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
    // Validación 1: Campos vacíos
    if (!this.usuario.nombreCompleto || !this.usuario.direccionDefecto || !this.usuario.telefono) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'Por favor, llena todos los campos obligatorios marcados en rojo para poder realizar el envío.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88' 
      });
      return;
    }

    // Validación 2: Formato exacto de teléfono (10 dígitos)
    const regexTelefono = /^[0-9]{10}$/;
    if (!regexTelefono.test(this.usuario.telefono)) {
      Swal.fire({
        title: 'Teléfono inválido',
        text: 'El número de WhatsApp debe tener exactamente 10 dígitos numéricos.',
        icon: 'warning',
        confirmButtonText: 'Corregir',
        confirmButtonColor: '#E75A88' 
      });
      return;
    }

    const token = localStorage.getItem('token');
    const usuarioId = token ? this.obtenerUsuarioId(token) : null;

    const pedido = {
      UsuarioID: usuarioId,
      ClienteNombre: this.usuario.nombreCompleto,
      ClienteDireccion: this.usuario.direccionDefecto,
      ClienteTelefono: this.usuario.telefono,
      detalles: this.cartService.getItems()().map(item => ({
        SkuID: item.id,
        Cantidad: item.cantidad,
        Precio: this.cartService.getPrecioUnitarioFinal(item)
      }))
    };

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post('http://localhost:3000/api/pedidos', pedido, { headers }).subscribe({
      next: (res: any) => {
        const folio = res.data?.Folio || 'Tu pedido';
        
        Swal.fire({
          title: '¡Pedido Confirmado!',
          html: `<b>${folio}</b> se ha registrado exitosamente.<br><br>Se abrirá WhatsApp para coordinar la entrega con nuestro equipo.`,
          icon: 'success',
          confirmButtonText: 'Ir a WhatsApp',
          confirmButtonColor: '#25D366', 
          allowOutsideClick: false 
        }).then((result) => {
          if (result.isConfirmed) {
            this.abrirWhatsApp();
            this.cartService.clearCart();
            this.router.navigate(['/tienda']);
          }
        });

      },
      error: (err) => {
        console.error('Error al procesar el pedido:', err);
        Swal.fire({
          title: 'Error de conexión',
          text: 'Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88'
        });
      }
    });
  }

  abrirWhatsApp() {
    let msg = `*NUEVO PEDIDO - LAS MACHAS*\n\n`;
    msg += `*Cliente:* ${this.usuario.nombreCompleto}\n`;
    msg += `*Teléfono:* ${this.usuario.telefono}\n`;
    msg += `*Dirección:* ${this.usuario.direccionDefecto}\n\n`;
    msg += `*Productos:*\n`;
    
    this.cartService.getItems()().forEach(item => {
      const precioUnitario = this.cartService.getPrecioUnitarioFinal(item);
      msg += `- ${item.cantidad}x ${item.nombre} ($${precioUnitario * item.cantidad})\n`;
    });
    
    msg += `\n*Total a pagar:* $${this.cartService.total()}\n\n`;
    msg += `¡Gracias por tu compra!`;

    const numeroTel = "523461130968"; 
    const url = `https://wa.me/${numeroTel}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}