import { supabase } from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";

/*
# Ofreciendo los datos del estado de autenticación con el patrón Observer
En nuestra sistema va a ver múltiples componentes y archivos que necesiten saber del estado de autenticación. Esto
incluye enterarse automáticamente de los cambios que ocurran en ese estado.

Para resolverlo de una manera general, que no dependa de ningún framework ni nada por el estilo, vamos a hacer
uso de uno de los patrones de diseño más populares: Observer.

https://refactoring.guru/design-patterns/observer

El patrón Observer permite modelar una relación entre elementos del sistema de 1 a muchos.
Esto se refiere al escenario en que muchos elementos de nuestro sistemas (clases, scripts, componentes, etc), que
vamos a llamar "observers" están interesados en saber de los cambios de valor o estado, o de comportamientos, de
otro elemento, al que vamos a llamar el "subject".

La mayor parte del trabajo va a recaer en el "subject". Los "observers" simplemente van a sacar provecho de esta
funcionalidad.

Para los "observers" poder enterarse de los cambios o sucesos ocurridos del "subject", necesitamos primero
"suscribirse" a ellos.
"Suscribirse" es el término tradicional que usamos en el patrón "Observer". Pero también lo pueden ver con otros
nombres en otros contextos. Por ejemplo, pueden ver usarse "attach", "listen" o "watch".
Si recuerdan el modelo de eventos de JS, recordarán que usamos el addEventListener. En efecto, el modelo de
eventos de JS es una implementación de este patrón.

Para implementar este patrón, necesitamos cumplir con algunos requisitos:
- Tener un "subject". En nuestro caso, va a ser un objeto con los datos del usuario.
- Tener una variable donde guardar los "observers" que se "suscriben". Nosotros vamos a usar un array.
- Tener una función que permita a un "observer" "suscribirse" a los cambios del "subject".
- Tener una función que permita notificar a los "observers" de los cambios del "subject".
*/

let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
    career: null,
}
let observers = [];

// Tratamos de cargar los datos del usuario, si es que ya está autenticado.
loadCurrentUserAuthState();

async function loadCurrentUserAuthState() {
    // Los datos del usuario actual se pueden obtener con el método getUser de la propiedad auth.
    // Nos retorna, si está autenticado, los datos del usuario. Y sino, retorna un error.
    const { data, error } = await supabase.auth.getUser();

    if(error) {
        console.warn('No hay un usuario autenticado.');
        return;
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    });

    // En paralelo, dejamos cargando el perfil completo del usuario.
    fetchFullProfile();
}

/**
 * Carga la data del perfil completo del usaurio.
 */
async function fetchFullProfile() {
    try {
        // const userProfile = await getUserProfileById(user.id);
        // setUser(userProfile);
        setUser(await getUserProfileById(user.id));
    } catch (error) {
        // TODO...
    }
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function register(email, password) {
    try {
        // Para interactuar con la autenticación de Supabase, podemos usar el objeto "auth" del cliente de Supabase.
        // Este objeto tiene varios métodos para interactuar con este sistema, incluyendo el método "signUp" para
        // registrarnos.
        // Recibe un objeto como parámetro. Debe contener los detalles del usuario a registrar.
        // En nuestro caso, vamos a pasarle el email y el password. Pero puede recibir otros datos como un "phone" en
        // vez del email, una propiedad "options", etc.
        // Retorna el clásico objeto de Response de Supabase, que contiene las propiedades "data" y "error".
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if(error) {
            console.error('[auth.js register] Error al registrar el usuario.', error);
            throw new Error(error.message);
        }

        // Creamos el perfil del usuario.
        await createUserProfile({
            id: data.user.id,
            email: data.user.email,
        });

        // console.log("Usuario creado con éxito: ", data);
        setUser({
            id: data.user.id,
            email: data.user.email,
        });
    } catch (error) {
        // TODO...
    }
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión.', error);
        throw new Error(error.message);
    }
    
    // console.log("Sesión iniciada con éxito: ", data);
    setUser({
        id: data.user.id,
        email: data.user.email,
    });

    fetchFullProfile();
}

export async function logout() {
    supabase.auth.signOut();

    setUser({
        id: null,
        email: null,
    });
}

/**
 * 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data
 */
export async function updateAuthUser(data) {
    try {
        await updateUserProfile(user.id, data);

        // Actualizamos los datos locales del perfil con la nueva info.
        setUser(data);
    } catch (error) {
        // TODO
    }
}

/*------------------------------------------------------------------------------
| Implementación del Observer
+-------------------------------------------------------------------------------*/
/**
 * 
 * @param {(userState: {id: null|String, email: null|String, display_name: null|String, bio: null|String, career: null|String}) => void} callback El observer a adjuntar.
 */
export function subscribeToAuthStateChanges(callback) {
    // El proceso de suscripción de un observer es, simplemente, agregarlo en nuestro array de observers.
    // Además, lo vamos a invocar inmediatamente, para pasarle los datos actuales del usuario.
    // De esta forma, tan pronto se suscriba, va a poder usar la info actual.
    observers.push(callback);

    // console.log("Nuevo observer agregado. El stack actual es: ", observers);
    
    notify(callback);

    // Siempre que trabajamos con algún tipo de suscripción es esencial que brindemos alguna forma de
    // cancelar o terminar esa suscripción.
    // Si no lo hacemos, nuestro código va a tener "memory leaks".
    // Vamos a, pues, retornar una nueva función que al ejecutarse cancele la suscripción ("unsubscribe").
    return () => {
        observers = observers.filter(obs => callback != obs);

        // console.log("Observer removido. El stack actual es: ", observers);
    }
}

/**
 * 
 * @param {(userState: {id: null|String, email: null|String, display_name: null|String, bio: null|String, career: null|String}) => void} callback 
 */
function notify(callback) {
    callback({
        ...user
    }); // Noten que pasamos una copia de los datos, no la variable original.
}

/**
 * Notifica a todos los observers del cambio del estado de autenticación.
 * Esta función debe llamarse cada vez que cambiemos el valor de la variable "user".
 */
function notifyAll() {
    observers.forEach(notify);
    // observers.forEach(callback => notify(callback));
}

function setUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll();
}