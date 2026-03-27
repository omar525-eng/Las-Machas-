import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // Leemos el rol inicial del localStorage de forma segura
  currentRole = signal<string | null>(typeof window !== 'undefined' ? localStorage.getItem('role') : null);

  login(token: string, role: string | number) {
    const roleStr = String(role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', roleStr);
    this.currentRole.set(roleStr);
  }

  logout() {
    localStorage.clear();
    this.currentRole.set(null);
    this.router.navigate(['/login']);
  }

 isAdmin() {
  const role = this.currentRole();
  return role === '1';
}

  isUser() {
    return this.currentRole() === '2';
  }
}