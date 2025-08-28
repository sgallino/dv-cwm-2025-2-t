<script>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    // La propiedad "components" debe llevar objeto con los componentes que 
    // queremos poder utilizar dentro de éste.
    components: { AppNavbar, AppFooter, },
}
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <!-- 
        RouterView es donde se va a montar el componente asociar a la ruta que se
        esté visitando.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>