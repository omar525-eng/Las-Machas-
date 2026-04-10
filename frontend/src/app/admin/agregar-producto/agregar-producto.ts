import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importamos CommonModule para *ngIf
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
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
      
      const payloadProducto = {
        Nombre: this.productoForm.value.Nombre,
        Descripcion: this.productoForm.value.Descripcion,
        CategoriaID: parseInt(this.productoForm.value.CategoriaID as string),
        ImagenURL: 'https://placehold.co/300x180/e53935/ffffff?text=Nueva+Salsa', // Se enviará la URL final cuando el back lo permita
        Estado: 1
      };

      console.log('1. Enviando Producto al backend...');

      this.catalogoService.crearProducto(payloadProducto).subscribe({
        next: (res) => {
          console.log('¡Producto creado!', res);
          
          const nuevoID = res.productoID; 

          const payloadSKU = {
            ProductoID: nuevoID,
            Tamano: this.productoForm.value.Tamano,
            PrecioRegular: Number(this.productoForm.value.PrecioRegular),
            PrecioMayoreo: Number(this.productoForm.value.PrecioMayoreo) || Number(this.productoForm.value.PrecioRegular),
            Stock: Number(this.productoForm.value.Stock),
            StockMinimo: Number(this.productoForm.value.StockMinimo) || 5,
            Estado: 1 
          };

          console.log('2. Enviando SKU al backend...', payloadSKU);

          this.catalogoService.crearSKU(payloadSKU).subscribe({
            next: (resSku) => {
              console.log('¡SKU creado con éxito!', resSku);
              // Aviso ajustado para que Papu sepa que la imagen "real" viene después
              alert('¡Producto y presentación guardados! (La foto se subirá cuando el servidor esté listo)');
              
              setTimeout(() => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/admin/catalogo']);
                });
              }, 600); 

            },
            error: (errSku) => {
              console.error('Error al guardar el SKU:', errSku);
              alert('Se creó el producto pero falló al guardar el precio/inventario.');
            }
          });

        },
        error: (err) => {
          console.error('Error al guardar el Producto:', err);
          alert('Hubo un error al guardar los datos generales.');
        }
      });

    } else {
      alert('Por favor, llena los campos obligatorios.');
      this.productoForm.markAllAsTouched();
    }
  }
}