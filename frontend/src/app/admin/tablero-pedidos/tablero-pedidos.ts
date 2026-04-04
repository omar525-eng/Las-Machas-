import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../core/services/catalogo.service'; 

@Component({
  selector: 'app-tablero-pedidos',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './tablero-pedidos.html',
  styleUrl: './tablero-pedidos.css'
})
export class TableroPedidos implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = []; 
  filtroActual: string = 'Todos'; 

  private catalogoService = inject(CatalogoService); 
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.catalogoService.obtenerPedidos().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data) {
          this.pedidos = respuesta.data;
          this.cambiarFiltro(this.filtroActual); 
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Hubo un error al traer los pedidos:', error);
      }
    });
  }

  cambiarFiltro(filtro: string) {
    this.filtroActual = filtro;

    if (filtro === 'Todos') {
      this.pedidosFiltrados = this.pedidos;
    } else if (filtro === 'Entregados') {
      this.pedidosFiltrados = this.pedidos.filter(p => p.Estatus === 'Entregado');
    } else if (filtro === 'En Proceso') {
      this.pedidosFiltrados = this.pedidos.filter(p => p.Estatus !== 'Entregado'); 
    }
  }

  marcarComoEntregado(pedido: any) {
    const idPedido = pedido.PedidoID || pedido.id;
    const confirmar = confirm(`¿Seguro que quieres marcar el folio #${idPedido} como Entregado?`);
    if (!confirmar) return;

    pedido.Estatus = 'Entregado';
    this.cambiarFiltro(this.filtroActual);

    this.catalogoService.actualizarEstatusPedido(idPedido, 'Entregado').subscribe({
      next: (res) => {
        console.log('¡El backend de Papu actualizó el estatus con éxito!', res);
      },
      error: (err) => {
        console.error('Falló la conexión con el backend:', err);
        alert('Hubo un error al guardar el estatus en la base de datos.');
      }
    });
  }
}