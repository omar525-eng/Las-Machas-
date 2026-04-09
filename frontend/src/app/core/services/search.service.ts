import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Este Signal guardará en vivo lo que el usuario vaya escribiendo
  searchTerm = signal<string>('');
}