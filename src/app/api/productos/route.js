import { NextResponse } from 'next/server';
import db from '../../../utils/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriaId = searchParams.get("categoria");

    const connection = await db.getConnection();
     let productos;
     
     if(categoriaId){
      [productos] = await connection.query(
        `SELECT p.*, c.nombre as categoria_nombre, s.nombre as subcategoria_nombre
         FROM productos p 
         LEFT JOIN categorias c ON p.categoria_id = c.id
         LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
         WHERE p.categoria_id = ? 
         ORDER BY p.nombre`,
        [categoriaId]
      );
    } else {
      [productos] = await connection.query(
        `SELECT p.*, c.nombre as categoria_nombre 
         FROM productos p 
         LEFT JOIN categorias c ON p.categoria_id = c.id 
         ORDER BY p.nombre`
      );
    }

    connection.release();

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
    const connection = await db.getConnection();
    const { nombre, precio, imagen, categoria_id, subcategoria_id, descripcion } = body;

    if (!nombre || !precio || !imagen || !categoria_id || !subcategoria_id || !descripcion) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connection.query('INSERT INTO productos (nombre, precio, imagen, descripcion, categoria_id, subcategoria_id) VALUES (?, ?, ?, ?, ?, ?)', [
      nombre,
      precio,
      imagen,
      descripcion,
      categoria_id,
      subcategoria_id
    ]);

    connection.release();

    return new Response(
      JSON.stringify({ message: 'Producto agregado' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    return new Response(
      JSON.stringify({ error: 'Error al agregar el producto' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    console.log('Datos recibidos en el servidor:', data);
    const connection = await db.getConnection();

    const result = await connection.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, subcategoria_id = ?, imagen = ? WHERE id = ?',
      [data.nombre, data.descripcion, data.precio, data.categoria_id, data.subcategoria_id, data.imagen, data.id]
    );

    connection.release();

    if ((result.affectedRows || result.rowCount) === 0) {
      return NextResponse.json(
        { message: 'No se encontró ningún producto con ese ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const connection = await db.getConnection();
    
    await connection.query('DELETE FROM productos WHERE id = ?', [id]);

    connection.release();

    return NextResponse.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}