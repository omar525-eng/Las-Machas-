export interface Producto {
  ProductoID: number;
  Nombre: string;
  Descripcion?: string;
  PrecioRegular: number;
  Stock: number;
  ImagenURL: string;
  Tamano: string;
  CategoriaID?: number;
  Categoria?: string;
}