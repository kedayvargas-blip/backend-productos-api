# Backend API RESTful en Next.js - Gestión de Productos y Autenticación JWT

**Evidencias:**
* **GA7-220501096-AA5-EV01:** Diseño y desarrollo de servicios web - caso.
* **GA7-220501096-AA5-EV02:** API.

Tecnólogo en Análisis y Desarrollo de Software (ADSO) - SENA.  
**Autora Kellin Dayana Vargas Quijano.

---

## 1. Arquitectura y Diseño de Servicios Web (EV01)
El servicio web está construido bajo el estilo arquitectónico **REST** sobre **Next.js (App Router)**, empleando intercambio de datos en formato **JSON** y seguridad mediante **JSON Web Tokens (JWT - HS256)**.

### Credenciales de Prueba Preconfiguradas
* **Usuario:** `adminclaro`
* **Contraseña:** `Claro2026*`

---

## 2. Catálogo de Endpoints de la API (EV02)

### Módulo de Autenticación y Usuarios
| Método | Endpoint | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registro de nuevos usuarios con validación de campos y unicidad. | Pública |
| `POST` | `/api/auth/login` | Validación de credenciales y generación de **Token JWT**. | Pública |

### Módulo CRUD de Productos (Requiere Header `Authorization: Bearer <TOKEN>`)
| Método | Endpoint | Operación | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/productos` | **Insertar** | Crea un nuevo producto validando código único, precio y stock. |
| `GET` | `/api/productos` | **Consultar** | Lista todos los productos registrados en el sistema. |
| `GET` | `/api/productos?buscar=texto` | **Investigar** | Filtra productos por coincidencia en nombre, código o categoría. |
| `GET` | `/api/productos/[id]` | **Investigar (ID)** | Consulta el detalle de un producto específico por su identificador. |
| `PUT` | `/api/productos/[id]` | **Modificar** | Actualiza los datos de un producto existente. |
| `DELETE` | `/api/productos/[id]` | **Eliminar** | Elimina permanentemente un producto por su ID. |

