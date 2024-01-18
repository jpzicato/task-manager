# Task manager

Task manager es una aplicación GraphQL desarrollada en Node.js con Apollo Server y el framework Express.js. Permite a los usuarios organizar proyectos y tareas, para mantener un control claro de las responsabilidades diarias.

## Tecnologías utilizadas

Este aplicación hace uso de las siguientes tecnologías:

- **@apollo/server:** Servidor GraphQL para facilitar el desarrollo de la API.
- **@graphql-tools/schema:** Herramientas para construir un esquema GraphQL.
- **bcryptjs:** Biblioteca para el cifrado de contraseñas.
- **dotenv:** Carga de variables de entorno desde un archivo .env.
- **express:** Framework web para Node.js.
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

   - Este comando ejecuta un contenedor de MongoDB utilizando la imagen "mongo:6.0". Se conecta a la red "task-manager" y mapea el puerto 27018 del host, (se utiliza el puerto 27018, por si MongoDB ya se encuentra instalado en su sistema utilizando el puerto 27017), al puerto 27017 del contenedor. El uso de un nombre específico (--name) facilita la referencia en otros comandos o scripts.

   ```bash
   docker build -t task-manager .
   ```

   - Construye una imagen Docker para tu aplicación. El uso de la etiqueta (-t) le da un nombre específico ("task-manager"). Asegúrate de estar en el directorio correcto antes de ejecutar este comando.

   ```bash
   docker run --name task-manager --network task-manager -p HOST_PORT:8080 task-manager
   ```

   Ejecuta un contenedor de tu aplicación utilizando la imagen "task-manager". Se conecta a la red "task-manager" y mapea el puerto del host, (asegúrate de reemplazar `HOST_PORT` por el valor real de la variable de entorno utilizada en task manager), al puerto 8080 del contenedor. Nuevamente, el uso de un nombre (--name) facilita su gestión.

## Interfaz gráfica de Apollo

Task manager utiliza la interfaz gráfica de Apollo (Apollo GraphQL Playground) para facilitar la interacción y exploración de la API GraphQL. Sigue estos pasos para acceder a la interfaz gráfica y realizar consultas:

1. Una vez que hayas configurado y ejecutado la aplicación siguiendo los pasos anteriores, abre tu navegador web.

2. Navega a la siguiente URL en tu navegador:

- [Interfaz gráfica de Apollo](http://localhost:HOST_PORT/)

Asegúrate de reemplazar `HOST_PORT` por el valor real de la variable de entorno utilizada en task manager.

3. Serás redirigido a la interfaz gráfica de Apollo, donde podrás explorar el esquema GraphQL de la aplicación y realizar consultas interactivas.

4. Utiliza la interfaz gráfica para probar consultas, mutaciones y explorar la documentación dinámica generada automáticamente por Apollo.

## Autenticación

Para realizar consultas y mutaciones en task manager, la autenticación mediante un token Bearer es requerida, excepto para las siguientes mutaciones: `signUp`, `logIn`, `renewAccessToken` y `logOut`. Sigue estos pasos para incluir tu token de autenticación en las solicitudes:

1. Obtén un token de autenticación mediante el proceso de inicio de sesión, registro o renovación del token de acceso. Este token debe tener el formato JWT (JSON Web Token).

2. Incluye el token de autenticación en la cabecera de tus solicitudes GraphQL utilizando el esquema Bearer. Aquí hay un ejemplo utilizando la herramienta cURL:

```bash
curl --location --request POST 'http://localhost:HOST_PORT/' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer tu_token_aqui' \
  --data '{ "query": "tu_consulta_o_mutacion_aqui" }'
```

Asegúrate de reemplazar `HOST_PORT`, `tu_token_aqui` y `tu_consulta_o_mutacion_aqui` con sus valores reales.

## Detalles Adicionales

### Duración del Token

Los tokens de autenticación emitidos tienen una duración limitada. Esto se realiza mediante la variable de entorno `ACCESS_TOKEN_EXPIRATION`.

### Renovación de Token

Para mantener la sesión activa, puedes renovar tu token antes de que expire. Utiliza la operación `renewAccessToken` proporcionada por la API para obtener un nuevo token.
