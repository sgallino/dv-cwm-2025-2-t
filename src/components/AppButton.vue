<script setup>
import AppLoader from './AppLoader.vue';

// En la Composition API las propiedades se declaran usando la "macro" defineProps().
// defineProps recibe como argumento lo mismo que asignaríamos al a propiedad "props" en la Options API.
// Podemos notar que a defineProps() no la importamos. Esto es porque es una "macro".
// Dentro de la Composition de Vue, una "macro" es una indicación para el compilador de Vue (similar al propio
// atributo "setup" del <script>), y no una función.
defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
});

// TODO: Permitir distintos colores de botones a través de props.
</script>

<template>
    <button
        class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white"
    >
        <slot v-if="!loading" />
        <AppLoader v-else />
    </button>
</template>