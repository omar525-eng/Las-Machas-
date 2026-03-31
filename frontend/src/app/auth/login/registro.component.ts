import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registrarUsuario() {
    if (this.registroForm.valid) {
      const userData = {
        ...this.registroForm.value,
        role: 2 // Asignar rol de cliente por defecto
      };
      
      // Cuando tu backend esté listo, descomenta este bloque:
            
      this.http.post('http://localhost:3000/api/usuarios/registro', userData).subscribe({
      next: (response) => {
           alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
           this.router.navigate(['/login']);
         },
         error: (error) => alert('Hubo un error en el registro: ' + error.message)
       });
       
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    }
  }
}