import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-datos.html'
})
export class MisDatosComponent implements OnInit {
  private http = inject(HttpClient);
  
  usuario = {
    nombre: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any>('http://localhost:3000/api/usuarios/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.usuario.nombre= data.nombre || data.Nombre || '';
        this.usuario.telefono = data.telefono || data.Telefono || '';
        this.usuario.direccion = data.direccion|| data.Direccion || '';
      },
      error: (err) => console.error('Error al cargar los datos del usuario:', err)
    });
  }

  guardarDatos() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para actualizar tus datos.');
      return;
    }

    this.http.put('http://localhost:3000/api/usuarios/perfil', this.usuario, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => alert('¡Tus datos han sido actualizados correctamente!'),
      error: (err) => {
        console.error('Error al guardar datos:', err);
        alert('No se pudieron guardar los datos.');
      }
    });
  }
}
