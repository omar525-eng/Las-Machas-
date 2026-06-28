import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-tablero-pedidos',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './tablero-pedidos.html',
  styleUrl: './tablero-pedidos.css'
})
export class TableroPedidos implements OnInit, OnDestroy {
  private catalogoService = inject(CatalogoService);
  private intervaloId: any;

  // Signals que reemplazan las variables normales
  pedidos = signal<any[]>([]);
  filtroActual = signal<string>('Todos');

  // Computed: Se auto-calcula instantáneamente cuando cambia la lista o el filtro
  pedidosFiltrados = computed(() => {
    const filtro = this.filtroActual();
    const lista = this.pedidos();

    if (filtro === 'Todos') return lista;
    if (filtro === 'Entregados') return lista.filter(p => p.Estatus === 'Entregado');
    if (filtro === 'Cancelados') return lista.filter(p => p.Estatus === 'Cancelado');
    return lista.filter(p => p.Estatus !== 'Entregado' && p.Estatus !== 'Cancelado');
  });

  ngOnInit() {
    this.cargarPedidos();
    // Recarga cada 3 segundos
    this.intervaloId = setInterval(() => {
      this.cargarPedidos();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervaloId) clearInterval(this.intervaloId);
  }

  cargarPedidos() {
    this.catalogoService.obtenerPedidos().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data) {
          this.pedidos.set(respuesta.data);
        }
      },
      error: (error) => console.error('Hubo un error al traer los pedidos:', error)
    });
  }

  cambiarFiltro(filtro: string) {
    this.filtroActual.set(filtro);
  }

  marcarComoEntregado(pedido: any) {
    const idPedido = pedido.PedidoID || pedido.id;
    
    // SweetAlert para confirmar la acción
    Swal.fire({
      title: '¿Confirmar entrega?',
      text: `¿Seguro que quieres marcar el folio #${idPedido} como Entregado?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50', // Verde de éxito
      cancelButtonColor: '#9e9e9e', // Gris para cancelar
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Pone el botón de confirmar a la derecha
    }).then((result) => {
      if (result.isConfirmed) {
        
        // Actualización optimista: Cambiamos el estatus visualmente al instante
        const listaActualizada = this.pedidos().map(p => {
          if ((p.PedidoID || p.id) === idPedido) return { ...p, Estatus: 'Entregado' };
          return p;
        });
        this.pedidos.set(listaActualizada);

        // Mandamos la petición al servidor
        this.catalogoService.actualizarEstatusPedido(idPedido, 'Entregado').subscribe({
          next: (res) => {
            console.log('Estatus actualizado:', res);
            // Alerta de éxito cortita (se cierra sola)
            Swal.fire({
              title: '¡Entregado!',
              text: `El pedido #${idPedido} ha sido marcado como entregado.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error:', err);
            // 🔥 Alerta de error si falla la BD
            Swal.fire({
              title: 'Error de sincronización',
              text: 'Hubo un error al guardar el estatus. Se revertirá el cambio.',
              icon: 'error',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#E75A88' // Rosa Machas
            });
            this.cargarPedidos(); // Revertimos si falla
          }
        });
      }
    });
  }
}