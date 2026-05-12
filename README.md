# Proyecto_DesarrolloContinuo_Back<div align="center">

# Propuesta del Proyecto Final
**Infraestructura para el Desarrollo Continuo**

<img src="Imagenes/ITESO.png"/>

</div>

---

## Descripción del Proyecto

Este proyecto se trata de un ecosistema diseñado para gestionar un e-commerce, utilizando una arquitectura moderna, escalable y totalmente contenerizada. Nuestro objetivo es ofrecer una interfaz robusta para administrar productos y procesamiento de ventas de forma eficiente.

El sistema se divide en tres pilares:

1. **Gestión del catálogo** — implementación de un inventario dinámico, con persistencia de datos y actualización de stock en tiempo real.
2. **Lógica de negocio** — validación de datos, disponibilidad de productos, gestión del carrito de compra por usuario y generación de operaciones por cada pago.
3. **Infraestructura contenerizada** — el proyecto está diseñado para ser desplegado mediante Docker, garantizando que el entorno de desarrollo sea idéntico en cualquier máquina.

Habrán dos ambientes separados (**dev** y **prod**), pipeline CI/CD automatizado con GitHub Actions, imágenes publicadas en Docker Hub y despliegue en Cloudflare, con **aprobación manual requerida** antes de publicar a producción.

---

## Componentes y Métodos

### Esquema de Usuario

**UsuarioController** — maneja la comunicación con los siguientes métodos:

- `postRegistro(datos: JSON) : Response` — recibe los datos del usuario y los pasa al servicio.
- `getPerfil(id: int) : Response` — obtiene un usuario a partir de un ID específico.
- `putActualizar(id: int, datos: JSON) : Response` — actualiza los datos de un usuario.

**UsuarioService** — aplica las reglas de negocio y protege la integridad de los datos:

- `crearUsuario(usuario: Usuario) : boolean` — crea el usuario y maneja la lógica de confirmación.
- `validarPassword(pass: String) : boolean` — valida que la contraseña cumpla las reglas apropiadas.
- `cifrarDatos(datos: String) : String` — cifra la contraseña y otras operaciones sensibles.

**&lt;&lt;interface&gt;&gt; <br>UsuarioRepository** — ejecuta las consultas a la base de datos:

- `save(u: Usuario) : void` — guarda un usuario en la base de datos.
- `findById(id: int) : Usuario` — busca un usuario por ID.
- `update(u: Usuario) : void` — actualiza un usuario existente.
- `delete(id: int) : void` — elimina un usuario.

**Usuario** — modelo que define la estructura del usuario en la base de datos:

- `+int id`
- `+String nombre`
- `+String email`
- `-String passwordHash`
- `+getters/setters()`

### Diagrama de Clases — Usuario

![Diagrama de clases - Esquema Usuario](Imagenes/diagrama_clases_usuario.png)


### Esquema de Stock

**StockController** — maneja la comunicación con los siguientes métodos:

- `postStock(datos: JSON) : Response` — recibe los datos del producto y los pasa al servicio.
- `getStock(id: int) : Response` — obtiene un producto a partir de un ID específico.

**StockService** — aplica las reglas de negocio y protege la integridad de los datos:

- `crearStock(stock: Stock) : boolean` — crea un producto y maneja la lógica de añadirlo a la lista.

**&lt;&lt;interface&gt;&gt; <br>StockRepository** — ejecuta las consultas a la base de datos:

- `save(s: Stock) : void` — guarda un producto en la base de datos.
- `findById(id: int) : Stock` — busca un producto por ID.
- `update(s: Stock) : void` — actualiza un producto existente.
- `delete(id: int) : void` — elimina un producto.

**Stock** — modelo que define la estructura del producto en la base de datos:

- `+int id`
- `+String nombre`
- `+String sku`
- `-Float price`
- `+getters/setters()`

### Diagrama de Clases — Stock

![Diagrama de clases - Esquema Stock](Imagenes/diagrama_clases_stock.jpg)

---
---

## Stack Tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| **Runtime** | Python + FastAPI | API REST del backend (asíncrono) |
| **Base de datos** | PostgreSQL  | Persistencia de datos |
| **Testing** | Pytest | Pruebas unitarias e integración |
| **Containers** | Docker + Docker Compose | Empaquetado y orquestación local |
| **Registry** | Docker Hub | Distribución de imágenes |
| **CI/CD** | GitHub Actions | Automatización de pipelines |
| **Hosting** | Cloudflare Workers | Deploy del API (dev y prod) |
| **Secrets** | GitHub Environments | Gestión segura de credenciales |
| **VCS** | Git + GitHub | Control de versiones y revisión |

---

## Recursos — Diagrama de Infraestructura

```
                    ┌─────────────────────────────────────────────────────┐
                    │                      GitHub                         │
                    │                                                     │
                    │   ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
                    │   │  Repo    │  │  Actions   │  │  Environments   │ │
                    │   │          │  │            │  │                 │ │
                    │   │  main  ──┼─►│ cd-prod ───┼─►│   prod          │ │
                    │   │  develop─┼─►│ cd-dev  ───┼─►│   dev           │ │
                    │   └──────────┘  └────────────┘  └───────────┬─────┘ │
                    └──────────────────────────────────────────── │ ──────┘
                                                                  │
              ┌───────────────────────────────────────────────────┤
              │                                                   │
              ▼                                                   ▼
┌─────────────────────────────────┐                  ┌────────────────────────────────┐
│       Docker Hub                │                  │     Cloudflare Workers         │
│                                 │                  │                                │
│  usuario/ecommerce-frontend **  │                  │  Worker: ecommerce-dev         │
│  usuario/ecommerce-backend      │                  │                                │
│  usuario/ecommerce-db           │                  │  Worker: ecommerce-prod        │
│                                 │                  │                                │
│  ** frontend opcional           │                  └────────────────────────────────┘
└─────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                      GitHub Secrets por Ambiente                          │
│                                                                           │
│  Ambiente: dev                       Ambiente: prod                       │
│  ────────────────────                ───────────────────────────────────  │
│  DOCKERHUB_USERNAME                  DOCKERHUB_USERNAME                   │
│  DOCKERHUB_TOKEN                     DOCKERHUB_TOKEN                      │
│  CLOUDFLARE_API_TOKEN  (dev)         CLOUDFLARE_API_TOKEN  (prod)         │
│  CLOUDFLARE_ACCOUNT_ID               CLOUDFLARE_ACCOUNT_ID                │
│  DATABASE_URL  (dev DB)              DATABASE_URL  (prod DB)              │
│                                      Required Reviewers: ✅ (manual)     │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Diagrama de Deployment

![Diagrama de deployment](Imagenes/diagrama_deployment.png)


---

## Pruebas Unitarias

Se usa **Pytest** para pruebas de los endpoints FastAPI. El pipeline CI falla y bloquea el merge si algún test no pasa.

| Caso de prueba | Tipo | Descripción |
|---|---|---|
| Cálculo correcto del precio | Unitaria | 3 productos × $10 = total $30 |
| Validación de existencia | Unitaria | Si hay 3 unidades y el usuario pide 4 → error |
| IDs únicos | Unitaria | No se repiten IDs al crear múltiples registros |

---

## Docker Hub

Se publicarán las siguientes imágenes:
- `usuario/ecommerce-frontend` **
- `usuario/ecommerce-backend`
- `usuario/ecommerce-db`

** El frontend es opcional, dependiendo del avance del proyecto.

**Comandos base**

```bash
# Build y push manual
docker build -t usuario/ecommerce-backend .
docker push usuario/ecommerce-backend
```

---

## Estrategia de Ramas

```
main  ●────────────────────────────────────────────────────►  PROD 
                                              ▲
                                              │   Requiere: aprovación manual
develop ●──────────────────────────────────────────────────►  DEV  
         ▲                     ▲                    ▲
         │                     │                    │
      feature/              feature/             hotfix/
      catalogo              usuarios             fix-auth
```

| Rama | Tipo | Función |
|---|---|---|
| `main` | Estática | Rama principal con el código presente en producción |
| `develop` | Estática | Rama para integraciones de las features |
| `feature_x` | Dinámica | Rama para desarrollo de nuevas funciones, una rama por cada feature |
| `hotfix_x` | Dinámica | Rama para correcciones urgentes |

---