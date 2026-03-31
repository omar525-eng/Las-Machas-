import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Si ya está logueado, lo mandamos a su catálogo y no al login
    const target = authService.isAdmin() ? '/admin/catalogo' : '/tienda';
    router.navigate([target]);
    return false;
  }
  return true;
};