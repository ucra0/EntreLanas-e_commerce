-- 1. USUARIOS DE PRUEBA (Contraseñas en texto plano "123")
-- Fíjate que usamos 'email' porque tu @AttributeOverride renombra la columna interna a 'email'
INSERT INTO usuarios (username, password, nombre, apellidos, email) VALUES 
('admin', '123', 'Administrador', 'Jefe', 'admin@entrelanas.com'),
('maria', '123', 'Maria', 'Tejedora', 'maria@gmail.com'),
('pepe', '123', 'Pepe', 'Cliente', 'pepe@hotmail.com');

-- 2. PRODUCTOS DE PRUEBA
-- Categorías: AMIGURUMI, ROPA, MATERIAL (Según tu Enum)
-- Precios y Moneda (Según tu Embeddable Dinero)

INSERT INTO productos (titulo, descripcion, precio, moneda, imagen, stock, categoria) VALUES 
('Muñeco de Nieve', 'Amigurumi hecho a mano con lana suave, ideal para navidad.', 15.50, 'EUR', 'https://placehold.co/300x200?text=Muneco', 10, 'AMIGURUMI'),
('Bufanda Infinita', 'Bufanda circular de lana merino color mostaza.', 25.00, 'EUR', 'https://placehold.co/300x200?text=Bufanda', 5, 'ROPA'),
('Pack Agujas Crochet', 'Set de 5 agujas de aluminio con mango ergonómico.', 12.99, 'EUR', 'https://placehold.co/300x200?text=Agujas', 50, 'MATERIAL'),
('Oso Dormilón', 'Peluche tejido a crochet, apto para bebés.', 18.00, 'EUR', 'https://placehold.co/300x200?text=Oso', 3, 'AMIGURUMI'),
('Gorro de Lana', 'Gorro con pompón, talla única, varios colores.', 10.00, 'EUR', 'https://placehold.co/300x200?text=Gorro', 20, 'ROPA');