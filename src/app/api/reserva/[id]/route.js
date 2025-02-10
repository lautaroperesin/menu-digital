import { NextResponse } from 'next/server';
import db from '@/utils/db';

// 🔹 Actualizar el estado de una reserva
export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    const { estado } = await request.json();
    
    if (!estado) {
      return NextResponse.json({ error: 'El estado es obligatorio' }, { status: 400 });
    }

    const connection = await db.getConnection();
    await connection.query(
      `UPDATE reservas SET estado = ? WHERE id = ?`,
      [estado, id]
    );
    connection.release();

    return NextResponse.json({ message: 'Reserva actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
  }
}
