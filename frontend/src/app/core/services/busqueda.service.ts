import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private terminoFuente = new BehaviorSubject<string>('');
  terminoActual = this.terminoFuente.asObservable();

  cambiarTermino(termino: string) {
    this.terminoFuente.next(termino);
  }
}