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

  productoForm = new FormGroup({
    Nombre: new FormControl({value: '', disabled: true}),
    Descripcion: new FormControl(''),
    Categoria: new FormControl({value: '', disabled: true}),
    Tamano: new FormControl({value: '', disabled: true}),
    PrecioRegular: new FormControl('', Validators.required),
    StockActual: new FormControl('', Validators.required),
    StockMinimo: new FormControl('')
  });

  ngOnInit() {
    this.productoId = this.route.snapshot.paramMap.get('id');

    if (this.productoId) {
      this.cargarDatosDelProducto(this.productoId);
    } else {
      console.warn('Fallo: No se recibió ID.');
      this.cargando = false;
      this.cdr.detectChanges(); 
    }
  }

  cargarDatosDelProducto(id: string) {
    this.catalogoService.obtenerProductos().subscribe({
      next: (res: any) => {
        const productos = res.data || res; 
        const productoEncontrado = productos.find((p: any) => p.SkuID == id);

        if (productoEncontrado) {
          this.productoForm.patchValue({
            Nombre: productoEncontrado.Nombre || productoEncontrado.NombreProducto || 'Nombre no disponible',
            Descripcion: productoEncontrado.Descripcion || '',
            Categoria: productoEncontrado.Categoria || 'General',
            Tamano: productoEncontrado.Tamano || productoEncontrado.Presentacion || 'N/A',
            PrecioRegular: productoEncontrado.Precio || productoEncontrado.PrecioRegular || '0',
            StockActual: productoEncontrado.Stock || productoEncontrado.StockActual || '0',
            StockMinimo: '5'
          });
        } else {
          alert('No se encontraron los datos de este producto.');
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR al cargar los datos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarCambios() {
    if (this.productoForm.valid && this.productoId) {
      const datosRaw = this.productoForm.getRawValue();
      
      const payloadSKU = {
        Tamano: datosRaw.Tamano,
        PrecioRegular: Number(datosRaw.PrecioRegular),
        PrecioMayoreo: Number(datosRaw.PrecioRegular), 
        Stock: Number(datosRaw.StockActual),
        StockMinimo: Number(datosRaw.StockMinimo) || 5
      };

      console.log('Enviando cambios...');

      this.catalogoService.actualizarProducto(Number(this.productoId), datosRaw).subscribe({
        next: () => {
          this.catalogoService.actualizarSKU(Number(this.productoId), payloadSKU).subscribe({
            next: () => {
              alert('¡Salsa actualizada con éxito!');
              
              setTimeout(() => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/admin/catalogo']);
                });
              }, 600);
            },
            error: (err) => {
              console.error('Error en SKU:', err);
              alert('Se guardó la descripción pero falló el precio.');
            }
          });
        },
        error: (err) => {
          console.error('Error en Producto:', err);
          alert('Error al conectar con el servidor.');
        }
      });
    } else {
      alert('Completa los campos obligatorios.');
    }
  }
}