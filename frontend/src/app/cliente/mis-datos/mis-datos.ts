import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-datos.html'
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

  // Función para leer el ID que viene oculto en el Token de sesión
  private obtenerUsuarioId(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token Payload:', payload); // Para depurar
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
        console.log('Datos GET recibidos:', res);
        
        let nombre = '';
        let telefono = '';
        let direccion = '';
        
        // Buscador recursivo: encuentra el dato sin importar cómo lo mande el backend
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
        
        // Obligar a Angular a refrescar la pantalla de inmediato
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
        if (err.status === 401 || err.status === 403) {
          this.isLoggedIn = false;
        }
      }
    });
  }

  guardarDatos() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para actualizar tus datos.');
      return;
    }

    const usuarioId = this.obtenerUsuarioId(token);
    if (!usuarioId) return;

    // Enviamos una copia con los nombres exactos que piden tus amigos
    const datosAEnviar = {
      ...this.usuario,
      UsuarioID: usuarioId, // Inyectamos el ID por si lo esperan en el body
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
        alert('¡Tus datos han sido actualizados correctamente!');
        this.modoEdicion = false; // Ocultamos el formulario al guardar
      },
      error: (err) => {
        console.error('Error al guardar datos:', err);
        // Extraemos el error exacto para saber qué falló
        const mensajeReal = err.error?.message || err.error?.error || err.message || 'Error del servidor';
        alert(`No se pudieron guardar los datos. Razón: ${mensajeReal}`);
      }
    });
  }
}
