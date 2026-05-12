-- Schema for Cloudflare D1 (SQLite)

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS peliculas;
CREATE TABLE peliculas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    portada_url TEXT,
    disponible INTEGER DEFAULT 1
);

DROP TABLE IF EXISTS rentas;
CREATE TABLE rentas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    pelicula_id INTEGER NOT NULL,
    fecha_renta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id),
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

-- Insert some initial data
INSERT INTO peliculas (titulo, descripcion, portada_url, disponible) VALUES 
('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality.', 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg', 1),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg', 1),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg', 1);
