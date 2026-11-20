import { NextResponse } from 'next/server';
import { leerDB, guardarDB } from '@/lib/db';
import { verificarToken } from '@/lib/auth';

// GET: Investigar un producto específico por su ID
export async function GET(request, { params }) {
  const usuarioToken = await verificarToken(request);
  if (!usuarioToken) {
    return NextResponse.json(
      { exito: false, mensaje: 'Acceso denegado: Token no proporcionado o inválido.' },
      { status: 401 }
    );
  }

  const { id } = await params;
  const db = leerDB();
  const producto = db.productos.find((p) => p.id === Number(id));

  if (!producto) {
    return NextResponse.json(
      { exito: false, mensaje: `No se encontró ningún producto con ID ${id}.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ exito: true, producto }, { status: 200 });
}

// PUT: Modificar un producto existente por ID
export async function PUT(request, { params }) {
  const usuarioToken = await verificarToken(request);
  if (!usuarioToken) {
    return NextResponse.json(
      { exito: false, mensaje: 'Acceso denegado: Token no proporcionado o inválido.' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const db = leerDB();
    const indice = db.productos.findIndex((p) => p.id === Number(id));

    if (indice === -1) {
      return NextResponse.json(
        { exito: false, mensaje: `No se encontró ningún producto con ID ${id} para modificar.` },
        { status: 404 }
      );
    }

    if (body.precio !== undefined && Number(body.precio) <= 0) {
      return NextResponse.json(
        { exito: false, mensaje: 'Error de validación: el precio debe ser mayor a 0.' },
        { status: 400 }
      );
    }

    const productoActual = db.productos[indice];
    const productoActualizado = {
      ...productoActual,
      codigo: body.codigo ? body.codigo.trim().toUpperCase() : productoActual.codigo,
      nombre: body.nombre ? body.nombre.trim() : productoActual.nombre,
      categoria: body.categoria ? body.categoria.trim() : productoActual.categoria,
      precio: body.precio !== undefined ? Number(body.precio) : productoActual.precio,
      stock: body.stock !== undefined ? Number(body.stock) : productoActual.stock,
      descripcion: body.descripcion !== undefined ? body.descripcion.trim() : productoActual.descripcion,
    };

    db.productos[indice] = productoActualizado;
    guardarDB(db);

    return NextResponse.json(
      {
        exito: true,
        mensaje: 'Producto modificado exitosamente.',
        producto: productoActualizado,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { exito: false, mensaje: 'Error interno al modificar el producto.' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un producto por ID
export async function DELETE(request, { params }) {
  const usuarioToken = await verificarToken(request);
  if (!usuarioToken) {
    return NextResponse.json(
      { exito: false, mensaje: 'Acceso denegado: Token no proporcionado o inválido.' },
      { status: 401 }
    );
  }

  const { id } = await params;
  const db = leerDB();
  const indice = db.productos.findIndex((p) => p.id === Number(id));

  if (indice === -1) {
    return NextResponse.json(
      { exito: false, mensaje: `No se encontró ningún producto con ID ${id} para eliminar.` },
      { status: 404 }
    );
  }

  const eliminado = db.productos.splice(indice, 1)[0];
  guardarDB(db);

  return NextResponse.json(
    {
      exito: true,
      mensaje: `Producto "${eliminado.nombre}" eliminado correctamente.`,
      productoEliminado: eliminado,
    },
    { status: 200 }
  );
}