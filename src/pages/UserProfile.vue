<script>
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { getUserProfileById } from '../services/user-profiles';

export default {
    name: 'UserProfile',
    components: { AppH1, AppLoader, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true;

            // this.$route nos da acceso a la ruta en la que estamos. Útil, por ejemplo, para obtener el parámetro
            // de ruta.
            this.user = await getUserProfileById(this.$route.params.id);
        } catch (error) {
            // TODO
        }
        this.loading = false;
    },
}
</script>

<template>
    <template v-if="!loading">
        <div class="flex items-end gap-4">
            <AppH1>Perfil de {{ user.email }}</AppH1>
        </div>

        <div class="ms-4 my-8 text-gray-700 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

        <dl class="mb-4">
            <dt class="mb-1 font-bold">Email</dt>
            <dd class="mb-2">{{ user.email }}</dd>
            <dt class="mb-1 font-bold">Nombre</dt>
            <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
            <dt class="mb-1 font-bold">Carrera</dt>
            <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
        </dl>

        <hr class="mb-4">

        <RouterLink
            class="text-blue-700 underline"
            :to="`/usuario/${user.id}/chat`"
        >
            Iniciar conversación privada con {{ user.email }}
        </RouterLink>
    </template>
    <template v-else>
        <AppLoader />
    </template>
</template>