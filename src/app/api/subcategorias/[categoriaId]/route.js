import { NextResponse } from "next/server";
import db from '../../../../utils/db';

export async function GET(req, { params }) {
  try {
    const { categoriaId } = await params;

    const connection = await db.getConnection();
    const [subcategories] = await connection.query('SELECT * FROM subcategorias WHERE categoria_id = ?', [categoriaId]);
    connection.release(); 
    
    return NextResponse.json(subcategories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener subcategorías' },
      { status: 500 }
    );
  }
}