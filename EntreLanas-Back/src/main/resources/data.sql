-- 1. USUARIOS DE PRUEBA (Contraseñas en texto plano "123")
INSERT INTO usuarios (username, password, nombre, apellidos, email, rol) VALUES 
('admin', '123', 'Administrador', 'Jefe', 'admin@entrelanas.com', 'ROLE_ADMIN'),
('maria', '123', 'Maria', 'Tejedora', 'maria@gmail.com', 'ROLE_USER'),
('pepe', '123', 'Pepe', 'Cliente', 'pepe@hotmail.com', 'ROLE_USER');

-- ==========================================
-- ROPA (categoria, color, talla, fibra, estilo)
-- NOTA: tipo = NULL
-- ==========================================
INSERT INTO productos (titulo, descripcion, precio, moneda, imagen, stock, categoria, color, talla, fibra, estilo, tipo) VALUES 
('Jersey de Invierno Clásico', 'Un jersey grueso y muy calentito, ideal para los días de nieve.', 45.99, 'EUR', '/imagenes/jerseyRojoLana.jpg', 15, 'ROPA', 'ROJO', 'ADULTO', 'LANA', 'CLASICO', NULL),
('Gorrito Recién Nacido', 'Suave gorro para proteger la cabeza de los más pequeños. Hipoalergénico.', 12.50, 'EUR', '/imagenes/gorroBlancoAlgodonBebe.jpg', 30, 'ROPA', 'BLANCO', 'BEBE', 'ALGODON', 'KAWAI', NULL),
('Bufanda Premium', 'Bufanda extremadamente suave y elegante para el día a día.', 55.00, 'EUR', '/imagenes/bufandaGrisClasica.jpg', 10, 'ROPA', 'GRIS', 'ADULTO', 'CACHEMIRA', 'CLASICO', NULL),
('Chaqueta Escolar', 'Chaqueta resistente para el trote diario de los niños.', 29.90, 'EUR', '/imagenes/chaquetaEscolaAzul.jpg', 25, 'ROPA', 'AZUL', 'NIÑO', 'POLIESTER', NULL, NULL),
('Calcetines Transpirables', 'Calcetines de fibra natural, evitan la humedad y son muy cómodos.', 9.99, 'EUR', '/imagenes/calcetinesVerdesBambu.jpg', 50, 'ROPA', 'VERDE', 'ADULTO', 'BAMBU', NULL, NULL),
('Vestido Veraniego', 'Prenda fresca y ligera, ideal para paseos por la playa.', 34.50, 'EUR', '/imagenes/vestidoAmarilloLino.jpg', 12, 'ROPA', 'AMARILLO', 'NIÑO', 'LINO', 'CLASICO', NULL),
('Manoplas de Paseo', 'Manoplas brillantes y muy suaves para proteger las manitas.', 14.00, 'EUR', '/imagenes/manoplasRosasSeda.jpg', 40, 'ROPA', 'ROSA', 'BEBE', 'SEDA', NULL, NULL),
('Suéter Deportivo', 'Prenda flexible que se adapta a los movimientos.', 39.99, 'EUR', '/imagenes/chaquetaNegraNailon.jpg', 18, 'ROPA', 'NEGRO', 'ADULTO', 'NAILON', 'REALISTA', NULL);

-- ==========================================
-- AMIGURUMI (categoria, color, fibra, estilo, tipo)
-- NOTA: talla = NULL
-- ==========================================
INSERT INTO productos (titulo, descripcion, precio, moneda, imagen, stock, categoria, color, talla, fibra, estilo, tipo) VALUES 
('Pulpito Reversible', 'El famoso pulpito que muestra tu estado de ánimo. ¡Súper adorable!', 15.00, 'EUR', '/imagenes/pulpitoMoradoAlgodon.jpg', 20, 'AMIGURUMI', 'MORADO', NULL, 'ALGODON', 'KAWAI', 'MINI'),
('Perrito Guardián', 'Fiel compañero para tus llaves con mucho nivel de detalle.', 8.50, 'EUR', '/imagenes/perritoLlaveroMarron.jpg', 35, 'AMIGURUMI', 'MARRON', NULL, 'LANA', 'REALISTA', 'LLAVERO'),
('Cactus Sonriente', 'No pincha, no necesita agua y siempre te sonríe desde la estantería.', 22.00, 'EUR', '/imagenes/cactusSonriente.jpg', 15, 'AMIGURUMI', 'VERDE', NULL, 'ALGODON', 'KAWAI', 'INANIMADO'),
('Osito Tradicional', 'El clásico oso de peluche en formato miniatura.', 18.99, 'EUR', '/imagenes/osoPelucheBlanco.jpg', 22, 'AMIGURUMI', 'BLANCO', NULL, 'LANA', 'CLASICO', 'MINI'),
('Aguacate Feliz', 'Ideal para colgar en la mochila del colegio o las llaves de casa.', 7.99, 'EUR', '/imagenes/aguacateFeliz.jpg', 45, 'AMIGURUMI', 'VERDE', NULL, 'BAMBU', 'KAWAI', 'LLAVERO'),
('Taza de Café', 'Para los adictos al café. Un adorno perfecto para el escritorio.', 16.50, 'EUR', '/imagenes/tazaCafeMarron.jpg', 10, 'AMIGURUMI', 'MARRON', NULL, 'ALGODON', 'REALISTA', 'INANIMADO'),
('Gatito de la Suerte', 'Mini amigurumi para atraer la buena fortuna.', 12.00, 'EUR', '/imagenes/gatitoSuerte.jpg', 30, 'AMIGURUMI', 'NEGRO', NULL, 'LANA', 'KAWAI', 'MINI'),
('Solecito Brillante', 'Un llavero que ilumina hasta los días más nublados.', 6.50, 'EUR', '/imagenes/solecitoNaranjaLlavero.jpg', 50, 'AMIGURUMI', 'NARANJA', NULL, 'LANA', 'KAWAI', 'LLAVERO');

-- ==========================================
-- MATERIAL (categoria, color, fibra)
-- NOTA: talla, estilo y tipo = NULL
-- ==========================================
INSERT INTO productos (titulo, descripcion, precio, moneda, imagen, stock, categoria, color, talla, fibra, estilo, tipo) VALUES 
('Ovillo Merino Premium', 'Lana de altísima calidad, no pica y es muy fácil de tejer.', 8.90, 'EUR', '/imagenes/ovilloMerinoBlanco.jpg', 100, 'MATERIAL', 'BLANCO', NULL, 'LANA', NULL, NULL),
('Bobina Hilo Brillante', 'Hilo fino para detalles delicados y bordados premium.', 12.50, 'EUR', '/imagenes/bobinaHiloRojo.jpg', 60, 'MATERIAL', 'ROJO', NULL, 'SEDA', NULL, NULL),
('Ovillo Peinado 100g', 'El todoterreno de los amigurumis. No se deshilacha.', 4.50, 'EUR', '/imagenes/ovilloPeinadoAzul.jpg', 150, 'MATERIAL', 'AZUL', NULL, 'ALGODON', NULL, NULL),
('Cono Hilo Rústico', 'Ideal para prendas de verano y bolsos de macramé.', 15.00, 'EUR', '/imagenes/conoHiloRustico.jpg', 40, 'MATERIAL', 'MARRON', NULL, 'LINO', NULL, NULL),
('Madeja Lujo', 'Para esos proyectos especiales que requieren lo mejor de lo mejor.', 24.00, 'EUR', '/imagenes/maderaLujoGris.jpg', 20, 'MATERIAL', 'GRIS', NULL, 'CACHEMIRA', NULL, NULL),
('Ovillo Eco-Friendly', 'Sostenible, hipoalergénico y con un tacto súper suave.', 6.80, 'EUR', '/imagenes/ovilloVerdeBambu.jpg', 80, 'MATERIAL', 'VERDE', NULL, 'BAMBU', NULL, NULL),
('Bobina Ultra Resistente', 'Para costuras que necesiten aguantar mucha tensión.', 3.50, 'EUR', '/imagenes/bobinaNegraNailon.jpg', 200, 'MATERIAL', 'NEGRO', NULL, 'NAILON', NULL, NULL),
('Cuerda Trenzada', 'Perfecta para correas, cinturones o detalles estructurales.', 5.99, 'EUR', '/imagenes/cuerdaTrenzadaNaranja.jpg', 90, 'MATERIAL', 'NARANJA', NULL, 'POLIESTER', NULL, NULL);