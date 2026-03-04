import { Routes } from '@angular/router';

// Tus importaciones (Admin)
import { Catalogo } from './admin/catalogo/catalogo';
import { AgregarProducto } from './admin/agregar-producto/agregar-producto';
import { TableroPedidos } from './admin/tablero-pedidos/tablero-pedidos';

// Las importaciones de Mike (Cliente y Auth)
import { Login } from './auth/login/login';
import { Buscador } from './cliente/buscador/buscador';
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';

export const routes: Routes = [
  // --- RUTA POR DEFECTO (Para que inicie en el catálogo) ---
  { path: '', redirectTo: 'admin/catalogo', pathMatch: 'full' },

  // --- TUS RUTAS (ADMIN) ---
  { path: 'admin/catalogo', component: Catalogo },
  { path: 'admin/agregar-producto', component: AgregarProducto },
  { path: 'admin/tablero-pedidos', component: TableroPedidos },

  // --- LAS RUTAS DE MIKE (CLIENTE) ---
  { path: 'login', component: Login },
  { path: 'tienda', component: Buscador },
  { path: 'producto', component: DetalleProducto },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },

  // --- RUTA COMODÍN (Si alguien escribe mal la dirección) ---
  { path: '**', redirectTo: 'admin/catalogo' }
];