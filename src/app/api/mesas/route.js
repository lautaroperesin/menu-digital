import db from '../../../utils/db';

export async function GET() {
    try {
      const connection = await db.getConnection();
      const [mesas] = await connection.query('SELECT * FROM mesas');
      connection.release();
  
      return new Response(JSON.stringify(mesas), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error al obtener las mesas' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }