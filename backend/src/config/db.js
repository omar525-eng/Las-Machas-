import sql from "mssql"

export const dbConfig = {
  user: "server-ornelasomar-machasDB",   
  password: "LasMachas12345+",           
  database: "MachasDB",                  
  server: "server-machascloud-omar.database.windows.net",
  port: 1433,                            
  options: {
    encrypt: true,                       
    trustServerCertificate: false        
  }
}

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig)
    return pool;
  } catch (error) {
    console.error("Error de conexión DB:", error)
    throw error
  }
}
getConnection()