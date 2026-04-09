import { getConnection } from "../config/db.js"
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
// Función para subir imagen a Easy File URL
async function uploadImage(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await axios.post('https://www.easyfileurl.com/api/v1/files', formData, {
    headers: {
      'Authorization': 'Bearer eiu_61fa79b2197349feb87164faf1310c40', // tu API key del dashboard
      ...formData.getHeaders()
    }
  });

  return response.data.url; // URL que luego guardas en la BD
}

// Actualizar producto
export const actualizarProducto = async (producto) => {
  const pool = await getConnection()

  await pool.request()
    .input("ProductoID", producto.ProductoID)
    .input("Nombre", producto.Nombre)
    .input("CategoriaID", producto.CategoriaID)
    .input("ImagenURL", producto.ImagenURL)
    .input("Estado", producto.Estado) // 🔥 ahora correcto
    .input("Descripcion", producto.Descripcion)
    .execute("sp_ActualizarProducto")
}

// Obtener detalle producto
export const obtenerDetalleProducto = async (productoID) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("ProductoID", productoID)
    .execute("sp_ObtenerDetalleProducto")

  return {
    producto: result.recordsets[0][0],
    skus: result.recordsets[1]
  }
}

// Crear producto
export const crearProducto = async (producto) => {
  const pool = await getConnection()

  const result = await pool.request()
    .input("Nombre", producto.Nombre)
    .input("CategoriaID", producto.CategoriaID)
    .input("ImagenURL", producto.ImagenURL)
    .input("Estado", producto.Estado)
    .input("Descripcion", producto.Descripcion)
    .execute("sp_CrearProducto")

  return result.recordset[0].NuevoProductoID 
}