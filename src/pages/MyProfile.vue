<script setup>
import AppH1 from '../components/AppH1.vue';
import useAuthUserState from '../composables/useAuthUserState';

// La forma recomendada de trabajar con la Composition API es organizando las responsabilidades lógicas en
// "composables".
// Un "composable" es una función que:
// - Por convención, llevan el prefijo "use".
// - Utilizan al menos una de las funciones del core de Vue (ej: ref, computed, onMounted, etc).
// - Como una buena práctica general, no deberían tener dependencias "hard-codeadas". Cualquier valor que necesiten
//  y no define el propio "composable" debería recibirse como parámetro.
// Luego, el componente lo único que hace es llamar a esas funciones para obtener los valores que necesita.
// Si el composable necesita brindar información que se use en el componente (lo habitual), debe retornar esos 
// valores.
// Esto tiene beneficios:
// - Facilita la eventual reutilización del código.
// - Facilita el testing.
// - Facilita la legibilidad del código.
// - Facilita el mantenimiento.
// - Evita colisiones de nombres, funciones, variables, etc, entre distintas responsabilidades.

const user = useAuthUserState();
</script>

<template>
    <div class="flex items-end gap-4">
        <AppH1>Mi perfil</AppH1>
        <RouterLink class="mb-4 text-blue-700 underline" to="/mi-perfil/editar">Editar</RouterLink>
    </div>

    <div class="ms-4 my-8 text-gray-700 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

    <dl>
        <dt class="mb-1 font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="mb-1 font-bold">Nombre</dt>
        <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
        <dt class="mb-1 font-bold">Carrera</dt>
        <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
    </dl>
</template>