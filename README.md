# Task manager

Task manager es una aplicación GraphQL desarrollada en Node.js con Apollo Server. Permite a los usuarios crear, asignar y dar seguimiento a tareas de manera eficiente. Organiza tus proyectos y tareas, establece fechas de vencimiento y mantén un control claro de tus responsabilidades diarias con esta aplicación de gestión de tareas.

## Tecnologías utilizadas

Este aplicación hace uso de las siguientes tecnologías:

- **@apollo/server:** Servidor GraphQL para facilitar el desarrollo de la API.
- **@graphql-tools/schema:** Herramientas para construir un esquema GraphQL.
- **bcryptjs:** Biblioteca para el cifrado de contraseñas.
- **dotenv:** Carga de variables de entorno desde un archivo .env.
- **graphql-tag:** Análisis y procesamiento de consultas GraphQL.
- **joi:** Librería para la validación de datos.
- **jsonwebtoken:** Implementación de JSON Web Tokens (JWT) para la autenticación.
- **lodash:** Utilidades de programación funcional para simplificar operaciones en JavaScript.
- **mongoose:** ODM (Object Data Modeling) para interactuar con MongoDB de manera sencilla.
- **winston:** Biblioteca de registro de logs para facilitar el seguimiento y solución de problemas.

## Requisito previo

Antes de poder ejecutar task manager, asegúrate de tener instalado Docker en tu sistema:

- [Docker](https://www.docker.com/get-started)

## Uso

Para comenzar con task manager, sigue estos pasos:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/jpzicato/task-manager.git
   ```

2. Navega al directorio task-manager:

   ```bash
   cd task-manager
   ```

3. Crea un archivo .env basado en el archivo .env.example proporcionado y completa las variables de configuración necesarias.

4. Ejecuta la aplicación utilizando Docker, (Los comandos proporcionados son adecuados para la configuración y ejecución del entorno de tu aplicación, pero hay algunos detalles que podrían ser útiles de comentar):

   ```bash
   docker network create task-manager
   ```

   - Este comando crea una red de Docker llamada "task-manager" que será utilizada para la comunicación entre contenedores.

   ```bash
   docker run --name mongodb --network task-manager -p 27018:27017 -d mongo:6.0
   ```

   - Este comando ejecuta un contenedor de MongoDB utilizando la imagen "mongo:6.0". Se conecta a la red "task-manager" y mapea el puerto 27018 del host, (por si MongoDB ya se encuentra instalado en su sistema), al puerto 27017 del contenedor. El uso de un nombre específico (--name) facilita la referencia en otros comandos o scripts.

   ```bash
   docker build -t task-manager .
   ```

   - Construye una imagen Docker para tu aplicación. El uso de la etiqueta (-t) le da un nombre específico ("task-manager"). Asegúrate de estar en el directorio correcto antes de ejecutar este comando.

   ```bash
    docker run --name task-manager --network task-manager -p 8080:8080 -d task-manager
   ```

   Ejecuta un contenedor de tu aplicación utilizando la imagen "task-manager". Se conecta a la red "task-manager" y mapea el puerto 8080 del host, (utiliza otro puerto si 8080 ya se encuentra en uso), al puerto 8080 del contenedor. Nuevamente, el uso de un nombre (--name) facilita su gestión.
