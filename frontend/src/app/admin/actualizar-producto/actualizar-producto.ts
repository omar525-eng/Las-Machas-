import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizar-producto',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './actualizar-producto.html',
  styleUrl: './actualizar-producto.css'
})
export class ActualizarProducto {
  private router = inject(Router);

  productoForm = new FormGroup({
    Nombre: new FormControl({value: 'Salsa Macha Roja', disabled: true}),
    Descripcion: new FormControl(''),
    Categoria: new FormControl({value: 'Salsas', disabled: true}),
    Tamano: new FormControl({value: 'Frasco 250ml', disabled: true}),
    PrecioRegular: new FormControl('50.00', Validators.required),
    StockActual: new FormControl('20', Validators.required),
    StockMinimo: new FormControl('5')
  });

  guardarCambios() {
    if (this.productoForm.valid) {
      console.log('Cambios listos para enviar:', this.productoForm.getRawValue());
      alert('¡Actualización exitosa! (Simulado hasta conectar el backend)');
      this.router.navigate(['/admin/catalogo']); 
    }
  }
}