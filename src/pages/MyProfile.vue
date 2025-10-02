<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';

let unsubscribeFromAuth = () => {};

export default {
    name: 'MyProfile',
    components: { AppH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    mounted() {
        // Guardamos la función que cancela la suscripción.
        unsubscribeFromAuth = subscribeToAuthStateChanges(newUserState => this.user = newUserState);
    },
    unmounted() {
        unsubscribeFromAuth();
    },
}
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