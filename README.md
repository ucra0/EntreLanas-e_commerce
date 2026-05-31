# EntreLanas — E-commerce de Artesanía

Proyecto Final de Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

EntreLanas es una tienda online de productos artesanales de ganchillo, amigurumis y mercería, desarrollada como aplicación web full stack con arquitectura cliente-servidor.

---

## Tecnologías utilizadas

### Backend
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- MySQL 8
- JavaMailSender (SMTP Gmail)

### Frontend
- React 18 + Vite
- Bootstrap 5
- CSS personalizado
- Axios
- React Router v6
- PayPal SDK (`@paypal/react-paypal-js`)

---

## Estructura del proyecto

```
EntreLanas/
├── EntreLanas-Back/        # Backend Spring Boot
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── e_commerce/EntreLanas_Back/
│       │   │       ├── Controller/
│       │   │       ├── Services/
│       │   │       ├── repositories/
│       │   │       ├── model/
│       │   │       ├── dtos/
│       │   │       └── mappers/
│       │   └── resources/
│       │       ├── application.properties
│       │       └── data.sql
└── EntreLanas-Front/       # Frontend React
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        └── pages/
```

---

## Requisitos previos

- Java 17 o superior
- Node.js 18 o superior y npm
- MySQL 8 o superior
- Maven (o usar el wrapper `mvnw` incluido)

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/ucra0/EntreLanas.git
cd EntreLanas
```

### 2. Configurar la base de datos

Crear una base de datos vacía en MySQL:

```sql
CREATE DATABASE entrelanas;
```

### 3. Configurar el backend

Editar el fichero `EntreLanas-Back/src/main/resources/application.properties` con tus credenciales:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/entrelanas
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=TU_EMAIL@gmail.com
spring.mail.password=TU_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
app.mail.from=EntreLanas <TU_EMAIL@gmail.com>
```

### 4. Arrancar el backend

```bash
cd EntreLanas-Back
./mvnw spring-boot:run
```

El backend arrancará en `http://localhost:8080`. En el primer arranque, Hibernate creará las tablas automáticamente y `data.sql` cargará los datos de prueba.

### 5. Instalar dependencias del frontend

```bash
cd EntreLanas-Front
npm install
```

### 6. Arrancar el frontend

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> El backend debe estar arrancado antes de abrir el frontend.

---

##  Credenciales de prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | admin | 123 |
| Cliente | pepe | 123 |
| Cliente | maria | 123

---

## Funcionalidades principales

- Catálogo con filtros por categoría, color, fibra, talla, precio y más
- Paginación actualizada por URL
- Detalle de producto con gestión de stock
- Carrito de compra
- Checkout con múltiples métodos de pago (tarjeta, PayPal, Bizum, Klarna)
- Registro con email de confirmación automático
- Gestión de favoritos persistente
- Lista de deseos para productos agotados
- Historial de pedidos
- Panel de administración completo (productos, pedidos, usuarios)
- Sistema de roles (ROLE_USER / ROLE_ADMIN)

---

## Configuración del email

El proyecto usa Gmail SMTP con contraseña de aplicación. Para generarla:

1. Activa la verificación en dos pasos en tu cuenta de Google
2. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Genera una contraseña para la aplicación y pégala en `application.properties`

---

## Licencia

Proyecto académico desarrollado para el Proyecto Final de Ciclo DAW.  
© 2025 — Todos los derechos reservados.
