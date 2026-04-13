import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProductoAdmin implements OnInit {
  producto: any = null;
  cargando = true;

  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalle(id);
    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarDetalle(id: string) {
    this.catalogoService.obtenerDetalleProducto(id).subscribe({
      next: (res: any) => {
        const datos = res.data || res;
        
        // 1. Sacamos la información de sus respectivas "cajas"
        const infoProducto = datos.producto || {};
        const infoSku = (datos.skus && datos.skus.length > 0) ? datos.skus[0] : {};

        // 2. Juntamos todo en un solo objeto para que el HTML funcione perfecto
        this.producto = {
          ...infoProducto,
          ...infoSku,
          // Aseguramos que los nombres coincidan con los que pusimos en el HTML
          Nombre: infoProducto.NombreProducto || infoProducto.Nombre,
          Descripcion: infoProducto.Descripcion,
          ImagenURL: infoProducto.ImagenURL
        };

        console.log('DATOS LISTOS PARA MOSTRAR:', this.producto);
        
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar la ficha técnica completa:', err);
        this.cargando = false; 
        this.cdr.detectChanges();
      }
    });
  }

  regresar() {
    this.location.back(); 
  }
}