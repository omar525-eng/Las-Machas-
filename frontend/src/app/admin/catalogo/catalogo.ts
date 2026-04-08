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
  productos: Producto[] = [];
  productosRespaldo: Producto[] = []; 
  productoADesactivar: Producto | null = null; 
  mostrarInactivos: boolean = false; 
  
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
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data ? respuesta.data : respuesta;
        this.productos = datos;
        this.productosRespaldo = datos; 
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Hubo un error de conexión:', error)
    });
  }

  filtrarProductos(textoBusqueda: string) {
    textoBusqueda = textoBusqueda.toLowerCase();

    if (!textoBusqueda) {
      this.productos = [...this.productosRespaldo];
      return;
    }

    this.productos = this.productosRespaldo.filter((producto: any) => {
      const nombre = producto.Nombre?.toLowerCase() || '';
      const tamano = producto.Tamano?.toLowerCase() || '';
      
      return nombre.includes(textoBusqueda) || tamano.includes(textoBusqueda);
    });
  }

  toggleInactivos() {
    this.mostrarInactivos = !this.mostrarInactivos;
    
    if (this.mostrarInactivos) {
      console.log("Pidiendo salsas inactivas");
      
      this.catalogoService.obtenerInactivos().subscribe({
        next: (respuesta: any) => {
          console.log('Llegaron los inactivos:) Esto mandó el back:', respuesta); 
          
          const datos = respuesta.data ? respuesta.data : respuesta;
          this.productos = datos;
          this.productosRespaldo = datos;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fatal al conectar con la ruta de inactivos:', error);
        }
      });
    } else {
      this.cargarActivos();
    }
  }

  abrirModal(producto: Producto) {
    this.productoADesactivar = producto;
  }

  cerrarModal() {
    this.productoADesactivar = null;
  }

  // ---> FUNCIÓN MULTIUSOS: ACTIVA O DESACTIVA <---
  confirmarDesactivacion() {
    if (this.productoADesactivar) {
      
      // Si estamos viendo inactivos, el nuevo estado será 1 (Activar). Si no, será 0 (Desactivar).
      const nuevoEstado = this.mostrarInactivos ? 1 : 0;
      const accionPalabra = this.mostrarInactivos ? 'activado' : 'desactivado';

      this.catalogoService.actualizarEstadoSKU((this.productoADesactivar as any).SkuID, nuevoEstado).subscribe({
        next: () => {
          alert(`¡La salsa "${this.productoADesactivar?.Nombre}" se ha ${accionPalabra}!`);
          this.cerrarModal();
          
          // Recargamos la lista en la que estamos actualmente para que el producto desaparezca visualmente
          if (this.mostrarInactivos) {
             // Si estaba en inactivos, al activarlo debe desaparecer de esta lista.
             // Truco: apagamos la bandera y volvemos a llamar a toggleInactivos para forzar la recarga
             this.mostrarInactivos = false;
             this.toggleInactivos();
          } else {
             // Si estaba en activos, al desactivarlo recargamos activos
             this.cargarActivos();
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado del SKU:', error);
          alert('Hubo un error en el servidor al intentar cambiar el estado de la salsa.');
        }
      });
    }
  }
}