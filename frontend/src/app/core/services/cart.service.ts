import { Injectable, signal, computed, effect } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal que guarda nuestro arreglo de productos
  private items = signal<ProductoCarrito[]>([]);

  // Cuando el servicio se construye, lee el carrito del almacenamiento local
  constructor() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items.set(JSON.parse(storedItems));
    }

    // Un efecto que guarda el carrito en localStorage cada vez que cambia
    effect(() => {
      localStorage.setItem('cartItems', JSON.stringify(this.items()));
    });
  }

  // Exponemos los items como una señal de solo lectura para el exterior
  public getItems() {
    return this.items.asReadonly();
  }

  // Calculamos el total de items en el carrito
  public itemCount = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));
  
  // Calculamos el precio total
  public total = computed(() => this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0));

  addToCart(producto: ProductoCarrito) {
    this.items.update(currentItems => {
      const existingItem = currentItems.find(item => item.id === producto.id);
      if (existingItem) {
        return currentItems.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + producto.cantidad } : item);
      }
      return [...currentItems, producto];
    });
  }

  removeFromCart(id: number) {
    this.items.update(currentItems => currentItems.filter(item => item.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }
}