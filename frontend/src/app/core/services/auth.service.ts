import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // Iniciamos en nulo para que siempre pida login al recargar la página
  currentRole = signal<string | null>(null);
  
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // Borramos el token y rol guardados al iniciar la app para forzar el login
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

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
    if (!role) return false;
    // Lo convertimos a texto, minúsculas, quitamos espacios y comprobamos también el número 1
    const r = String(role).toLowerCase().trim();
    return r === 'admin' || r === 'administrador' || r === '1';
  }

  isUser() {
    const role = this.currentRole();
    if (!role) return false;
    const r = role.toLowerCase();
    return r === 'cliente' || r === 'user' || r === 'usuario';
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}