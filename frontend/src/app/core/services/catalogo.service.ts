import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  
  private apiUrl = 'http://localhost:3000/api/catalogos'; 

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  crearProducto(nuevoProducto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoProducto);
  }
}