import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SearchService } from '../../core/services/search.service'; 
import Swal from 'sweetalert2'; // 

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  private searchService = inject(SearchService);

  // Estados
  productosRespaldo = signal<any[]>([]); 
  mostrarInactivos: boolean = false; 
  cargando = signal<boolean>(false);

  // Filtro Automático
  productosFiltrados = computed(() => {
    const term = this.searchService.searchTerm()?.toLowerCase() || '';
    const lista = this.productosRespaldo();

    if (!term) return lista;

    return lista.filter((producto: any) => {
      const nombre = (producto.Nombre || producto.NombreProducto || '').toLowerCase();
      const tamano = (producto.Tamano || producto.Presentacion || '').toLowerCase();
      return nombre.includes(term) || tamano.includes(term);
    });
  });

  ngOnInit() {
    this.cargarActivos();
  }

  cargarActivos() {
    this.cargando.set(true); 
    this.catalogoService.obtenerProductos().subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data ? respuesta.data : respuesta;
        this.productosRespaldo.set(datos); 
        this.cargando.set(false); 
      },
      error: (error) => {
        console.error('Hubo un error de conexión:', error);
        this.cargando.set(false);
        this.notificarError('No se pudieron cargar los productos activos.');
      }
    });
  }

  toggleInactivos() {
    this.mostrarInactivos = !this.mostrarInactivos;
    this.cargando.set(true); 
    
    if (this.mostrarInactivos) {
      this.catalogoService.obtenerInactivos().subscribe({
        next: (respuesta: any) => {
          const datos = respuesta.data ? respuesta.data : respuesta;
          this.productosRespaldo.set(datos);
          this.cargando.set(false); 
        },
        error: (error) => {
          console.error('Error fatal al conectar:', error);
          this.cargando.set(false);
          this.notificarError('No se pudieron cargar los productos inactivos.');
        }
      });
    } else {
      this.cargarActivos();
    }
  }

  solicitarCambioEstado(producto: any) {
    const skuId = producto.SkuID;
    const nombreSalsa = producto.Nombre || producto.NombreProducto || 'Esta salsa';
    const esInactivo = this.mostrarInactivos;
    const accionPalabra = esInactivo ? 'activar' : 'desactivar';
    const colorBoton = esInactivo ? '#4CAF50' : '#E75A88';

    if (!skuId) {
      this.notificarError('No se detectó el identificador del producto.');
      return;
    }

    // Alerta de confirmación
    Swal.fire({
      title: `¿Quieres ${accionPalabra} el producto?`,
      text: `${nombreSalsa} cambiará su estado en el catálogo.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colorBoton,
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: `Sí, ${accionPalabra}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarCambioEstado(skuId, nombreSalsa, esInactivo);
      }
    });
  }

  private ejecutarCambioEstado(skuId: number, nombre: string, esInactivo: boolean) {
    const nuevoEstado = esInactivo ? 1 : 0;
    const resultadoPalabra = esInactivo ? 'activado' : 'desactivado';

    this.catalogoService.actualizarEstadoSKU(skuId, nuevoEstado).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Listo!',
          text: `¡${nombre} se ha ${resultadoPalabra}!`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // Recarga suave de la lista
        setTimeout(() => {
          if (this.mostrarInactivos) {
             this.mostrarInactivos = false;
             this.toggleInactivos();
          } else {
             this.cargarActivos();
          }
        }, 500);
      },
      error: (error) => {
        console.error('Error al cambiar el estado:', error);
        this.notificarError('Hubo un error en el servidor al procesar el cambio.');
      }
    });
  }

  private notificarError(mensaje: string) {
    Swal.fire({
      title: '¡Ups!',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#E75A88'
    });
  }
}