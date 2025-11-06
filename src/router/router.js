// Este es nuestro archivo de routing.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthStateChanges } from "../services/auth";
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateChat from "../pages/PrivateChat.vue";
import MyProfileEditAvatar from "../pages/MyProfileEditAvatar.vue";

// Definimos nuestro array de rutas.
// Cada ruta debe ser un objeto que tenga al menos 2 propiedades:
// 1. path. La URL a partir de la raíz de mi sitio.
// 2. component. El componente que queremos renderizar para esa ruta.
// Puede recibir otras propiedades:
// 3. meta: Es un objeto que nos permite guardar metadata de la ruta. Esto es, valores arbitrarios que 
//  queramos asociar con ella.
const routes = [
    { path: '/',                                    component: Home, },
    { path: '/ingresar',                            component: Login, },
    { path: '/crear-cuenta',                        component: Register, },
    { path: '/chat',                                component: GlobalChat,          meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',                           component: MyProfile,           meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',                    component: MyProfileEdit,       meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar/foto',               component: MyProfileEditAvatar, meta: { requiresAuth: true, }, },
    { path: '/usuario/:id',                         component: UserProfile,         meta: { requiresAuth: true, }, },
    { path: '/usuario/:id/chat',                    component: PrivateChat,         meta: { requiresAuth: true, }, },
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

// Protección de rutas para usuarios autenticados.
// Primero, necesitamos obtener los datos del usuario autenticado.
let user = {
    id: null,
    email: null,
}
subscribeToAuthStateChanges(newUserState => user = newUserState);

// Ahora vamos a utilizar el "guard global" del Router: beforeEach
// Un "navigation guard" es una función que puede decidir si permite que ocurra una navegación,
// si lo prohibe (retornando false) o si redirecciona a otra ruta (retornando una nueva URL o ruta).
// Esta función va a recibir 2 parámetros:
// 1. RouteNormalized. La ruta a la que se está navegando.
// 2. RouteNormalized. La ruta de la cual provenimos.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return '/ingresar';
    }

    // console.group('🚦 Routes');
    // console.log('Navegando desde la ruta: ', from);
    // console.log('Navegando a la ruta: ', to);
    // console.groupEnd();
});

export default router;