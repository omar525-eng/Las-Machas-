import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.http.post<any>('http://localhost:3000/api/usuarios/login', credentials).subscribe({
        next: (response) => {
          // 1. Extraemos el rol
          let userRole = response.Rol || response.rol || response.role || response.usuario?.rol || response.data?.rol;

          // 2. Decodificamos el token si es necesario
          if (!userRole && response.token) {
            try {
              const base64Url = response.token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(atob(base64));
              userRole = payload.rol || payload.role || payload.Rol || payload.Role || '';
            } catch (e) {}
          }

          console.log('✅ Respuesta exacta del backend:', response);
          console.log('✅ Rol detectado para la sesión:', userRole);

          this.authService.login(response.token, userRole || '');
          
          const destino = this.authService.isAdmin() ? '/admin/catalogo' : '/tienda';

          // Alerta de Bienvenida (Se cierra sola)
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Iniciando sesión...',
            icon: 'success',
            timer: 1000, // 1.5 segundos
            showConfirmButton: false // Ocultamos el botón para que sea automático
          }).then(() => {
            this.router.navigate([destino]);
          });
          
        },
        error: (err) => {
          // Alerta de Error (Credenciales incorrectas)
          Swal.fire({
            title: '¡Ups!',
            text: 'Usuario no encontrado o contraseña incorrecta.',
            icon: 'error',
            confirmButtonText: 'Reintentar',
            confirmButtonColor: '#E75A88' // El rosa de Las Machas
          });
        }
      });
    } else {
      // Alerta de Validación (Faltan datos)
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Por favor, ingresa un correo válido y tu contraseña.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88'
      });
    }
  }

  entrarComoInvitado() {
    // Borramos cualquier rastro de sesión anterior
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/tienda']);
  }
}