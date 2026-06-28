import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css'] // Asegúrate de enlazar el CSS aquí
})
export class MisDatosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  isLoggedIn = false;
  modoEdicion = false;

  usuario = {
    nombreCompleto: '',
    telefono: '',
    direccionDefecto: ''
  };

  ngOnInit() {
    this.cargarDatos();
  }

  private obtenerUsuarioId(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.UsuarioID || payload.id || payload.userId || payload.usuarioId || payload.idUsuario;
    } catch (e) {
      return null;
    }
  }

  cargarDatos() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoggedIn = false;
      return;
    }

    const usuarioId = this.obtenerUsuarioId(token);
    if (!usuarioId) return;

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
        if (err.status === 401 || err.status === 403) {
          this.isLoggedIn = false;
        }
      }
    });
  }

  guardarDatos() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Debes iniciar sesión para actualizar tus datos.',
        icon: 'warning',
        confirmButtonColor: '#E75A88'
      });
      return;
    }

    // Validación 1: Campos vacíos
    if (!this.usuario.nombreCompleto || !this.usuario.telefono) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'Tu nombre completo y teléfono son obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88'
      });
      return;
    }

    // Validación 2: Formato de teléfono
    const regexTelefono = /^[0-9]{10}$/;
    if (!regexTelefono.test(this.usuario.telefono)) {
      Swal.fire({
        title: 'Teléfono inválido',
        text: 'El número debe tener exactamente 10 dígitos numéricos.',
        icon: 'warning',
        confirmButtonText: 'Corregir',
        confirmButtonColor: '#E75A88'
      });
      return;
    }

    const usuarioId = this.obtenerUsuarioId(token);
    if (!usuarioId) return;

    const datosAEnviar = {
      ...this.usuario,
      UsuarioID: usuarioId, 
      NombreCompleto: this.usuario.nombreCompleto,
      nombre: this.usuario.nombreCompleto,
      Telefono: this.usuario.telefono,
      telefono: this.usuario.telefono,
      DireccionDefecto: this.usuario.direccionDefecto,
      direccion: this.usuario.direccionDefecto
    };

    this.http.put(`http://localhost:3000/api/usuarios/${usuarioId}`, datosAEnviar, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '¡Datos guardados!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        this.modoEdicion = false;
      },
      error: (err) => {
        const mensajeReal = err.error?.message || err.error?.error || err.message || 'Error del servidor';
        // Alerta de error
        Swal.fire({
          title: 'Error al guardar',
          text: `No se pudieron actualizar los datos: ${mensajeReal}`,
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88'
        });
      }
    });
  }
}