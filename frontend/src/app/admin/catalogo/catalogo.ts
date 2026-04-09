import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { BusquedaService } from '../../core/services/busqueda.service';
import { Producto } from '../../core/models/producto.interface';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  productos: any[] = []; 
  productosRespaldo: any[] = []; 
  productoADesactivar: any = null; 
  mostrarInactivos: boolean = false; 
  cargando: boolean = false;

  private catalogoService = inject(CatalogoService);
  private busquedaService = inject(BusquedaService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarActivos();

    this.busquedaService.terminoActual.subscribe(termino => {
      this.filtrarProductos(termino);
    });
  }

  cargarActivos() {
    this.cargando = true;
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data ? respuesta.data : respuesta;
        this.productos = datos;
        this.productosRespaldo = datos; 
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Hubo un error de conexión:', error);
        this.cargando = false;
      }
    });
  }

  filtrarProductos(textoBusqueda: string) {
    textoBusqueda = textoBusqueda.toLowerCase();

    if (!textoBusqueda) {
      this.productos = [...this.productosRespaldo];
      return;
    }

    this.productos = this.productosRespaldo.filter((producto: any) => {
      const nombre = (producto.Nombre || producto.NombreProducto || '').toLowerCase();
      const tamano = (producto.Tamano || producto.Presentacion || '').toLowerCase();
      
      return nombre.includes(textoBusqueda) || tamano.includes(textoBusqueda);
    });
  }

  toggleInactivos() {
    this.mostrarInactivos = !this.mostrarInactivos;
    this.cargando = true; 
    
    if (this.mostrarInactivos) {
      this.catalogoService.obtenerInactivos().subscribe({
        next: (respuesta: any) => {
          const datos = respuesta.data ? respuesta.data : respuesta;
          this.productos = datos;
          this.productosRespaldo = datos;
          this.cargando = false; 
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fatal al conectar con la ruta de inactivos:', error);
          this.cargando = false;
        }
      });
    } else {
      this.cargarActivos();
    }
  }

  abrirModal(producto: any) {
    console.log("Salsa seleccionada:", producto); 
    this.productoADesactivar = producto;
    
    this.cdr.detectChanges(); 
  }

  cerrarModal() {
    this.productoADesactivar = null;
    this.cdr.detectChanges();
  }

  confirmarDesactivacion() {
    if (this.productoADesactivar) {
      const skuId = this.productoADesactivar.SkuID;
      const nombreSalsa = this.productoADesactivar.Nombre || this.productoADesactivar.NombreProducto || 'Esta salsa';
      
      if (!skuId) {
        alert('Error: No se detectó el SkuID. Asegúrate de que el backend lo esté enviando.');
        return;
      }

      const nuevoEstado = this.mostrarInactivos ? 1 : 0;
      const accionPalabra = this.mostrarInactivos ? 'activado' : 'desactivado';

      this.catalogoService.actualizarEstadoSKU(skuId, nuevoEstado).subscribe({
        next: () => {
          alert(`¡${nombreSalsa} se ha ${accionPalabra}!`);
          this.cerrarModal();
          
          setTimeout(() => {
            if (this.mostrarInactivos) {
               this.mostrarInactivos = false;
               this.toggleInactivos();
            } else {
               this.cargarActivos();
            }
          }, 500);

        },
        error: (error) => {
          console.error('Error al cambiar el estado del SKU:', error);
          alert('Hubo un error en el servidor al intentar cambiar el estado de la salsa.');
          this.cerrarModal(); 
        }
      });
    }
  }
}