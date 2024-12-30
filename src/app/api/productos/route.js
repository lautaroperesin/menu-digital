import { NextResponse } from 'next/server';
import db from '../../../utils/db';

export async function GET() {
  try {
    const [productos] = await db.query('SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id ORDER BY p.nombre');
    return new Response(JSON.stringify(productos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al obtener los productos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, image, category_id, description } = body;

    if (!name || !price || !image) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.query('INSERT INTO productos (nombre, precio, imagen, descripcion, categoria_id) VALUES (?, ?, ?, ?, ?)', [
      name,
      price,
      image,
      description,
      category_id
    ]);
    return new Response(
      JSON.stringify({ message: 'Producto agregado' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error al agregar el producto' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, imagen = ? WHERE id = ?',
      [data.nombre, data.descripcion, data.precio, data.categoria_id, data.imagen, data.id]
    );

    return NextResponse.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    await db.query('DELETE FROM productos WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}