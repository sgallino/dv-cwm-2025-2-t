/*
# Rutas de los imports en npm (y Vite)
Cuando hacemos un import de una ruta sin aclarar el directorio de origen,
npm (y Vite) automáticamente asumen que estamos hablando de un paquete de
npm que ya está instalado y existe en la carpeta [node_modules].

Por ejemplo, si hacemos:
  import { createApp } from "vue";

Se entiende que tiene que existir un paquete "vue" en [node_modules], y que
estoy pidiendo importar su "createApp".

Esto significa que si queremos importar un archivo local que *no* es de la
carpeta [node_modules], es imperativo que indiquemos un directorio de origen.
Ya sea con rutas relativas o absolutas. Por ejemplo, prefijando la ruta con:
  - /
  - ./
  - ../

Por ejemplo, si ponemos:
  import App from "./App.vue";

El archivo se importa correctamente (suponiendo que exista en la carpeta 
donde hacemos el import).
Pero si hacemos:
  import App from "App.vue";

No funciona. Porque npm va a buscar una carpeta "App.vue" dentro de la
carpeta [node_modules].
*/
// import "./bootstrap.min.css";
import "./style.css";
import { createApp } from "vue";
import router from "./router/router";
import App from "./App.vue";

const app = createApp(App);
app.use(router); // Registramos el router.
app.mount('#app');