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
    CategoriaID: new FormControl('1', Validators.required),
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
      
      const payloadBackend = {
        Nombre: this.productoForm.value.Nombre,
        CategoriaID: parseInt(this.productoForm.value.CategoriaID as string),
        ImagenURL: 'https://via.placeholder.com/250', 
        Descripcion: this.productoForm.value.Descripcion
      };

      console.log('Enviando esto al backend:', payloadBackend);

      this.catalogoService.crearProducto(payloadBackend).subscribe({
        next: (res) => {
          console.log('Respuesta del servidor:', res);
          alert('¡Producto guardado en la base de datos con éxito!');
          this.router.navigate(['/admin/catalogo']);
        },
        error: (err) => {
          console.error('Error al guardar en la BD:', err);
          alert('Revisa la consola, algo falló en la conexión.');
        }
      });

    } else {
      alert('Llena los campos faltantes');
      this.productoForm.markAllAsTouched();
    }
  }
}