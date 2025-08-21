// Este es nuestro archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

// Definimos nuestro array de rutas.
// Cada ruta debe ser un objeto que tenga al menos 2 propiedades:
// 1. path. La URL a partir de la raíz de mi sitio.
// 2. component. El componente que queremos renderizar para esa ruta.
const routes = [
    { path: '/',                                    component: Home, },
    { path: '/chat',                                component: GlobalChat, },
    { path: '/ingresar',                            component: Login, },
    { path: '/crear-cuenta',                        component: Register, },
];

// Creamos propiamente el router.
// A createRouter le pasamos un objeto de 2 propiedades:
// 1. routes. El array de rutas.
// 2. history. El modo de manejo del historial de navegación.
//  Se genera con las funciones createWebHistory o createWebHashHistory.
const router = createRouter({
    // routes: routes,
    routes,
    history: createWebHistory(),
});

export default router;