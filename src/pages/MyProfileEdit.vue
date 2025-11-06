<script setup>
import { onMounted, ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { updateAuthUser } from '../services/auth';
import useAuthUserState from '../composables/useAuthUserState';

const user = useAuthUserState();

const { formData, loading, handleSubmit } = useEditProfileForm(user);

function useEditProfileForm(user) {
    const formData = ref({
        display_name: '',
        bio: '',
        career: '',
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;

            await updateAuthUser(formData.value);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    onMounted(() => {
        formData.value = {
            display_name: user.value.display_name,
            bio: user.value.bio,
            career: user.value.career,
        }
    });

    return {
        formData,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Actualizar mi perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-1">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-1">Nombre</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-1">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.career"
            >
        </div>
        <AppButton 
            type="submit"
            :loading="loading"
        >
            Actualizar
        </AppButton>
    </form>
</template>