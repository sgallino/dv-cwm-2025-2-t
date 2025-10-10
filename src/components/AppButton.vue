<script>
import AppLoader from './AppLoader.vue';

export default {
    name: 'AppButton',
    components: { AppLoader, },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
    },
}

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