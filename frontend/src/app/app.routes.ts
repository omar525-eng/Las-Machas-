import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Buscador } from './cliente/buscador/buscador';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';
import { Catalogo } from './admin/catalogo/catalogo';
import { DetalleProducto } from './cliente/detalle-producto/detalle-producto';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'tienda', component: Buscador },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },
  { path: 'admin/catalogo', component: Catalogo },
  { path: "producto/:id", component: DetalleProducto }, 
  { path: '**', redirectTo: 'login' }
];