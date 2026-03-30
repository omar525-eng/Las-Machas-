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
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data) {
          this.productos = respuesta.data;
          this.productosRespaldo = respuesta.data; 
        } else {
          this.productos = respuesta;
          this.productosRespaldo = respuesta; 
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Hubo un error de conexión:', error);
      }
    });

    this.busquedaService.terminoActual.subscribe(termino => {
      this.filtrarProductos(termino);
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
  }

  abrirModal(producto: Producto) {
    this.productoADesactivar = producto;
  }

  cerrarModal() {
    this.productoADesactivar = null;
  }

  confirmarDesactivacion() {
    if (this.productoADesactivar) {
      alert(`¡La salsa "${this.productoADesactivar.Nombre}" se ha desactivado!`);
      this.cerrarModal();
    }
  }
}