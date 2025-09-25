<script>
import AppH1 from '../components/AppH1.vue';
import { fetchLastGlobalChatMessages, sendGlobalChatMessage, subscribeToNewGlobalChatMessages } from '../services/global-chat';

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
        async handleSubmit() {
            try {
                await sendGlobalChatMessage({
                    email: this.newMessage.email,
                    content: this.newMessage.content,
                });
            } catch (error) {
                // TODO...
            }
            
            this.newMessage.content = '';
        }
    },
    async mounted() {
        subscribeToNewGlobalChatMessages(async newMessage => {
            this.messages.push(newMessage);
            
            await this.$nextTick();
            
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        });

        this.messages = await fetchLastGlobalChatMessages();

        // Accedemos al "template ref" con la propiedad especial $refs de Vue.
        // console.log("Altura del scroll: ", this.$refs.chatContainer.scrollHeight);

        /*
        # nextTick
        Vue, cuando detecta un cambio que requiere actualizar el DOM, no lo aplica automáticamente.
        Sino que espera a ver si no hay otras instrucciones que también vayan a requerir tocar el DOM.
        Esto es con el fin de poder agrupar en un "batch" de modificaciones todos los cambios, y así
        solo manipular el DOM una vez.

        Es importante que Vue haga esto, porque el renderizado de la página es una de las tareas más
        pesadas que puede realizar un browser.

        En la mayoría de los casos, ni nos enteramos de que esto pasa.
        Pero hay ocasiones, como esta, donde nosotros necesitamos esperar a que Vue actualice el DOM
        antes de realizar la próxima acción.
        Para poder mover el scroll, necesitamos que se actualice el contenido del <section> con los
        nuevos mensajes.

        Ahí es donde entre nextTick().
        Esta función retorna una Promise que se resuelve cuando Vue actualiza el DOM.
        */
        await this.$nextTick();
        
        // console.log("Altura del scroll: ", this.$refs.chatContainer.scrollHeight);
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <!-- 
        # Template refs
        El atributo "ref" permite hacer disponible un elemento como un "template ref".
        Esto es, que desde el <script> Vue nos permite acceder al elemento de HTML que le corresponde.
        Recibe como valor un nombre / id.
        -->
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded" ref="chatContainer">
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