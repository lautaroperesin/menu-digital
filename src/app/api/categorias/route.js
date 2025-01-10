import { NextResponse } from 'next/server';
import db from '../../../utils/db';

export async function GET() {
  try {
    const connection = await db.getConnection();
    const [categories] = await connection.query('SELECT * FROM categorias');
    connection.release(); 
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}