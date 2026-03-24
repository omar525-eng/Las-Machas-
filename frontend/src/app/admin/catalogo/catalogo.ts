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
}