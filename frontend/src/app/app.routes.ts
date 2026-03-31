import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Carrito } from './cliente/carrito/carrito';
import { Checkout } from './cliente/checkout/checkout';
import { Catalogo } from './admin/catalogo/catalogo';
import { DetalleProductoComponent } from './cliente/detalle-producto/detalle-producto';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { RegistroComponent } from './auth/login/registro.component';
import { MisDatosComponent } from './cliente/mis-datos/mis-datos';
import { CatalogoCliente } from './cliente/catalogo_cliente/catalogocliente';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Si el usuario ya está logueado, no puede volver a la página de login
  { path: 'login', component: Login, canActivate: [loginGuard] },
  // La tienda ahora usa el catálogo dinámico que filtra con el buscador
  { path: 'tienda', component: CatalogoCliente },
  { path: 'carrito', component: Carrito },
  { path: 'checkout', component: Checkout },
  // --- RUTAS ---
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: MisDatosComponent },
  { path: 'admin/mis-datos', component: MisDatosComponent }, // El ícono del admin también necesita esta ruta
  // Protegemos la ruta del administrador
  { path: 'admin/catalogo', component: Catalogo, canActivate: [authGuard] },
  { path: 'producto/:id', component: DetalleProductoComponent },
  { path: '**', redirectTo: 'login' }
];