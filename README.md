# 🧶 EntreLanas - E-commerce de Productos Artesanales

Bienvenido a **EntreLanas**, una aplicación web completa (Full Stack) para la gestión y venta de productos artesanales de lana. Este proyecto permite a los usuarios registrarse, explorar un catálogo de productos, gestionar un carrito de compras y simular pedidos.

La aplicación está dividida en dos partes principales:
- **Backend:** Desarrollado con Java y Spring Boot (API REST).
- **Frontend:** Desarrollado con React, Vite y Bootstrap (Interfaz de usuario).

---

## 📋 Requisitos Previos

Para ejecutar este proyecto en tu ordenador, necesitas tener instalado el siguiente software. No te preocupes si no conoces estas herramientas, sigue los enlaces para instalarlas:

1.  **Java JDK 21 (o 17):** Necesario para ejecutar el Backend.
    * [Descargar JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
2.  **Node.js (Versión LTS):** Necesario para ejecutar el Frontend.
    * [Descargar Node.js](https://nodejs.org/es/)
3.  **MySQL Server:** La base de datos donde se guardará la información.
    * [Descargar MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
    * *Nota:* Durante la instalación, recuerda la contraseña que le pongas al usuario `root`.
4.  **Un Editor de Código:** Recomendamos **Visual Studio Code**.
    * [Descargar VS Code](https://code.visualstudio.com/)

---

## 🚀 Guía de Instalación y Ejecución Paso a Paso

Sigue estos pasos en orden para poner en marcha la aplicación.

### PASO 1: Configuración de la Base de Datos

Antes de arrancar nada, necesitamos crear la base de datos vacía.

1.  Abre tu gestor de base de datos (MySQL Workbench, HeidiSQL o la terminal).
2.  Ejecuta el siguiente comando SQL para crear la base de datos:
    ```sql
    CREATE DATABASE entrelanas_v2;
    ```
3.  ¡Listo! No necesitas crear tablas, la aplicación las creará automáticamente al iniciarse.

---

### PASO 2: Configuración y Ejecución del Backend (Servidor)

El Backend es el cerebro de la aplicación. Debe estar encendido para que todo funcione.

1.  Navega a la carpeta del Backend:
    ```bash
    cd EntreLanas-Back
    ```

2.  **Configurar la conexión a Base de Datos:**
    * Abre el archivo: `src/main/resources/application.properties`.
    * Busca las siguientes líneas y asegúrate de que coinciden con tu instalación de MySQL:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/entrelanas_v2?createDatabaseIfNotExist=true
    spring.datasource.username=root
    spring.datasource.password=TU_CONTRASEÑA_DE_MYSQL  <-- PON AQUÍ TU CONTRASEÑA
    ```

3.  **Iniciar el Servidor:**
    * Si usas **VS Code**: Abre el archivo `EntreLanasApplication.java` y pulsa el botón **"Run"** o **"Play"**.
    * Si usas **Terminal**: Ejecuta el siguiente comando dentro de la carpeta `EntreLanas-Back`:
        ```bash
        ./mvnw spring-boot:run
        ```
    * *(En Windows PowerShell puede ser `./mvnw.cmd spring-boot:run`)*.

4.  **Verificación:**
    * Espera a que termine de cargar. Deberás ver un mensaje en la consola que dice: `Started EntreLanasApplication in X seconds`.
    * El servidor estará escuchando en el puerto **8080**.

---

### PASO 3: Configuración y Ejecución del Frontend (Cliente Web)

Ahora vamos a arrancar la página web.

1.  Abre una **NUEVA terminal** (no cierres la del Backend).
2.  Navega a la carpeta del Frontend:
    ```bash
    cd EntreLanas-Front
    ```

3.  **Instalar las dependencias (Librerías):**
    * Ejecuta el siguiente comando para descargar las librerías necesarias (React, Bootstrap, etc.):
    ```bash
    npm install
    ```

4.  **Iniciar la Web:**
    * Ejecuta el comando:
    ```bash
    npm run dev
    ```

5.  Verás un mensaje que dice `Local: http://localhost:5173/`. Haz clic en ese enlace o ábrelo en tu navegador.

---

## 🛒 Cómo usar la aplicación

Una vez tengas todo corriendo (Backend en puerto 8080 y Frontend en puerto 5173):

### 1. Usuarios de Prueba
La aplicación carga automáticamente unos datos de prueba al iniciar. Puedes usar estas credenciales para entrar sin registrarte:

* **Usuario:** `maria`
* **Contraseña:** `123`

* **Usuario:** `pepe`
* **Contraseña:** `123`

* **Usuario:** `admin`
* **Contraseña:** `123`

### 2. Flujo de prueba recomendado
1.  Entra en la web. Verás el catálogo de productos.
2.  Intenta añadir un producto al carrito (Botón **"Añadir"**).
3.  Ve al **Login** e inicia sesión con `maria` / `123`.
4.  Verás tu nombre en la barra superior ("Hola, Maria").
5.  Añade varios productos al carrito.
6.  Ve al **Carrito** (icono en el menú superior).
7.  Pulsa en **"Pagar Ahora"** para simular la compra.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:**
    * Java 21
    * Spring Boot 3 (Web, Data JPA)
    * MySQL Driver
* **Frontend:**
    * React JS + Vite
    * Bootstrap 5 (Estilos)
    * Axios (Conexión API)
    * React Router DOM (Navegación)
* **Base de Datos:**
    * MySQL

---

## ❓ Solución de Problemas Comunes

**Error: "Connection refused" o "Network Error" en el Frontend**
* **Causa:** El Backend (Java) está apagado.
* **Solución:** Asegúrate de que la terminal de Java sigue abierta y no ha dado errores.

**Error: "Access denied for user 'root'@'localhost'"**
* **Causa:** La contraseña de la base de datos en `application.properties` es incorrecta.
* **Solución:** Revisa el PASO 2 y pon tu contraseña real de MySQL.

**Error: "Port 8080 was already in use"**
* **Causa:** Tienes otra instancia del servidor abierta.
* **Solución:** Cierra todas las terminales de Java o reinicia el ordenador e inténtalo de nuevo.