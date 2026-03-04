import { Routes } from '@angular/router';

// Tus importaciones (Admin)
import { Catalogo } from './admin/catalogo/catalogo';
import { AgregarProducto } from './admin/agregar-producto/agregar-producto';
import { TableroPedidos } from './admin/tablero-pedidos/tablero-pedidos';
import { DetallePedido } from './admin/detalle-pedido/detalle-pedido';
import { ActualizarProducto } from './admin/actualizar-producto/actualizar-producto';
import { DetalleProductoAdmin } from './admin/detalle-producto/detalle-producto';

// Las importaciones de Mike (Cliente y Auth)
import { Login } from './auth/login/login';
import { Buscador } from './cliente/buscador/buscador';
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';

export const routes: Routes = [
  // --- RUTA POR DEFECTO ---
  { path: '', redirectTo: 'admin/catalogo', pathMatch: 'full' },

  // --- TUS RUTAS (ADMIN) ---
  { path: 'admin/catalogo', component: Catalogo },
  { path: 'admin/agregar-producto', component: AgregarProducto },
  { path: 'admin/tablero-pedidos', component: TableroPedidos },
  { path: 'admin/detalle-pedido', component: DetallePedido },
  { path: 'admin/actualizar-producto', component: ActualizarProducto },
  { path: 'admin/detalle-producto', component: DetalleProductoAdmin },

  // --- LAS RUTAS DE MIKE (CLIENTE) ---
  { path: 'login', component: Login },
  { path: 'tienda', component: Buscador },
  { path: 'producto', component: DetalleProducto },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },

  // --- RUTA COMODÍN ---
  { path: '**', redirectTo: 'admin/catalogo' }
];