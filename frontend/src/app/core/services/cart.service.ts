import { Injectable, signal, computed, effect } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tamano?: string;
  cartItemId?: string; // ID único para el item en el carrito
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
      const items: ProductoCarrito[] = JSON.parse(storedItems);
      // Migración para asegurar que todos los items tengan un cartItemId
      const migratedItems = items.map(item => {
        if (!item.cartItemId) {
          return { ...item, cartItemId: `${item.id}-${item.tamano || ''}` };
        }
        return item;
      });
      this.items.set(migratedItems);
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
  
  // Verificamos si aplica el descuento de mayoreo en botes de 500ml
  public aplicaDescuento500ml = computed(() => {
    const cantidad500ml = this.items()
      .filter(item => item.nombre.includes('500') || item.tamano?.includes('500'))
      .reduce((acc, item) => acc + item.cantidad, 0);
    return cantidad500ml >= 10;
  });

  // Calculamos el precio total aplicando las reglas de descuento
  public total = computed(() => {
    const descuentoActivo = this.aplicaDescuento500ml();
    
    return this.items().reduce((acc, item) => {
      let precioUnitario = item.precio;
      // Si el producto es de 500ml y aplica el descuento, baja a $85 pesos
      if (descuentoActivo && (item.nombre.includes('500') || item.tamano?.includes('500'))) {
        precioUnitario = 85;
      }
      return acc + (precioUnitario * item.cantidad);
    }, 0);
  });

  // Helper para saber a cuánto le sale ese producto específico (para la interfaz)
  getPrecioUnitarioFinal(item: ProductoCarrito): number {
    if (this.aplicaDescuento500ml() && (item.nombre.includes('500') || item.tamano?.includes('500'))) {
      return 85;
    }
    return item.precio;
  }

  addToCart(producto: ProductoCarrito) {
    const cartItemId = `${producto.id}-${producto.tamano || ''}`;
    this.items.update(currentItems => {
      const existingItem = currentItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return currentItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, cantidad: item.cantidad + producto.cantidad }
            : item
        );
      }
      return [...currentItems, { ...producto, cartItemId }];
    });
  }

  removeFromCart(cartItemId: string) {
    this.items.update(currentItems => currentItems.filter(item => item.cartItemId !== cartItemId));
  }

  clearCart() {
    this.items.set([]);
  }

  updateQuantity(cartItemId: string, change: number) {
    this.items.update(currentItems =>
      currentItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, cantidad: Math.max(0, item.cantidad + change) } : item
      ).filter(item => item.cantidad > 0) // Elimina el producto si la cantidad es 0
    );
  }
}