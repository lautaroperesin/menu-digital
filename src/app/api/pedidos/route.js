import { NextResponse } from 'next/server';
import db from '@/utils/db';

// Obtener todos los pedidos
export async function GET() {
  try {
    const connection = await db.getConnection();
    const [pedidos] = await connection.query(`
    SELECT p.*, 
      COUNT(dp.id) as total_items,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'cantidad', dp.cantidad,
          'nombre', pr.nombre,
          'id', pr.id,
          'precio', pr.precio
        )
    ) as productos
    FROM pedidos p
    LEFT JOIN detalle_pedidos dp ON p.id = dp.pedido_id
    LEFT JOIN productos pr ON dp.producto_id = pr.id
    GROUP BY p.id
    ORDER BY p.fecha_hora DESC;
    `);

    connection.release();
    
    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

// Crear nuevo pedido
export async function POST(request) {
  try {
    const { detalle_pedidos, forma_entrega, forma_pago, nombre_cliente, telefono_cliente, direccion_cliente } = await request.json();

    // Validar los datos recibidos
    if (!detalle_pedidos || detalle_pedidos.length === 0) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }
    if (!forma_entrega || !forma_pago || !nombre_cliente || !telefono_cliente) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Iniciar transacción
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Calcular el total del pedido
      let total = 0;
      for (const item of detalle_pedidos) {
        // Obtener el precio actual del producto
        const [productos] = await connection.query(
          'SELECT precio FROM productos WHERE id = ?',
          [item.producto_id]
        );
        
        if (productos.length === 0) {
          throw new Error(`Producto ${item.producto_id} no encontrado`);
        }

        const precio = productos[0].precio;
        total += precio * item.cantidad;
      }

      // Insertar el pedido
      const [resultPedido] = await connection.query(
        `
        INSERT INTO pedidos 
        (estado, total, fecha_hora, forma_entrega, forma_pago, nombre_cliente, telefono_cliente, direccion_cliente)
        VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
        `,
        [
          'pendiente', // Estado inicial
          total,
          forma_entrega,
          forma_pago,
          nombre_cliente,
          telefono_cliente,
          direccion_cliente || null // Dirección es opcional (solo para delivery)
        ]
      );

      const pedidoId = resultPedido.insertId;

      // Insertar los detalles del pedido
      for (const item of detalle_pedidos) {
        const [productos] = await connection.query(
          'SELECT precio FROM productos WHERE id = ?',
          [item.producto_id]
        );
        
        const precio = productos[0].precio;
        const subtotal = precio * item.cantidad;

        await connection.query(
          `INSERT INTO detalle_pedidos 
           (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [pedidoId, item.producto_id, item.cantidad, precio, subtotal]
        );
      }

      // Confirmar transacción
      await connection.commit();

      // Obtener el pedido completo con sus detalles
      const [pedidoCompleto] = await connection.query(`
        SELECT p.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'producto_id', dp.producto_id,
              'cantidad', dp.cantidad,
              'precio_unitario', dp.precio_unitario,
              'subtotal', dp.subtotal
            )
          ) as detalles
        FROM pedidos p
        LEFT JOIN detalle_pedidos dp ON p.id = dp.pedido_id
        WHERE p.id = ?
        GROUP BY p.id
      `, [pedidoId]);

      connection.release();

      return NextResponse.json(pedidoCompleto[0]);

    } catch (error) {
      // Si hay error, revertir la transacción
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear el pedido: ' + error.message },
      { status: 500 }
    );
  }
}