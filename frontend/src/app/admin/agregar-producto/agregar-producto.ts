import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    const file = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  async guardarProducto() {
    if (this.productoForm.valid) {

      let imagenURL = null;

      try {
        if (this.imagenSeleccionada) {
          const formData = new FormData();
          formData.append('file', this.imagenSeleccionada);
          formData.append('upload_preset', 'unsigned_preset'); // 👈 crea esto en cloudinary

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dwezi5gw3/image/upload',
            {
              method: 'POST',
              body: formData
            }
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

        console.log("Enviando producto:", payload);

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
                alert('Producto creado con imagen');
                this.router.navigate(['/admin/catalogo']);
              },
              error: () => {
                alert('Producto creado pero falló el SKU');
              }
            });
          },
          error: () => {
            alert('Error al guardar producto');
          }
        });

      } catch (error) {
        console.error(error);
        alert('Error al subir imagen');
      }

    } else {
      alert('Completa los campos obligatorios');
      this.productoForm.markAllAsTouched();
    }
  }
}