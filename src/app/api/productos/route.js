import db from '../../../utils/db';

export async function GET() {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
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
    const { name, price, image } = body;

    if (!name || !price || !image) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.query('INSERT INTO productos (name, price, image) VALUES (?, ?, ?)', [
      name,
      price,
      image,
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