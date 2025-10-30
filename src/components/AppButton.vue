<script setup>
import { computed } from 'vue';
import AppLoader from './AppLoader.vue';

// En la Composition API las propiedades se declaran usando la "macro" defineProps().
// defineProps recibe como argumento lo mismo que asignaríamos al a propiedad "props" en la Options API.
// Podemos notar que a defineProps() no la importamos. Esto es porque es una "macro".
// Dentro de la Composition de Vue, una "macro" es una indicación para el compilador de Vue (similar al propio
// atributo "setup" del <script>), y no una función.
// Si necesitamos usar las propiedades en el <script>, necesitamos capturarlas en una variable.
// No así si solo las queremos usar en el <template>. Ahí van a estar disponibles directamente.
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    variant: {
        type: String,
        default: 'primary',
    },
});

const BUTTON_COLORS = {
    'primary': 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700',
    'secondary': 'bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700',    
    'success': 'bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700',    
    'danger': 'bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700',    
};

// computed() define una propiedad computada. Recibe un callback que debe retornar el valor computado.
// Nota sobre Tailwind: Por cómo funciona Tailwind, no podemos generar los nombres de las clases de manera dinámica.
// Tenemos que armarlos de manera que siempre queden escritos los nombres de las clases completos.
const buttonColor = computed(() => BUTTON_COLORS[props.variant] ?? BUTTON_COLORS['primary']);

// Versión con switch.
// const buttonColor = computed(() => {
//     switch(props.variant) {
//         case 'secondary':
//             return 'bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700';
        
//         case 'success':
//             return 'bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700';
        
//         case 'danger':
//             return 'bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700';
        
//         case 'primary':
//         default:
//             return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700';
//     }
// });
</script>

<template>
    <button
        class="transition px-4 py-2 rounded text-white"
        :class="buttonColor"
    >
        <slot v-if="!loading" />
        <AppLoader v-else />
    </button>
</template>