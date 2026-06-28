import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  registroForm = new FormGroup({
    nombreCompleto: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telefono: new FormControl('', [Validators.pattern('^[0-9]{10}$')]),
    direccionDefecto: new FormControl('')
  });

  registrarUsuario() {
    // 1. Alerta de validación más inteligente
    if (this.registroForm.invalid) {
      Swal.fire({
        title: 'Datos inválidos',
        text: 'Verifica que tu correo sea válido, la contraseña tenga al menos 6 caracteres y el teléfono sea de 10 dígitos exactos.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88', 
        customClass: { popup: 'swal-border-radius' }
      });
      // 🔥 Forzamos a que se pinten de rojo los campos con error
      this.registroForm.markAllAsTouched();
      return;
    }
  
    const datosAEnviar = {
      ...this.registroForm.value,
      rol: 'Cliente',
      passwordHash: this.registroForm.value.password
    };
    
    this.http.post('http://localhost:3000/api/usuarios/registrar', datosAEnviar).subscribe({
      next: () => {
        // 2. Alerta de Éxito
        Swal.fire({
          title: '¡Registro Exitoso!',
          text: 'Ya puedes iniciar sesión con tu cuenta.',
          icon: 'success',
          confirmButtonText: '¡Genial!',
          confirmButtonColor: '#4CAF50' 
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        const mensajeReal = err.error?.message || err.error?.error || 'Error desconocido del servidor';
        
        // 3. Alerta de Error (Backend)
        Swal.fire({
          title: '¡Ups!',
          text: `Hubo un problema: ${mensajeReal}`,
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88' 
        });
      }
    });
  }
}