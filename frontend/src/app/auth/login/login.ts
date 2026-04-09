
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
          // 1. Extraemos el rol. Añadimos 'Rol' (con mayúscula) para blindarlo contra el backend
          let userRole = response.Rol || response.rol || response.role || response.usuario?.rol || response.data?.rol;

          // 2. Si no viene suelto, decodificamos el token de forma segura
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
          this.router.navigate([this.authService.isAdmin() ? '/admin/catalogo' : '/tienda']);
        },
        error: (err) => alert('Usuario no encontrado o credenciales incorrectas: ' + err.message)
      });
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }

  entrarComoInvitado() {
    // Borramos cualquier rastro de sesión anterior
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/tienda']);
  }
}
