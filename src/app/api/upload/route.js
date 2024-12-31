import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No se encontró ningún archivo' }, { status: 400 });
    }

     // Validar tipo de archivo
     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WebP' 
        }, { status: 400 });
      }

       // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: 'El archivo es demasiado grande. Máximo 5MB' 
        }, { status: 400 });
      }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único
    const fileExt = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      message: 'Archivo subido correctamente',
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}