-- Procesa el carrito, crea el ticket, descuenta el inventario y devuelve el stock restante para las alertas
 
CREATE PROCEDURE sp_CrearPedido
    @UsuarioID INT = NULL,
    @ClienteNombre VARCHAR(100),
    @ClienteTelefono VARCHAR(15),
    @ClienteDireccion VARCHAR(255),
    @CarritoJSON NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
 
    BEGIN TRY
        BEGIN TRANSACTION;
 
        DECLARE @NuevoPedidoID INT;
        DECLARE @FolioGenerado VARCHAR(20);
        
        -- 1. Generar Folio Corto (Ej: MC-849201)
        SET @FolioGenerado = 'MC-' + RIGHT('000000' + CAST(CAST(RAND() * 1000000 AS INT) AS VARCHAR), 6);
 
        -- 2. Guardar el encabezado en 'Pedidos'
        INSERT INTO Pedidos (FolioCorto, UsuarioID, ClienteNombre, ClienteTelefono, ClienteDireccion, Estatus)
        VALUES (@FolioGenerado, @UsuarioID, @ClienteNombre, @ClienteTelefono, @ClienteDireccion, 'Pendiente');
 
        -- Capturar el ID del nuevo pedido
        SET @NuevoPedidoID = SCOPE_IDENTITY();
 
        -- 3. Desempacar el JSON y guardar en 'Detalle_Pedido'
        INSERT INTO Detalle_Pedido (PedidoID, SkuID, Cantidad, PrecioUnitarioAplicado)
        SELECT 
            @NuevoPedidoID,
            JsonCarrito.SkuID,
            JsonCarrito.Cantidad,
            JsonCarrito.Precio
        FROM OPENJSON(@CarritoJSON)
        WITH (
            SkuID INT '$.SkuID',
            Cantidad INT '$.Cantidad',
            Precio DECIMAL(10,2) '$.Precio'
        ) AS JsonCarrito;
 
        -- 4. Descontar el inventario (CORREGIDO)
        UPDATE SKU_Inventario
        SET Stock = Stock - JsonCarrito.Cantidad
        FROM SKU_Inventario
        INNER JOIN OPENJSON(@CarritoJSON)
            WITH (
                SkuID INT '$.SkuID',
                Cantidad INT '$.Cantidad'
            ) AS JsonCarrito ON SKU_Inventario.SkuID = JsonCarrito.SkuID;
 
        -- CONFIRMAR LOS CAMBIOS
        COMMIT TRANSACTION;
 
        -- RESPUESTA 1: Ticket de Éxito
        SELECT 
            1 AS Exito, 
            @NuevoPedidoID AS PedidoID, 
            @FolioGenerado AS Folio, 
            'Pedido creado e inventario actualizado.' AS Mensaje;
 
        -- RESPUESTA 2: Reporte de Stock (Para disparar alertas)
        SELECT 
            i.SkuID,
            p.Nombre,
            i.Tamano,
            i.Stock AS StockActual,
            i.StockMinimo
        FROM SKU_Inventario i
        INNER JOIN Productos p ON i.ProductoID = p.ProductoID
        INNER JOIN OPENJSON(@CarritoJSON) WITH (SkuID INT '$.SkuID') AS j ON i.SkuID = j.SkuID;
 
    END TRY
    BEGIN CATCH
        -- SI ALGO EXPLOTA, DESHACER TODO
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SELECT 
            0 AS Exito, 
            ERROR_MESSAGE() AS MensajeError;
    END CATCH
END;
GO
