'use client';
import { useState } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [usuario, setUsuario] = useState('adminclaro');
  const [password, setPassword] = useState('Claro2026*');
  const [nombreReg, setNombreReg] = useState('');
  const [respuestaApi, setRespuestaApi] = useState(null);

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [formProd, setFormProd] = useState({
    id: '',
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    descripcion: '',
  });

  const registrarUsuario = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreReg, usuario, password }),
    });
    const data = await res.json();
    setRespuestaApi(data);
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });
    const data = await res.json();
    setRespuestaApi(data);
    if (data.token) {
      setToken(data.token);
      consultarProductos(data.token);
    }
  };

  const consultarProductos = async (tokenActual = token, filtro = '') => {
    const url = filtro
      ? `/api/productos?buscar=${encodeURIComponent(filtro)}`
      : '/api/productos';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenActual}` },
    });
    const data = await res.json();
    setRespuestaApi(data);
    if (data.productos) setProductos(data.productos);
  };

  const insertarProducto = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formProd),
    });
    const data = await res.json();
    setRespuestaApi(data);
    if (data.exito) {
      setFormProd({ id: '', codigo: '', nombre: '', categoria: '', precio: '', stock: '', descripcion: '' });
      consultarProductos();
    }
  };

  const modificarProducto = async () => {
    if (!formProd.id) return alert('Selecciona o escribe el ID del producto a modificar');
    const res = await fetch(`/api/productos/${formProd.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formProd),
    });
    const data = await res.json();
    setRespuestaApi(data);
    if (data.exito) consultarProductos();
  };

  const eliminarProducto = async (id) => {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRespuestaApi(data);
    if (data.exito) consultarProductos();
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '950px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ color: '#da291c' }}>API REST Next.js - Gestión de Productos y Autenticación JWT</h1>
      <p>Evidencias SENA: <strong>GA7-220501096-AA5-EV01</strong> y <strong>GA7-220501096-AA5-EV02</strong></p>

      <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>1. Autenticación (Registro, Login y Token JWT)</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <input placeholder="Nombre (solo registro)" value={nombreReg} onChange={(e) => setNombreReg(e.target.value)} />
          <input placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={iniciarSesion} style={{ background: '#da291c', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer' }}>
            Iniciar Sesión (Obtener Token)
          </button>
          <button onClick={registrarUsuario} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer' }}>
            Registrar Usuario
          </button>
        </div>
        <div style={{ fontSize: '12px', wordBreak: 'break-all', background: '#f4f4f4', padding: '8px' }}>
          <strong>Token Activo:</strong> {token || 'Sin autenticar (Inicia sesión para generar JWT)'}
        </div>
      </section>

      <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>2. CRUD de Productos (Insertar, Consultar, Investigar, Modificar, Eliminar)</h2>
        <form onSubmit={insertarProducto} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
          <input placeholder="ID (solo para Modificar)" value={formProd.id} onChange={(e) => setFormProd({ ...formProd, id: e.target.value })} />
          <input placeholder="Código (ej. PRD-003)" value={formProd.codigo} onChange={(e) => setFormProd({ ...formProd, codigo: e.target.value })} />
          <input placeholder="Nombre del producto" value={formProd.nombre} onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })} />
          <input placeholder="Categoría" value={formProd.categoria} onChange={(e) => setFormProd({ ...formProd, categoria: e.target.value })} />
          <input type="number" placeholder="Precio" value={formProd.precio} onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })} />
          <input type="number" placeholder="Stock" value={formProd.stock} onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })} />
          <input placeholder="Descripción" value={formProd.descripcion} onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })} style={{ gridColumn: 'span 3' }} />
          <button type="submit" style={{ background: '#198754', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer' }}>
            Insertar Producto (POST)
          </button>
          <button type="button" onClick={modificarProducto} style={{ background: '#0d6efd', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer' }}>
            Modificar por ID (PUT)
          </button>
          <button type="button" onClick={() => consultarProductos()} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer' }}>
            Consultar Todos (GET)
          </button>
        </form>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            placeholder="Investigar por nombre, código o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: '6px' }}
          />
          <button onClick={() => consultarProductos(token, busqueda)} style={{ padding: '6px 14px', cursor: 'pointer' }}>
            Investigar (GET ?buscar=)
          </button>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => setFormProd(p)} style={{ marginRight: '5px' }}>Cargar</button>
                  <button onClick={() => eliminarProducto(p.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ background: '#1e1e1e', color: '#00ff90', padding: '15px', borderRadius: '8px' }}>
        <strong>Respuesta JSON del Servidor API:</strong>
        <pre style={{ overflowX: 'auto', fontSize: '13px' }}>
          {respuestaApi ? JSON.stringify(respuestaApi, null, 2) : '// Ejecuta una petición para ver la respuesta del backend'}
        </pre>
      </section>
    </main>
  );
}