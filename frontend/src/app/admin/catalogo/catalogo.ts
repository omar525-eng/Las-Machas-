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

  confirmarDesactivacion() {
    if (this.productoADesactivar) {
      const productoModificado = {
        ...this.productoADesactivar,
        Estado: 0 
      };

      this.catalogoService.actualizarProducto(this.productoADesactivar.ProductoID, productoModificado).subscribe({
        next: () => {
          alert(`¡La salsa "${this.productoADesactivar?.Nombre}" se ha desactivado!`);
          this.cerrarModal();
          this.cargarActivos();
        },
        error: (error) => {
          console.error('Error al desactivar:', error);
          alert('Hubo un error en el servidor al intentar desactivar la salsa.');
        }
      });
    }
  }
}