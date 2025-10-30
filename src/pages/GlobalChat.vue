<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { fetchLastGlobalChatMessages, sendGlobalChatMessage, subscribeToNewGlobalChatMessages } from '../services/global-chat';
import useAuthUserState from '../composables/useAuthUserState';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';

const user = useAuthUserState();
const { newMessage, handleSubmit } = useGlobalChatMessageForm(user);
const { messages, loading } = useGlobalChatMessages();

function getLinkForUser(senderId) {
    return user.value.id !== senderId ? `/usuario/${senderId}` : '/mi-perfil';
}

function useGlobalChatMessages() {
    let unsubscribeFromChat = () => {};
    const messages = ref([]);
    const loading = ref(false);

    onMounted(async () => {
        try {
            // Para poder usar las refs de elementos de HTML que hayamos definido (lo que hacíamos con this.$refs)
            // Usamos el "composable" useTemplateRef(), que recibe como parámetro un string con el nombre del
            // "ref" del elemento de HTML.
            const chatContainer = useTemplateRef('chatContainer');

            loading.value = true;

            unsubscribeFromChat = subscribeToNewGlobalChatMessages(async newMessage => {
                messages.value.push(newMessage);
                
                await nextTick();
                
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            });

            messages.value = await fetchLastGlobalChatMessages();
            loading.value = false;

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
            await nextTick();
            
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            
        } catch(error) {
            loading.value = false;
        }
    });

    onUnmounted(() => unsubscribeFromChat());

    return {
        messages,
        loading,
    }
}

function useGlobalChatMessageForm(user) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        try {
            await sendGlobalChatMessage({
                sender_id: user.value.id,
                email: user.value.email,
                content: newMessage.value.content,
            });
        } catch (error) {
            // TODO...
        }
        
        newMessage.value.content = '';
    }

    return {
        newMessage,
        handleSubmit,
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
            <template v-if="!loading">
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
                        <div class="mb-1">
                            <RouterLink :to="getLinkForUser(message.sender_id)" class="font-bold text-blue-700">{{ message.email }}</RouterLink> 
                            dijo:
                        </div>
                        <div class="mb-1">{{ message.content }}</div>
                        <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                    </li>
                </ol>
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span class="block mb-1">Email</span>
                    {{ user.email }}
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
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