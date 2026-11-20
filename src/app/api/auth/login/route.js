import { NextResponse } from 'next/server';
import { leerDB } from '@/lib/db';
import { generarToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuario, password } = body;

    if (!usuario || !password) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error de validación: Debe enviar usuario y password.',
        },
        { status: 400 }
      );
    }

    const db = leerDB();
    const encontrado = db.usuarios.find(
      (u) => u.usuario === usuario.trim() && u.password === password.trim()
    );

    if (!encontrado) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error de autenticación: Credenciales inválidas.',
        },
        { status: 401 }
      );
    }

    const token = await generarToken({
      id: encontrado.id,
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      rol: encontrado.rol,
    });

    return NextResponse.json(
      {
        exito: true,
        mensaje: 'Autenticación exitosa. Token generado.',
        token,
        usuario: {
          id: encontrado.id,
          nombre: encontrado.nombre,
          usuario: encontrado.usuario,
          rol: encontrado.rol,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { exito: false, mensaje: 'Error interno en el servidor de autenticación.' },
      { status: 500 }
    );
  }
}