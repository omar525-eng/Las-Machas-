import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';
import Swal from 'sweetalert2'; 

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
  private cdr = inject(ChangeDetectorRef);

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  
  guardando = signal<boolean>(false);

  productoForm = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    Descripcion: new FormControl('', [Validators.maxLength(500)]),
    CategoriaID: new FormControl('1', Validators.required),
    Tamano: new FormControl('Frasco 250ml', Validators.required),
    PrecioRegular: new FormControl('', [Validators.required, Validators.min(0)]),
    PrecioMayoreo: new FormControl('', [Validators.min(0)]),
    Stock: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]),
    StockMinimo: new FormControl('', [Validators.min(0), Validators.pattern('^[0-9]+$')])
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = file;

      const reader = new FileReader();
      
      reader.onload = () => {
        this.imagenPreview = reader.result;
        this.cdr.detectChanges(); 
      };
      
      reader.readAsDataURL(file);
    }
  }

  removerImagen(fileInput: HTMLInputElement) {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    fileInput.value = ''; 
    this.cdr.detectChanges(); 
  }

  async guardarProducto() {
    if (this.productoForm.valid) {
      this.guardando.set(true); 
      let imagenURL = null;

      try {
        if (this.imagenSeleccionada) {
          const formData = new FormData();
          formData.append('file', this.imagenSeleccionada);
          formData.append('upload_preset', 'unsigned_preset'); 

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dwezi5gw3/image/upload',
            { method: 'POST', body: formData }
          );

          const data = await res.json();
          imagenURL = data.secure_url;
        }

        const payload = {
          Nombre: this.productoForm.value.Nombre,
          CategoriaID: this.productoForm.value.CategoriaID,
          Descripcion: this.productoForm.value.Descripcion,
          ImagenURL: imagenURL,
          Estado: 1
        };

        this.catalogoService.crearProducto(payload).subscribe({
          next: (res: any) => {
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

            this.catalogoService.crearSKU(payloadSKU).subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Producto Agregado!',
                  text: 'La nueva salsa se ha registrado exitosamente en el catálogo.',
                  icon: 'success',
                  confirmButtonText: '¡Genial!',
                  confirmButtonColor: '#4CAF50'
                }).then(() => {
                  this.guardando.set(false);
                  this.router.navigate(['/admin/catalogo']);
                });
              },
              error: () => {
                Swal.fire({
                  title: 'Aviso',
                  text: 'El producto se creó, pero hubo un fallo al registrar el inventario (SKU).',
                  icon: 'warning',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#E75A88'
                });
                this.guardando.set(false);
              }
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error de conexión',
              text: 'Hubo un problema al guardar el producto en la base de datos.',
              icon: 'error',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#E75A88'
            });
            this.guardando.set(false);
          }
        });

      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error al subir imagen',
          text: 'Hubo un problema al subir la fotografía. Revisa tu conexión e intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88'
        });
        this.guardando.set(false);
      }

    } else {
      Swal.fire({
        title: 'Datos inválidos',
        text: 'Por favor, revisa que no haya precios negativos, que el stock sea un número entero y que los campos obligatorios estén llenos.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88'
      });
      this.productoForm.markAllAsTouched();
    }
  }
}