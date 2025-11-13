<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../services/auth';
import AppButton from '../../components/AppButton.vue';
import { globalFeedbackProviderKey } from '../../symbols/provider-keys';

// Como en la Composition API no existe "this" (porque no se creó todavía la instancia a esta altura), no tenemos
// acceso a propiedades especiales como "this.$router", o $route, o $refs.
// En su lugar, vamos a obtener esos valores usando funciones.
// Por ejemplo, para obtener el router, tenemos el "composable" de Vue Router: useRouter().
const router = useRouter();

const { user, loading, feedback, handleSubmit } = useLoginForm(() => router.push('/mi-perfil'));

// const emits = defineEmits(['feedback-change']);

// Inyectamos la dependencia "global-feedback" que es provista por App.
// const { feedback: globalFeedback } = inject('global-feedback');
const { updateFeedback: updateGlobalFeedback } = inject(globalFeedbackProviderKey);

// Para definir los datos en la Composition API, la forma recomendada es usar la función ref() de Vue (abreviatura
// de "reactive reference").
// La función ref lo que hace es crear un nuevo objeto que envuelve al valor. Es decir, que si hacemos:
//  const saludo = ref('Hola');
// La variable similar a esto:
//  { value: 'Hola' }
// Digo "similar", porque técnicamente es un Proxy que contiene ese objeto.
// Lo importante, es que para poder leer o asignar valores a la variable *siempre* tenemos que pasar por su propiedad
// "value".
// Por ejemplo:
//  saludo.value = "Hola mundo";
// Piénsenlo como la versión del "this." de Options en Composition.
function useLoginForm(callback) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const feedback = ref({
        message: null,
        type: 'success',
    });

    // Los "methods" se definen como funciones comunes.
    async function handleSubmit() {
        try {
            feedback.value.message = null;

            loading.value = true;

            await login(user.value.email, user.value.password);

            // emits('feedback-change', {
            //     message: 'Sesión iniciada con éxito. ¡Hola de nuevo!',
            //     type: 'success',
            // });
            // feedback.value = {
            //     message: 'Sesión iniciada con éxito. ¡Hola de nuevo!',
            //     type: 'success',
            // }
            // Actualizamos el feedback global que inyectamos.
            // globalFeedback.value = {
            //     message: 'Sesión iniciada con éxito. ¡Hola de nuevo!',
            //     type: 'success',
            // }
            updateGlobalFeedback({
                message: 'Sesión iniciada con éxito. ¡Hola de nuevo!',
                type: 'success',
            });

            // router.push('/mi-perfil');
            callback();
        } catch (error) {
            feedback.value = {
                message: 'Las credenciales ingresadas no coinciden con nuestros registros.',
                type: 'error',
            }
            throw error;
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <div
        v-if="feedback.message !== null"
        class="p-4 mb-4 rounded"
        :class="{
            'bg-red-100': feedback.type === 'error',
            'bg-green-100': feedback.type === 'success',
        }"
    >
        {{ feedback.message }}
    </div>

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
        <AppButton type="submit" :loading="loading">Ingresar</AppButton>        
    </form>
</template>