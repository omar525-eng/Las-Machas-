import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';
import Swal from 'sweetalert2';

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
  private router = inject(Router);
  pedidoId: string | null = null;
  
  // Modernizamos a Signals
  cabecera = signal<any>(null);
  detalle = signal<any[]>([]);
  cargando = signal<boolean>(true);

  // Calculamos el total automáticamente en el Front
  totalPedido = computed(() => {
    const items = this.detalle();
    if (!items || items.length === 0) return 0;
    
    // Sumamos el SubtotalLinea de cada producto
    return items.reduce((acc, item) => acc + (Number(item.SubtotalLinea) || 0), 0);
  });

  ngOnInit() {
    this.pedidoId = this.route.snapshot.paramMap.get('id');

    if (this.pedidoId) {
      this.cargarDetalle(this.pedidoId);
    } else {
      console.warn('No se recibió ningún ID de pedido en la URL.');
      this.cargando.set(false);
    }
  }

  cargarDetalle(id: string) {
    this.catalogoService.obtenerDetallePedido(id).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.cabecera.set(res.data.cabecera);
          this.detalle.set(res.data.detalle);
        } else {
          // Alerta si el pedido no existe
          Swal.fire({
            title: 'No encontrado',
            text: 'No pudimos encontrar la información de este pedido.',
            icon: 'info',
            confirmButtonText: 'Regresar',
            confirmButtonColor: '#E75A88'
          }).then(() => {
            this.router.navigate(['/admin/tablero-pedidos']);
          });
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el detalle', err);
        this.cargando.set(false);
        // Alerta de error de conexión
        Swal.fire({
          title: 'Error de red',
          text: 'Hubo un fallo al conectar con el servidor.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#E75A88'
        });
      }
    });
  }

  cambiarEstatus(nuevoEstatus: string) {
    if (!this.pedidoId) return;
    
    // SweetAlert de confirmación para cambiar el estatus
    Swal.fire({
      title: `¿Marcar como ${nuevoEstatus}?`,
      text: `El estatus del pedido cambiará a ${nuevoEstatus} de forma permanente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nuevoEstatus === 'Entregado' ? '#4CAF50' : '#E75A88',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        // Actualización optimista (cambio visual rápido)
        const currentCabecera = this.cabecera();
        this.cabecera.set({ ...currentCabecera, Estatus: nuevoEstatus });

        this.catalogoService.actualizarEstatusPedido(Number(this.pedidoId), nuevoEstatus).subscribe({
          next: () => {
            // Alerta de éxito pequeña
            Swal.fire({
              title: `¡${nuevoEstatus}!`,
              text: `Estatus actualizado correctamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al actualizar', err);
            // Alerta de error si falla la BD
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el estatus. Intenta de nuevo.',
              icon: 'error',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#E75A88'
            });
            // Revertir si falla
            this.cabecera.set(currentCabecera);
          }
        });
      }
    });
  }
}