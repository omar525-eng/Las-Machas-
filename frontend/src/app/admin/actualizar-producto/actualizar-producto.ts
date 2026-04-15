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

  skuIdUrl: string | null = null;
  
  // Variables para no perder los datos originales al guardar
  productoIdDb: number | null = null;
  categoriaOriginal: number = 1;
  imagenOriginal: string | null = null;
  estadoOriginal: number = 1;

  cargando = true;

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
    this.skuIdUrl = this.route.snapshot.paramMap.get('id');

    if (this.skuIdUrl) {
      this.cargarDatosDelProducto(this.skuIdUrl);
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
          this.obtenerDescripcion(productoActivo);
        } else {
          this.catalogoService.obtenerInactivos().subscribe({
            next: (resInactivos: any) => {
              const inactivos = resInactivos.data || resInactivos;
              const productoInactivo = inactivos.find((p: any) => p.SkuID == id);

              if (productoInactivo) {
                this.obtenerDescripcion(productoInactivo);
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

  obtenerDescripcion(p: any) {
    // 1. Guardamos los datos originales tal como vienen de la base de datos
    this.productoIdDb = p.ProductoID;
    this.categoriaOriginal = p.CategoriaID || 1;
    this.imagenOriginal = p.ImagenURL || null;
    this.estadoOriginal = p.Estado !== undefined ? p.Estado : 1;

    // 2. Llamamos al detalle para traernos la descripción
    this.catalogoService.obtenerDetalleProducto(this.productoIdDb!.toString()).subscribe({
      next: (resDetalle: any) => {
        const infoCompleta = resDetalle.data.producto;
        // Llenamos el formulario inyectando la descripción que acabamos de traer
        this.llenarFormulario({ ...p, Descripcion: infoCompleta.Descripcion });
      },
      error: (err) => {
        console.error('No se pudo obtener la descripción', err);
        this.llenarFormulario(p); // Llenamos con lo que hay si falla la descripción
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
    
    this.cargando = false;
    this.cdr.detectChanges();
  }

  guardarCambios() {
    if (this.productoForm.valid && this.productoIdDb && this.skuIdUrl) {

      const datosRaw = this.productoForm.getRawValue();

      // Aquí mandamos los datos originales para que no desaparezca de la BD
      const payloadProducto = {
        Nombre: datosRaw.Nombre,
        Descripcion: datosRaw.Descripcion,
        CategoriaID: this.categoriaOriginal, // Se mantiene la original
        ImagenURL: this.imagenOriginal,      // Se mantiene la foto original
        Estado: this.estadoOriginal          // Se mantiene activo/inactivo
      };

      const payloadSKU = {
        Tamano: datosRaw.Tamano,
        PrecioRegular: Number(datosRaw.PrecioRegular),
        PrecioMayoreo: Number(datosRaw.PrecioRegular),
        Stock: Number(datosRaw.StockActual),
        StockMinimo: Number(datosRaw.StockMinimo) || 5
      };

      // Actualizamos el Producto usando su ID real
      this.catalogoService.actualizarProducto(this.productoIdDb, payloadProducto).subscribe({
        next: () => {
          // Actualizamos el SKU usando el ID de la URL
          this.catalogoService.actualizarSKU(Number(this.skuIdUrl), payloadSKU).subscribe({
            next: () => {
              alert('Producto actualizado con éxito');
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

    } else {
      alert('Completa los campos requeridos');
    }
  }
}