import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';
import Swal from 'sweetalert2'; 

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

  skuIdUrl: string | null = null;
  
  productoIdDb: number | null = null;
  categoriaOriginal: number = 1;
  imagenOriginal: string | null = null;
  estadoOriginal: number = 1;

  cargando = signal<boolean>(true);
  guardando = signal<boolean>(false);

  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

  productoForm = new FormGroup({
    Nombre: new FormControl({ value: '', disabled: true }),
    Descripcion: new FormControl('', [Validators.maxLength(500)]),
    Categoria: new FormControl({ value: '', disabled: true }),
    Tamano: new FormControl({ value: '', disabled: true }),
    PrecioRegular: new FormControl('', [Validators.required, Validators.min(0)]),
    StockActual: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]),
    StockMinimo: new FormControl('', [Validators.min(0), Validators.pattern('^[0-9]+$')])
  });

  ngOnInit() {
    this.skuIdUrl = this.route.snapshot.paramMap.get('id');
    if (this.skuIdUrl) {
      this.cargarDatosDelProducto(this.skuIdUrl);
    } else {
      this.cargando.set(false);
    }
  }

  cargarDatosDelProducto(id: string) {
    this.catalogoService.obtenerProductos().subscribe({
      next: (res: any) => {
        const activos = res.data || res;
        const productoActivo = activos.find((p: any) => p.SkuID == id);

        if (productoActivo) {
          this.obtenerDescripcion(productoActivo);
        } else {
          this.catalogoService.obtenerInactivos().subscribe({
            next: (resInactivos: any) => {
              const inactivos = resInactivos.data || resInactivos;
              const productoInactivo = inactivos.find((p: any) => p.SkuID == id);

              if (productoInactivo) {
                this.obtenerDescripcion(productoInactivo);
              } else {
                Swal.fire({
                  title: '¡Ups!',
                  text: 'No se encontró el producto en la base de datos.',
                  icon: 'error',
                  confirmButtonText: 'Regresar',
                  confirmButtonColor: '#E75A88'
                }).then(() => {
                  this.router.navigate(['/admin/catalogo']);
                });
                this.cargando.set(false);
              }
            }
          });
        }
      }
    });
  }

  obtenerDescripcion(p: any) {
    this.productoIdDb = p.ProductoID;
    this.categoriaOriginal = p.CategoriaID || 1;
    this.imagenOriginal = p.ImagenURL || null;
    this.estadoOriginal = p.Estado !== undefined ? p.Estado : 1;

    this.catalogoService.obtenerDetalleProducto(this.productoIdDb!.toString()).subscribe({
      next: (resDetalle: any) => {
        const infoCompleta = resDetalle.data.producto;
        this.llenarFormulario({ ...p, Descripcion: infoCompleta.Descripcion });
      },
      error: (err) => {
        console.error('No se pudo obtener la descripción', err);
        this.llenarFormulario(p); 
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
    this.cargando.set(false);
  }

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

  async guardarCambios() {
    if (this.productoForm.valid && this.productoIdDb && this.skuIdUrl) {
      this.guardando.set(true);
      const datosRaw = this.productoForm.getRawValue();

      let imagenFinalURL = this.imagenOriginal;

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
          imagenFinalURL = data.secure_url;
        }

        const payloadProducto = {
          Nombre: datosRaw.Nombre,
          Descripcion: datosRaw.Descripcion,
          CategoriaID: this.categoriaOriginal,
          ImagenURL: imagenFinalURL, 
          Estado: this.estadoOriginal
        };

        const payloadSKU = {
          Tamano: datosRaw.Tamano,
          PrecioRegular: Number(datosRaw.PrecioRegular),
          PrecioMayoreo: Number(datosRaw.PrecioRegular),
          Stock: Number(datosRaw.StockActual),
          StockMinimo: Number(datosRaw.StockMinimo) || 5
        };

        this.catalogoService.actualizarProducto(this.productoIdDb, payloadProducto).subscribe({
          next: () => {
            this.catalogoService.actualizarSKU(Number(this.skuIdUrl!), payloadSKU).subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Actualizado!',
                  text: 'El producto se ha modificado con éxito.',
                  icon: 'success',
                  confirmButtonText: '¡Genial!',
                  confirmButtonColor: '#4CAF50'
                }).then(() => {
                  this.guardando.set(false);
                  this.router.navigate(['/admin/catalogo']);
                });
              },
              error: (err) => {
                console.error(err);
                Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al actualizar el inventario.',
                  icon: 'error',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#E75A88'
                });
                this.guardando.set(false);
              }
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron actualizar los datos generales del producto.',
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
          title: 'Error de conexión',
          text: 'Hubo un problema al subir la nueva imagen. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88'
        });
        this.guardando.set(false);
      }

    } else {
      Swal.fire({
        title: 'Datos inválidos',
        text: 'Por favor, revisa que no haya precios negativos, que el stock sea un número entero y que los campos requeridos estén llenos.',
        icon: 'warning',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#E75A88'
      });
      this.productoForm.markAllAsTouched();
    }
  }
}