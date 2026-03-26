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

  // Definición del formulario con validaciones básicas
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      this.http.post<any>('http://localhost:3000/api/auth/login', credentials).subscribe({
        next: (response) => {
          // 1. Guardamos el token y el rol en el servicio
          this.authService.login(response.token, response.role);
          
          // 2. EL IF DE REDIRECCIÓN
          if (response.role && response.role.toLowerCase() === 'admin') {
            this.router.navigate(['/admin/catalogo']);
          } else {
            this.router.navigate(['/tienda']); 
          }
        },
        error: (err) => alert('Usuario no encontrado o credenciales incorrectas.')
      });
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }
}