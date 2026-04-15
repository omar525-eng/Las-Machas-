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
  imagenActual: string | null = null;

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
    
    this.imagenActual = p.ImagenURL || null;

    this.cargando = false;
    this.cdr.detectChanges();
  }

  guardarCambios() {
    if (this.productoForm.valid && this.productoId) {

      const datosRaw = this.productoForm.getRawValue();

      const payloadProducto = {
        Nombre: datosRaw.Nombre,
        Descripcion: datosRaw.Descripcion,
        CategoriaID: 1,
        ImagenURL: this.imagenActual, 
        Estado: 1
      };

      const payloadSKU = {
        Tamano: datosRaw.Tamano,
        PrecioRegular: Number(datosRaw.PrecioRegular),
        PrecioMayoreo: Number(datosRaw.PrecioRegular),
        Stock: Number(datosRaw.StockActual),
        StockMinimo: Number(datosRaw.StockMinimo) || 5
      };

      this.catalogoService.actualizarProducto(Number(this.productoId), payloadProducto).subscribe({
        next: () => {
          this.catalogoService.actualizarSKU(Number(this.productoId), payloadSKU).subscribe({
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