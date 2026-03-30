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

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

  productoForm = new FormGroup({
    Nombre: new FormControl('', Validators.required),
    Descripcion: new FormControl(''), 
    Categoria: new FormControl('Salsas', Validators.required),
    Tamano: new FormControl('Frasco 250ml', Validators.required),
    PrecioRegular: new FormControl('', Validators.required),
    PrecioMayoreo: new FormControl(''),
    Stock: new FormControl('', Validators.required),
    StockMinimo: new FormControl('')
  });

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file; 

      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  guardarProducto() {
    if (this.productoForm.valid) {
      const formData = new FormData();
      formData.append('datos', JSON.stringify(this.productoForm.value));
      
      if (this.imagenSeleccionada) {
        formData.append('imagen', this.imagenSeleccionada); 
      }

      console.log('Datos del producto:', this.productoForm.value);
      console.log('Foto adjunta lista para el back:', this.imagenSeleccionada?.name);
      
      alert('¡Producto y foto capturados con éxito! (Esperando ruta del backend)');
      
      this.router.navigate(['/admin/catalogo']); 
    } else {
      console.error('Faltan campos por llenar.');
    }
  }
}