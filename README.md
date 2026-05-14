# Proyecto_DesarrolloContinuo_Back<div align="center">
<div> 

# Proyecto Final - Backend
**Infraestructura para el Desarrollo Continuo** | demo_implementation


---

## Descripción del Back

API REST para un sistema de renta de películas en línea. Gestiona usuarios, catálogo de películas y operaciones de renta. Construida con Node.js + Express, base de datos MySQL y autenticación JWT.

---



## Módulos y Métodos

### Usuarios
 
**userController**
- `register(req, res)` - valida campos, verifica que el email no exista, hashea la contraseña con bcrypt y crea el usuario.
- `login(req, res)` - verifica credenciales, compara hash con bcrypt y emite un JWT firmado.

**userModel**
- `getUserByEmail(email)` - busca un usuario por correo electrónico.
- `createUser(nombre, email, password)` - inserta un usuario y retorna su ID.
- `getAllUsers()` - retorna todos los usuarios.

**Tabla `users`**
| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT | PK, auto-increment |
| `nombre` | VARCHAR | Nombre del usuario |
| `email` | VARCHAR | Único |
| `password` | VARCHAR | Hash bcrypt |
 
---
 
### Películas
 
**movieController**
- `listMovies(req, res)` - retorna todas las películas con `disponible = 1`.
- `getMovie(req, res)` - obtiene una película por ID.
- `addMovie(req, res)` - inserta una nueva película en el catálogo.
- `editMovie(req, res)` - actualiza los datos de una película existente.
- `removeMovie(req, res)` - elimina una película del catálogo.

**movieModel**
- `getAllMovies()` - retorna películas disponibles.
- `getMovieById(id)` - busca por ID.
- `createMovie(titulo, descripcion, portada_url, disponible)` - inserta película.
- `updateMovie(id, titulo, descripcion, portada_url, disponible)` - actualiza película.
- `deleteMovie(id)` - elimina película.

**Tabla `peliculas`**
| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT | PK, auto-increment |
| `titulo` | VARCHAR | Título de la película |
| `descripcion` | TEXT | Descripción |
| `portada_url` | VARCHAR | URL de la imagen |
| `disponible` | TINYINT | 1 = disponible |
 
---
 
### Rentas
 
**rentController** - rutas protegidas por `verifyToken`
- `rent(req, res)` - registra una renta para el usuario autenticado.
- `listUserRents(req, res)` - retorna rentas activas del usuario con datos de la película.
- `returnRentedMovie(req, res)` - elimina el registro de renta.

**rentModel**
- `rentMovie(userId, movieId)` - inserta en `rentas` con fecha actual (`NOW()`).
- `getRentedMoviesByUser(userId)` - JOIN con `peliculas` para retornar título, descripción, portada y fecha.
- `returnMovie(rentId, userId)` - DELETE validando que la renta pertenezca al usuario.

**Tabla `rentas`**
| Campo | Tipo | Notas |
|---|---|---|
| `id` | INT | PK, auto-increment |
| `usuario_id` | INT | FK -> users.id |
| `pelicula_id` | INT | FK -> peliculas.id |
| `fecha_renta` | DATETIME | Generada con `NOW()` |
 
---



## Endpoints de la API
 
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/users/register` | No | Registra un nuevo usuario |
| `POST` | `/api/users/login` | No | Inicia sesión y retorna JWT |
| `GET` | `/api/movies` | No | Lista películas disponibles |
| `GET` | `/api/movies/:id` | No | Obtiene una película por ID |
| `POST` | `/api/movies` | No | Crea una nueva película |
| `PUT` | `/api/movies/:id` | No | Actualiza una película |
| `DELETE` | `/api/movies/:id` | No | Elimina una película |
| `POST` | `/api/rents` | (Si) JWT | Renta una película |
| `GET` | `/api/rents` | (Si) JWT | Lista rentas activas del usuario |
| `DELETE` | `/api/rents/:id` | (Si) JWT | Devuelve una película rentada |
 
---



## Stack Tecnológico
 
| Capa | Tecnología |
|---|---|
| **Runtime** | Node.js + Express 5 |
| **Base de datos** | MySQL |
| **Autenticación** | JWT + bcryptjs |
| **Testing** | Jest + Supertest |
| **CI/CD** | GitHub Actions |
| **Hosting** | Cloudflare Workers |
| **Secrets** | GitHub Environments |
 
---



## Pipeline CI/CD
 
El pipeline del backend corre tests antes de cualquier deploy. Si algún test falla, el pipeline se detiene y bloquea el merge.
 
```
push -> test (Jest) -> deploy dev -> [aprobación manual] -> deploy prod
```
 
---
 


## Estrategia de Ramas
 
```
main  ●────────────────────────────────────────────────────>  PROD
                                              ▲
                                              │  Requiere: aprobación manual
develop ●──────────────────────────────────────────────────>  DEV
         ▲                     ▲                    ▲
         │                     │                    │
      feature/              feature/             hotfix/
      auth                  movies               fix-jwt
```
 
| Rama | Tipo | Función |
|---|---|---|
| `main` | Estática | Código en producción |
| `develop` | Estática | Integración de features |
| `feature/x` | Dinámica | Desarrollo de nuevas funcionalidades |
| `hotfix/x` | Dinámica | Correcciones urgentes sobre `main` |
 
---



## Instalación Local
 
```bash
# Clonar el repositorio
git clone https://github.com/<usuario>/Proyecto_DesarrolloContinuo_Back.git
cd Proyecto_DesarrolloContinuo_Back
 
# Instalar dependencias
npm install
 
# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
 
# Correr el servidor
npm start
 
# Correr pruebas
npm test
```
