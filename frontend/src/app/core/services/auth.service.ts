import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // Iniciamos siempre en nulo para poder probar el login cada vez que recargamos
  currentRole = signal<string | null>(null);
  
  // Forzamos a que la sesión inicie en falso
  isLoggedIn = signal<boolean>(false);

  login(token: string, role: string | number) {
    const roleStr = String(role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', roleStr);
    this.currentRole.set(roleStr);
    // Avisamos de inmediato a toda la app que ya hay sesión
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.clear();
    this.currentRole.set(null);
    // Avisamos que se cerró la sesión
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

 isAdmin() {
  const role = this.currentRole();
  return role === '1';
}

  isUser() {
    return this.currentRole() === '2';
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}