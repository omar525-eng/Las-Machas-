import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-producto.html',
  styleUrl: './actualizar-producto.css'
})
export class ActualizarProducto implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  productoId: string | null = null;
  cargando = true;
  
  archivoSeleccionado: File | null = null;

  // 🔥 VARIABLES DE IMAGEN
  imagenPreview: string | ArrayBuffer | null = null;
  imagenActual: string | null = null;
  fechaActual: number = new Date().getTime();

  productoForm = new FormGroup({
    Nombre: new FormControl({ value: '', disabled: true }),
    Descripcion: new FormControl(''),
    Categoria: new FormControl({ value: '', disabled: true }),
    Tamano: new FormControl({ value: '', disabled: true }),
    PrecioRegular: new FormControl('', Validators.required),
    StockActual: new FormControl('', Validators.required),
    StockMinimo: new FormControl('')
  });

  ngOnInit() {
    this.productoId = this.route.snapshot.paramMap.get('id');

    if (this.productoId) {
      this.cargarDatosDelProducto(this.productoId);
    } else {
      this.cargando = false;
    }
  }

  cargarDatosDelProducto(id: string) {
    this.catalogoService.obtenerProductos().subscribe({
      next: (res: any) => {
        const activos = res.data || res;
        const productoActivo = activos.find((p: any) => p.SkuID == id);

        if (productoActivo) {
          this.llenarFormulario(productoActivo);
        } else {
          this.catalogoService.obtenerInactivos().subscribe({
            next: (resInactivos: any) => {
              const inactivos = resInactivos.data || resInactivos;
              const productoInactivo = inactivos.find((p: any) => p.SkuID == id);

              if (productoInactivo) {
                this.llenarFormulario(productoInactivo);
              } else {
                alert('No se encontró el producto');
                this.cargando = false;
              }
            }
          });
        }
      }
    });
  }

  llenarFormulario(p: any) {
    this.productoForm.patchValue({
      Nombre: p.Nombre || p.NombreProducto,
      Descripcion: p.Descripcion || '',
      Categoria: p.Categoria || '',
      Tamano: p.Tamano || '',
      PrecioRegular: p.Precio || p.PrecioRegular || 0,
      StockActual: p.Stock || 0,
      StockMinimo: p.StockMinimo || 5
    });
    
    // ✅ Corregido para que agarre la foto correctamente
    this.imagenPreview = p.ImagenURL || null;
    this.imagenActual = p.ImagenURL || null;

    this.cargando = false;
    this.cdr.detectChanges();
  }

  // 📸 Seleccionar nueva imagen
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.archivoSeleccionado = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  // 🚀 GUARDAR CAMBIOS
  async guardarCambios() {
    if (this.productoForm.valid && this.productoId) {

      let imagenURL = this.imagenActual;

      try {
        // 🔥 SUBIR IMAGEN A CLOUDINARY SI HAY NUEVA
        if (this.archivoSeleccionado) {
          const formData = new FormData();
          formData.append('file', this.archivoSeleccionado);
          formData.append('upload_preset', 'unsigned_preset'); 

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dwezi5gw3/image/upload',
            {
              method: 'POST',
              body: formData
            }
          );

          const data = await res.json();

          if (data.secure_url) {
            imagenURL = data.secure_url;
          } else {
            throw new Error('No se subió la imagen');
          }
        }
        
        console.log('Imagen FINAL que se enviará:', imagenURL);

        const datosRaw = this.productoForm.getRawValue();

        const payloadProducto = {
          Nombre: datosRaw.Nombre,
          Descripcion: datosRaw.Descripcion,
          CategoriaID: 1,
          ImagenURL: imagenURL,
          Estado: 1
        };

        const payloadSKU = {
          Tamano: datosRaw.Tamano,
          PrecioRegular: Number(datosRaw.PrecioRegular),
          PrecioMayoreo: Number(datosRaw.PrecioRegular),
          Stock: Number(datosRaw.StockActual),
          StockMinimo: Number(datosRaw.StockMinimo) || 5
        };

        // 🔥 ACTUALIZAR PRODUCTO
        this.catalogoService.actualizarProducto(Number(this.productoId), payloadProducto).subscribe({
          next: () => {
            // 🔥 ACTUALIZAR SKU
            this.catalogoService.actualizarSKU(Number(this.productoId), payloadSKU).subscribe({
              next: () => {
                alert('✅ Producto actualizado con éxito');

                // 🔥 limpiar
                this.imagenPreview = null;
                this.archivoSeleccionado = null;
                this.imagenActual = imagenURL + '?t=' + new Date().getTime();
                this.cdr.detectChanges();

                // 🚀 navegar al catálogo
                this.router.navigate(['/admin/catalogo']);
              },
              error: (err) => {
                console.error(err);
                alert('Error en SKU');
              }
            });
          },
          error: (err) => {
            console.error(err);
            alert('Error al actualizar producto');
          }
        });

      } catch (error) {
        console.error(error);
        alert('Error al subir imagen a Cloudinary');
      }

    } else {
      alert('Completa los campos');
    }
  }
}