<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
    name: 'GlobalChat',
    components: { AppH1, },
    // data nos permite definir los valores que componen el "state" del componente.
    // Entendemos por "state" a los datos que son propios del componente y que pueden
    // cambiar durante la vida del mismo.
    // En Vue, estos datos son "reactivos".
    // Es decir, que cada vez que los datos del "state" cambien, Vue re-renderiza el
    // template para tener siempre en sintonía con la información.
    // Como valor, data debe recibir una función que retorne el objeto con los valores
    // iniciales del state.
    data() {
        return {
            messages: [],
            newMessage: {
                email: '',
                content: '',
            }
        }
    },
    methods: {
        handleSubmit() {
            this.messages.push({
                id: this.messages.length,
                email: this.newMessage.email,
                content: this.newMessage.content,
                created_at: new Date(),
            });
            
            this.newMessage.content = '';
        }
    },
    async mounted() {
        // A través del objeto del cliente de Supabase podemos acceder a todas sus funcionalidades.
        // La principal es el método ".from()".
        // Es muy importante el "await". Podríamos decir que es el await el que ejecuta la consulta.
        const { data, error } = await supabase
            // from() nos permite interactuar con alguna tabla de nuestra base.
            .from('global_chat_messages')
            // Entre los métodos que from() tiene, select() ejecuta un SELECT de la consulta.
            .select();

        if(error) {
            throw new Error(error);
        }

        this.messages = data;
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
            <!-- 
            Los atributos que empiezan con "v-" se conocen como "directivas".
            Las directivas son funciones que aplican alguna transformación o agregan alguna
            funcionalidad al elemento de HTML.
            -->
            <ol class="flex flex-col items-start gap-4">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-4 rounded bg-gray-100"
                >
                    <div class="mb-1"><span class="font-bold">{{ message.email }}</span> dijo:</div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <label for="email" class="block mb-1">Email</label>
                    <!-- 
                    v-model define un "two-way data binding" entre una propiedad y un control (campo)
                    de formulario.
                    Esto significa que Vue va a mantener en sincronía el valor del state y el valor
                    del control del form.
                    Si actualizamos programáticamente el valor de la propiedad del state, Vue actualiza
                    el valor del campo del form.
                    Y si el usuario modifica el valor del campo, Vue actualiza el valor de la propiedad.
                    Internamente, Vue usa el valor de la propiedad como la "single source of truth"
                    (el único origen de verdad).
                    -->
                    <input
                        type="email"
                        id="email"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <textarea
                        id="content"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>