import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.http.get('http://localhost:3000/api/pedidos').subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data) {
          this.pedidos = respuesta.data;
          this.pedidosFiltrados = this.pedidos; 
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
      this.pedidosFiltrados = this.pedidos.filter(p => p.Estado === 'Entregado');
    } else if (filtro === 'En Proceso') {
      this.pedidosFiltrados = this.pedidos.filter(p => p.Estado !== 'Entregado'); 
    }
  }
  marcarComoEntregado(pedido: any) {
    const confirmar = confirm(`¿Seguro que quieres marcar el folio #${pedido.PedidoID || pedido.id || ''} como Entregado?`);
    if (!confirmar) return;

    pedido.Estado = 'Entregado';
    
    this.cambiarFiltro(this.filtroActual);

    const idPedido = pedido.PedidoID || pedido.id;
    this.http.put(`http://localhost:3000/api/pedidos/${idPedido}`, { Estado: 'Entregado' }).subscribe({
      next: (res) => {
        console.log('¡El backend de Papu lo guardó con éxito!');
      },
      error: (err) => {
        console.log('Aviso: Visualmente ya funciona, pero falta que Papu/Héctor habiliten el PUT en el back.');
      }
    });
  }
}
