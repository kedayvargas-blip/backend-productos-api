import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbFilePath = path.join(dataDir, 'db.json');

const datosIniciales = {
  usuarios: [
    {
      id: 1,
      nombre: 'Kellin Dayana Vargas Quijano',
      usuario: 'adminclaro',
      password: 'Claro2026*',
      rol: 'administrador',
    },
  ],
  productos: [
    {
      id: 1,
      codigo: 'PRD-001',
      nombre: 'Router Fibra Óptica Dual Band',
      categoria: 'Redes y Conectividad',
      precio: 185000,
      stock: 25,
      descripcion: 'Equipo terminal óptico Wi-Fi 6 para sedes empresariales.',
    },
    {
      id: 2,
      codigo: 'PRD-002',
      nombre: 'Switch Administrable 24 Puertos Gigabit',
      categoria: 'Infraestructura',
      precio: 640000,
      stock: 10,
      descripcion: 'Switch rackeable capa 2 con soporte PoE+.',
    },
  ],
};

function asegurarDB() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(datosIniciales, null, 2), 'utf-8');
  }
}

export function leerDB() {
  asegurarDB();
  const contenido = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(contenido);
}

export function guardarDB(data) {
  asegurarDB();
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
}