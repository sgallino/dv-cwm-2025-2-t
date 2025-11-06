<script setup>
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { useRoute } from 'vue-router';
import useUserProfile from '../composables/useUserProfile';
import UserProfileData from '../components/profiles/UserProfileData.vue';

const route = useRoute();
const { user, loading } = useUserProfile(route.params.id);
</script>

<template>
    <template v-if="!loading">
        <div class="flex items-end gap-4">
            <AppH1>Perfil de {{ user.email }}</AppH1>
        </div>
        
        <UserProfileData :user="user" />

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