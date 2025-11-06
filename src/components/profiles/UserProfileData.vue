<script setup>
import { computed } from 'vue';
import { getFileURL } from '../../services/storage';
import NoImage from '/no-image.jpg';

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

const profileImage = computed(() => props.user.photo_url ? getFileURL(props.user.photo_url) : NoImage );
</script>

<template>
    <div class="flex gap-4 mb-4">
        <div class="w-1/4">
            <img
                :src="profileImage"
                alt=""
            >
            <!-- 
            Para referenciar assets que existen dentro de [public] solo necesitamos armar la URL de manera relativa
            a la raíz.
            Por ejemplo:
                /{assetEnPublic}
            -->
            <!-- <img
                v-else
                :src="NoImage"
                alt=""
            > -->
        </div>
        <div class="w-3/4">
            <div class="ms-4 my-8 text-gray-700 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

            <dl>
                <dt class="mb-1 font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="mb-1 font-bold">Nombre</dt>
                <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="mb-1 font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>
</template>