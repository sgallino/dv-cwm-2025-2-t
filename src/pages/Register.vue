<script setup>
import { ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import { register } from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { user, loading, handleSubmit } = useRegisterForm(router);

function useRegisterForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);


    async function handleSubmit() {
        try {
            loading.value = true;

            await register(user.value.email, user.value.password);
        
            router.push('/mi-perfil');
        } catch (error) {
            // TODO:
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Crear una nueva cuenta</AppH1>
    
    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Crear cuenta</button>
    </form>
</template>