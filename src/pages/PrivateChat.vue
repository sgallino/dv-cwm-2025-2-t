<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { fetchLastPrivateChatMessages, sendPrivateChatMessage, subscribeToNewPrivateChatMessages } from '../services/private-chat';
import useAuthUserState from '../composables/useAuthUserState';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';
import AppLoader from '../components/AppLoader.vue';

const route = useRoute();

const user = useAuthUserState();
const { user: otherUser, loading: loadingUser } = useUserProfile(route.params.id);
const { messages, loadingMessages } = usePrivateChatMessages(user, route.params.id);
const { newMessage, handleSubmit } = usePrivateChatMessageForm(user, route.params.id);

function usePrivateChatMessages(user, otherId) {
    let unsubscribeFromChat = () => {};

    const messages = ref([]);
    const loadingMessages = ref(false);

    onMounted(async () => {
        try {
            const chatContainer = useTemplateRef('chatContainer');
            loadingMessages.value = true;
            
            unsubscribeFromChat = await subscribeToNewPrivateChatMessages(
                user.value.id, 
                otherId,
                async newMessage => {
                    messages.value.push(newMessage);

                    await nextTick();
                    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
                },
            );
            
            fetchLastPrivateChatMessages(user.value.id, otherId)
                .then(async lastMessages => {
                    messages.value = lastMessages;
                    loadingMessages.value = false;

                    await nextTick();
                    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
                });
        } catch (error) {
            // TODO...
        }
        loadingMessages.value = false;
    });

    onUnmounted(() => unsubscribeFromChat());

    return {
        messages,
        loadingMessages,
    }
}

function usePrivateChatMessageForm(user, otherId) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        try {
            sendPrivateChatMessage(
                user.value.id,
                otherId,
                newMessage.value.content,
            );
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
    <AppH1>Chat privado con {{ otherUser.email }}</AppH1>

    <section class="overflow-y-auto h-100 p-4 mb-4 border border-gray-200 rounded" ref="chatContainer">
        <h2 class="sr-only">Lista de mensajes</h2>
        <template v-if="!loadingMessages">
            <ol class="flex flex-col items-start gap-4">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-4 rounded"
                    :class="{
                        'bg-gray-100': user.id !== message.sender_id,
                        'self-end bg-green-100': user.id === message.sender_id,
                    }"
                >
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </template>
        <template v-else>
            <AppLoader />
        </template>
    </section>
    <section>
        <h2 class="sr-only">Enviar un mensaje</h2>
        <form 
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <label for="content" class="sr-only">Mensaje</label>
            <textarea
                id="content"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="newMessage.content"
            ></textarea>
            <AppButton type="submit">Enviar</AppButton>
        </form>
    </section>
</template>