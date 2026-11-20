import { NextResponse } from 'next/server';
import { leerDB, guardarDB } from '@/lib/db';
import { verificarToken } from '@/lib/auth';

// GET: Consultar todos los productos o investigar mediante ?buscar=texto
export async function GET(request) {
  const usuarioToken = await verificarToken(request);
  if (!usuarioToken) {
    return NextResponse.json(
      { exito: false, mensaje: 'Acceso denegado: Token no proporcionado o inválido.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const buscar = searchParams.get('buscar');

  const db = leerDB();
  let resultados = db.productos;

  if (buscar && buscar.trim() !== '') {
    const termino = buscar.trim().toLowerCase();
    resultados = resultados.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.codigo.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
    );
  }

  return NextResponse.json(
    {
      exito: true,
      total: resultados.length,
      productos: resultados,
    },
    { status: 200 }
  );
}

// POST: Insertar un nuevo producto (requiere Token válido)
export async function POST(request) {
  const usuarioToken = await verificarToken(request);
  if (!usuarioToken) {
    return NextResponse.json(
      { exito: false, mensaje: 'Acceso denegado: Token no proporcionado o inválido.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { codigo, nombre, categoria, precio, stock, descripcion } = body;

    if (!codigo || !nombre || !categoria || precio === undefined || stock === undefined) {
      return NextResponse.json(
        {
          exito: false,
          mensaje:
            'Error de validación: codigo, nombre, categoria, precio y stock son obligatorios.',
        },
        { status: 400 }
      );
    }

    if (Number(precio) <= 0 || Number(stock) < 0) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: 'Error de validación: el precio debe ser mayor a 0 y el stock no puede ser negativo.',
        },
        { status: 400 }
      );
    }

    const db = leerDB();
    const codigoDuplicado = db.productos.some(
      (p) => p.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );

    if (codigoDuplicado) {
      return NextResponse.json(
        { exito: false, mensaje: `Error: Ya existe un producto con el código ${codigo}.` },
        { status: 409 }
      );
    }

    const nuevoProducto = {
      id: db.productos.length > 0 ? Math.max(...db.productos.map((p) => p.id)) + 1 : 1,
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: Number(precio),
      stock: Number(stock),
      descripcion: descripcion ? descripcion.trim() : 'Sin descripción adicional',
    };

    db.productos.push(nuevoProducto);
    guardarDB(db);

    return NextResponse.json(
      {
        exito: true,
        mensaje: 'Producto insertado correctamente.',
        producto: nuevoProducto,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { exito: false, mensaje: 'Error interno al insertar el producto.' },
      { status: 500 }
    );
  }
}