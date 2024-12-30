import { NextResponse } from 'next/server';
import db from '../../../utils/db';

export async function GET() {
  try {
    const [categories] = await db.query('SELECT * FROM categorias');
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}