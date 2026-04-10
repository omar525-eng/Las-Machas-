import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

import { Catalogo } from './admin/catalogo/catalogo';
import { AgregarProducto } from './admin/agregar-producto/agregar-producto';
import { TableroPedidos } from './admin/tablero-pedidos/tablero-pedidos';
import { DetallePedido } from './admin/detalle-pedido/detalle-pedido';
import { ActualizarProducto } from './admin/actualizar-producto/actualizar-producto';
import { DetalleProductoAdmin } from './admin/detalle-producto/detalle-producto';

import { Login } from './auth/login/login';
import { RegistroComponent } from './auth/login/registro.component';
import { Buscador } from './cliente/buscador/buscador'; 
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';

import { MisDatosComponent as MisDatosCliente } from './cliente/mis-datos/mis-datos';

export const routes: Routes = [

  { path: '', redirectTo: 'admin/catalogo', pathMatch: 'full' },

  // --- RUTAS ADMIN ---
  // ✅ Ahora usa el componente de Cliente y tiene protección de Guard
  { path: 'admin/mis-datos', component: MisDatosCliente, canActivate: [authGuard] },
  
  { path: 'admin/catalogo', component: Catalogo, canActivate: [authGuard] }, 
  { path: 'admin/agregar-producto', component: AgregarProducto, canActivate: [authGuard] },
  { path: 'admin/tablero-pedidos', component: TableroPedidos, canActivate: [authGuard] },
  { path: 'admin/detalle-pedido/:id', component: DetallePedido, canActivate: [authGuard] }, 
  { path: 'admin/detalle-pedido', component: DetallePedido, canActivate: [authGuard] }, 
  { path: 'admin/actualizar-producto/:id', component: ActualizarProducto, canActivate: [authGuard] },
{ path: 'admin/detalle-producto/:id', component: DetalleProductoAdmin, canActivate: [authGuard] },

  // --- RUTAS CLIENTE Y AUTH ---
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'tienda', component: Buscador },
  { path: 'producto/:id', component: DetalleProducto },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },
  { path: 'perfil', component: MisDatosCliente },

  { path: '**', redirectTo: 'admin/catalogo' }
];