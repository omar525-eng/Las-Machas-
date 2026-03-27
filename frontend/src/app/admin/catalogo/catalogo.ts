import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
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
  productoADesactivar: Producto | null = null; 
  
  mostrarInactivos: boolean = false; 
  
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data) {
          this.productos = respuesta.data;
        } else {
          this.productos = respuesta;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Hubo un error de conexión:', error);
      }
    });
  }

  toggleInactivos() {
    this.mostrarInactivos = !this.mostrarInactivos;
    console.log('¿Ver inactivos?:', this.mostrarInactivos);
  }

  abrirModal(producto: Producto) {
    this.productoADesactivar = producto;
  }

  cerrarModal() {
    this.productoADesactivar = null;
  }

  confirmarDesactivacion() {
    if (this.productoADesactivar) {
      console.log('Esperando al backend para desactivar:', this.productoADesactivar.Nombre);
      alert(`¡La salsa "${this.productoADesactivar.Nombre}" se ha desactivado!`);
      this.cerrarModal();
    }
  }
}