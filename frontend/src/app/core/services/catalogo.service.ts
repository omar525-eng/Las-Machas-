import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  
  private apiUrl = 'http://localhost:3000/api/catalogos'; 
  private productosUrl = 'http://localhost:3000/api/productos'; 
  
  private inventariosUrl = 'http://localhost:3000/api/inventario';

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  crearProducto(nuevoProducto: any): Observable<any> {
    return this.http.post<any>(this.productosUrl, nuevoProducto);
  }

  obtenerInactivos(): Observable<any> {
    return this.http.get<any>(`${this.inventariosUrl}/inactivos`);
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.productosUrl}/${id}`, producto);
  }
}