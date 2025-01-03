import { NextResponse } from 'next/server';
import db from '@/utils/db';

// Obtener un pedido específico con sus detalles
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const [pedido] = await db.query(`
      SELECT p.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'producto_id', dp.producto_id,
            'cantidad', dp.cantidad,
            'precio_unitario', dp.precio_unitario,
            'subtotal', dp.subtotal,
            'nombre_producto', pr.nombre
          )
        ) as detalles
      FROM pedidos p
      LEFT JOIN detalle_pedidos dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    if (pedido.length === 0) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el pedido' },
      { status: 500 }
    );
  }
}

// Actualizar el estado de un pedido
export async function PATCH(request, { params }) {

  const validStates = ['pendiente', 'en-proceso', 'completado'];

  try {
    const { id } = params;
    const { estado } = await request.json();

    if (!validStates.includes(estado)) {
      return NextResponse.json({ error: 'Estado no válido' });
    }
    
    await db.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );
    
    const [pedidoActualizado] = await db.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );
    
    if (pedidoActualizado.length === 0) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedidoActualizado[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el pedido' },
      { status: 500 }
    );
  }
}