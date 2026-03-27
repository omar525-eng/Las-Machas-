import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './agregar-producto.html',
  styleUrl: './agregar-producto.css'
})
export class AgregarProducto {
  private router = inject(Router);
  private catalogoService = inject(CatalogoService); 

  productoForm = new FormGroup({
    Nombre: new FormControl('', Validators.required),
    Descripcion: new FormControl(''), 
    Categoria: new FormControl('Salsas', Validators.required),
    ImagenURL: new FormControl(''),
    Tamano: new FormControl('Frasco 250ml', Validators.required),
    PrecioRegular: new FormControl('', Validators.required),
    PrecioMayoreo: new FormControl(''),
    Stock: new FormControl('', Validators.required),
    StockMinimo: new FormControl('')
  });

  guardarProducto() {
    if (this.productoForm.valid) {
      console.log('Paquete listo para cuando el backend exista:', this.productoForm.value);
      
      alert('¡Formulario funcional! (Esperando a que el backend habilite la ruta)');
      
      this.router.navigate(['/admin/catalogo']); 
    } else {
      console.error('Faltan campos por llenar.');
    }
  }
}