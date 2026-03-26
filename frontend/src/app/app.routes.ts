import { Routes } from '@angular/router'; // <--- ESTO ARREGLA EL PRIMER ERROR

// IMPORTACIONES DE ADMIN (NAOMI)
import { Catalogo } from './admin/catalogo/catalogo';
import { AgregarProducto } from './admin/agregar-producto/agregar-producto';

// IMPORTACIONES DE CLIENTE (MIKE)
import { Login } from './auth/login/login';
import { Buscador } from './cliente/buscador/buscador';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin/catalogo', component: Catalogo },
  { path: 'admin/agregar-producto', component: AgregarProducto },
  { path: 'login', component: Login },
  { path: 'tienda', component: Buscador },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },
  { path: 'producto/:id', component: DetalleProducto },
  { path: '**', redirectTo: 'login' }
];
