import { Routes } from '@angular/router';

// --- GUARDS (de Mike, se integran) ---
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';


// --- IMPORTACIONES NAOMI (ADMIN) ---
import { MisDatosComponent } from './admin/mis datos/mis-datos'; 
import { Catalogo } from './admin/catalogo/catalogo';
import { AgregarProducto } from './admin/agregar-producto/agregar-producto';
import { TableroPedidos } from './admin/tablero-pedidos/tablero-pedidos';
import { DetallePedido } from './admin/detalle-pedido/detalle-pedido';
import { ActualizarProducto } from './admin/actualizar-producto/actualizar-producto';
import { DetalleProductoAdmin } from './admin/detalle-producto/detalle-producto';


// --- IMPORTACIONES MIKE (CLIENTE Y AUTH) ---
import { Login } from './auth/login/login';
import { RegistroComponent } from './auth/login/registro.component';

import { Buscador } from './cliente/buscador/buscador'; // se mantiene de Naomi
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';

// 🔥 de Mike (nuevo)
import { CatalogoCliente } from './cliente/catalogo_cliente/catalogocliente';
import { MisDatosComponent as MisDatosCliente } from './cliente/mis-datos/mis-datos';


export const routes: Routes = [

  // --- RUTA POR DEFECTO (SE RESPETA NAOMI) ---
  { path: '', redirectTo: 'admin/catalogo', pathMatch: 'full' },


  // --- RUTAS NAOMI (ADMIN) ---
  { path: 'admin/mis-datos', component: MisDatosComponent },
  { path: 'admin/catalogo', component: Catalogo, canActivate: [authGuard] }, // 🔥 protegido
  { path: 'admin/agregar-producto', component: AgregarProducto, canActivate: [authGuard] },
  { path: 'admin/tablero-pedidos', component: TableroPedidos, canActivate: [authGuard] },
  { path: 'admin/detalle-pedido/:id', component: DetallePedido, canActivate: [authGuard] }, 
  { path: 'admin/detalle-pedido', component: DetallePedido, canActivate: [authGuard] }, 
  { path: 'admin/actualizar-producto/:id', component: ActualizarProducto, canActivate: [authGuard] },
  { path: 'admin/detalle-producto', component: DetalleProductoAdmin, canActivate: [authGuard] },


  // --- RUTAS MIKE (CLIENTE Y AUTH) ---
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'registro', component: RegistroComponent },

  // 🔥 se mantiene Naomi (Buscador), NO se reemplaza
  { path: 'tienda', component: Buscador },

  // 🔥 mejora de Mike (IMPORTANTE: con id)
  { path: 'producto/:id', component: DetalleProducto },

  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },

  // 🔥 nueva ruta de Mike
  { path: 'perfil', component: MisDatosCliente },


  // --- FALLBACK (SE RESPETA NAOMI) ---
  { path: '**', redirectTo: 'admin/catalogo' }
];