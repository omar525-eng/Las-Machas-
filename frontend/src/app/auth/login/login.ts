
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
      this.http.post<any>('http://localhost:3000/usuarios/login', credentials).subscribe({
        next: (response) => {
          this.authService.login(response.token, response.role);
          this.router.navigate([this.authService.isAdmin() ? '/admin/catalogo' : '/tienda']);
        },
        error: (err) => alert('Usuario no encontrado o credenciales incorrectas: ' + err.message)
      });
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }
}
