import { NextResponse } from 'next/server';
import { leerDB, guardarDB } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, usuario, password } = body;

    if (!nombre || !usuario || !password) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error de validación: nombre, usuario y password son obligatorios.',
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error de validación: la contraseña debe tener al menos 6 caracteres.',
        },
        { status: 400 }
      );
    }

    const db = leerDB();
    const existe = db.usuarios.some(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (existe) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error: El nombre de usuario ya se encuentra registrado.',
        },
        { status: 409 }
      );
    }

    const nuevoUsuario = {
      id: db.usuarios.length > 0 ? Math.max(...db.usuarios.map((u) => u.id)) + 1 : 1,
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      password: password.trim(),
      rol: 'operador',
    };

    db.usuarios.push(nuevoUsuario);
    guardarDB(db);

    return NextResponse.json(
      {
        exito: true,
        mensaje: 'Usuario registrado exitosamente.',
        usuario: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          usuario: nuevoUsuario.usuario,
          rol: nuevoUsuario.rol,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { exito: false, mensaje: 'Error interno al procesar el registro.' },
      { status: 500 }
    );
  }
}