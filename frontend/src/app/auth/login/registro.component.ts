import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Cambiamos FormsModule por ReactiveFormsModule
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  // 2. Registramos ReactiveFormsModule aquí
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  // 3. Creamos el registroForm que tu HTML estaba buscando
  registroForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    telefono: new FormControl(''),
    direccion: new FormControl('')
  });

  // 4. Renombramos la función a registrarUsuario() como lo pide tu HTML
  registrarUsuario() {
    // Validamos usando la herramienta del FormGroup
    if (this.registroForm.invalid) {
      alert('Por favor llena los campos obligatorios (Nombre, Email y Contraseña).');
      return;
    }

    // 5. this.registroForm.value contiene exactamente los mismos datos que tenías en tu objeto
    this.http.post('http://localhost:3000/api/usuarios/registro', this.registroForm.value).subscribe({
      next: () => {
        alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert('Ocurrió un error al intentar registrarte. Por favor intenta de nuevo.');
      }
    });
  }
}