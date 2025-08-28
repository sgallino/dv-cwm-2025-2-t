<script>
import AppH1 from '../components/AppH1.vue';

export default {
    name: 'GlobalChat',
    components: { AppH1, },
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <section class="w-9/12 h-100 p-4 border border-gray-200 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
            <!-- Acá va la lista de mensajes -->
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form action="#">
                <div class="mb-4">
                    <label for="email" class="block mb-1">Email</label>
                    <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded">
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <textarea id="content" class="w-full p-2 border border-gray-300 rounded"></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>