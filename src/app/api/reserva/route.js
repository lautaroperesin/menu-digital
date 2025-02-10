import { NextResponse } from 'next/server';
import db from '@/utils/db';

// 🔹 Obtener todas las reservas
export async function GET() {
  try {
    const connection = await db.getConnection();
    const [reservas] = await connection.query(`
      SELECT * FROM reservas
      ORDER BY fecha DESC;
    `);
    
    connection.release();
    return NextResponse.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

// 🔹 Crear una nueva reserva
export async function POST(request) {
  try {
    const { nombre, telefono, fecha, hora, personas, comentarios, estado } = await request.json();

    // Validación de datos
    if (!nombre || !telefono || !fecha || !hora || !personas) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar la reserva en la base de datos
      const [result] = await connection.query(
        `INSERT INTO reservas 
        (nombre, telefono, fecha, hora, personas, comentarios, estado, fecha_hora_creacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          nombre,
          telefono,
          fecha,
          hora,
          personas,
          comentarios || null, // Comentario opcional
          estado || 'pendiente' // Estado por defecto
        ]
      );

      const reservaId = result.insertId;

      // Obtener la reserva recién creada
      const [reserva] = await connection.query(
        `SELECT * FROM reservas WHERE id = ?`,
        [reservaId]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json(reserva[0], { status: 201 });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json(
      { error: 'Error al crear la reserva: ' + error.message },
      { status: 500 }
    );
  }
}
