<script setup>
import { provide, ref } from 'vue';
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';
import { globalFeedbackProviderKey } from './symbols/provider-keys';

const feedback = ref({
    message: null,
    type: null,
});

function updateFeedback(newFeedback) {
    // if(typeof newFeedback !== 'object') throw new Error();

    feedback.value = newFeedback;
}

// Hacemos un "provide" para proveer a todos los descendientes de algunas funcionalidades. Específicamente en este caso,
// manejo del mensaje de feedback.
// provide() recibe 2 parámetro:
// 1. Clave para identificar la dependencia que se provee.
// 2. El contenido de la dependencia en sí. Típicamente, suele ser un objeto.
// Es importante aclarar que si bien podemos pasar cualquier cosa en el provide como por ejemplo, un ref, en
// generawl se recomienda evitar pasar los refs directamente.
// Si pasamos un ref, el que inyecte esta dependencia va a poder modificar libremente el contenido del ref. Y esto
// queda modificado para todos. Si lo modifican de manera incorrecta, se puede volver complicado encontrar quién
// es el culpable.
// Para peor, pasar el ref promueve este tipo de comportamientos.
// En su lugar, lo que se recomienda pasar es:
// a. Funciones.
// b. Versiones de solo lectura de un valor. Vue ofrece la función de readonly() para hacer esto.
// Con respecto a las claves para las dependencias, suele ser una buena idea:
// a. Usar una variable constante externa que todos puedan importar.
// b. Usar un Symbol en vez de un string.
provide(globalFeedbackProviderKey, {
    // feedback,
    updateFeedback,
});
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <div
            v-if="feedback.message !== null"
            class="p-4 mb-4 rounded"
            :class="{
                'bg-red-100': feedback.type === 'error',
                'bg-green-100': feedback.type === 'success',
            }"
        >
            {{ feedback.message }}
        </div>

        <!-- 
        RouterView es donde se va a montar el componente asociar a la ruta que se
        esté visitando.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>