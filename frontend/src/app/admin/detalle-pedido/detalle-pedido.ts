import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './detalle-pedido.html',
  styleUrl: './detalle-pedido.css'
})
export class DetallePedido implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef); // <--- El codazo para Angular

  pedidoId: string | null = null;
  cabecera: any = null;
  detalle: any[] = [];
  cargando = true;

  ngOnInit() {
    this.pedidoId = this.route.snapshot.paramMap.get('id');

    if (this.pedidoId) {
      this.cargarDetalle(this.pedidoId);
    } else {
      console.warn('No se recibió ningún ID de pedido en la URL.');
      this.cargando = false;
      this.cdr.detectChanges(); // Actualizamos la vista
    }
  }

  cargarDetalle(id: string) {
    this.catalogoService.obtenerDetallePedido(id).subscribe({
      next: (res: any) => {
        console.log('¡Llegó el pedido desde el backend!', res); // Chismoso F12
        
        if (res && res.data) {
          this.cabecera = res.data.cabecera;
          this.detalle = res.data.detalle;
        }
        
        this.cargando = false;
        this.cdr.detectChanges(); // <--- ¡AQUÍ ESTÁ LA MAGIA PARA QUITAR LA CARGA!
      },
      error: (err) => {
        console.error('Error al cargar el detalle', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Actualizamos la vista aunque haya error
      }
    });
  }

  cambiarEstatus(nuevoEstatus: string) {
    if (!this.pedidoId) return;
    
    const confirmar = confirm(`¿Seguro que quieres marcar el pedido como ${nuevoEstatus}?`);
    if (!confirmar) return;

    this.catalogoService.actualizarEstatusPedido(Number(this.pedidoId), nuevoEstatus).subscribe({
      next: () => {
        this.cabecera.Estatus = nuevoEstatus;
        this.cdr.detectChanges(); // Actualizamos la etiqueta de estatus visualmente
        alert(`¡Pedido marcado como ${nuevoEstatus}!`);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('Hubo un error al actualizar el pedido.');
      }
    });
  }
}