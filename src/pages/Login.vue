<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';

// Como en la Composition API no existe "this" (porque no se creó todavía la instancia a esta altura), no tenemos
// acceso a propiedades especiales como "this.$router", o $route, o $refs.
// En su lugar, vamos a obtener esos valores usando funciones.
// Por ejemplo, para obtener el router, tenemos el "composable" de Vue Router: useRouter().
const router = useRouter();

const { user, loading, handleSubmit } = useLoginForm(() => router.push('/mi-perfil'));

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

    // Los "methods" se definen como funciones comunes.
    async function handleSubmit() {
        try {
            loading.value = true;

            await login(user.value.email, user.value.password);

            // router.push('/mi-perfil');
            callback();
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
    <AppH1>Ingresar a mi cuenta</AppH1>
    
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