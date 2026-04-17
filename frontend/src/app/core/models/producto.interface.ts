export interface Producto {
  ProductoID: number;
  SkuID?: number;           // ← Agregamos el SkuID (que necesita el inventario)
  Nombre: string;
  Descripcion?: string;
  PrecioRegular: number;
  Stock: number;
  ImagenURL: string;
  Tamano: string;
  CategoriaID?: number;
  Categoria?: string;
}