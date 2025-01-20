import db from '../../../utils/db';

export async function GET() {
  try {
    const connection = await db.getConnection();
    const [topProductos] = await connection.query(`
      SELECT 
        p.id, 
        p.nombre, 
        SUM(dp.cantidad) AS total_vendido, 
        SUM(dp.subtotal) AS ingresos 
      FROM productos p
      JOIN detalle_pedidos dp ON p.id = dp.producto_id
      JOIN pedidos ped ON dp.pedido_id = ped.id
      WHERE YEARWEEK(ped.fecha_hora, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY p.id
      ORDER BY total_vendido DESC
      LIMIT 5;
    `);

    connection.release();

    return new Response(JSON.stringify(topProductos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error al obtener los productos más vendidos' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
