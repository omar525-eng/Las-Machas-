import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

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
    password: new FormControl('', Validators.required),
    telefono: new FormControl(''),
    direccionDefecto: new FormControl('')
  });

  registrarUsuario() {
    // Validamos usando la herramienta del FormGroup
    if (this.registroForm.invalid) {
      alert('Por favor llena los campos obligatorios (Nombre, Correo y Contraseña).');
      return;
    }
  
   const datosAEnviar = {
  ...this.registroForm.value,
  rol: 'Cliente',
  passwordHash: this.registroForm.value.password
 
};
    
    this.http.post('http://localhost:3000/api/usuarios/registrar', datosAEnviar).subscribe({
      next: () => {
        alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        // Extraemos el error EXACTO que nos manda el backend
        const mensajeReal = err.error?.message || err.error?.error || 'Error desconocido del servidor ';
        alert(`Hubo un problema: ${mensajeReal}`);
      }
    });
  }
}