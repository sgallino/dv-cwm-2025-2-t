// Este es el archivo de configuración de Vite.
// Como todo archivo [.config.js] debe exportar por default un objeto de
// configuración.
// El plugin lo instalamos con el comando:
//  npm install --save-dev @vitejs/plugin-vue
//
// ¿Qué significa el flag "--save-dev" (o "-D");
// Esto sirve para indicarle a npm que queremos que registre la dependencia
// como una dependencia de desarrollo o "dev dependency".
//
// ¿Qué diferencia tiene una "dependency" y una "dev dependency"?
// En qué entornos deben instalarse los paquetes.
// Una dependencia común tiene que instalarse siempre en cualquier entorno
// donde se corra el install. Es decir, mi programa "depende" de estos
// paquetes para funcionar.
// Las "dev dependencies" solo son necesarias en los entornos de desarrollo
// o testing. Y no deberían instalarse en entornos de producción.
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
    // La propiedad "plugins" contiene un array de plugins.
    // Cada plugin suele crearse llamando a alguna función.
    plugins: [vue(), tailwindcss()],
}