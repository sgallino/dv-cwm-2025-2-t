<script>
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchLastPrivateChatMessages, sendPrivateChatMessage, subscribeToNewPrivateChatMessages } from '../services/private-chat';
import { getUserProfileById } from '../services/user-profiles';

let unsubscribeFromAuth = () => {};
let unsubscribeFromChat = () => {};

export default {
    name: 'PrivateChat',
    components: { AppH1, AppButton, },
    data() {
        return {
            messages: [],
            loadingMessages: false,

            newMessage: {
                content: '',
            },
            
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },

            otherUser: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loadingUser: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                sendPrivateChatMessage(
                    this.user.id,
                    this.$route.params.id,
                    this.newMessage.content,
                );
            } catch (error) {
                // TODO...
            }
            
            this.newMessage.content = '';
        }
    },
    async mounted() {
        try {
            this.loadingUser = true;
            this.loadingMessages = true;
            
            unsubscribeFromAuth = subscribeToAuthStateChanges(newUserState => this.user = newUserState);
            
            getUserProfileById(this.$route.params.id)
                .then(userProfile => this.otherUser = userProfile);

            unsubscribeFromChat = await subscribeToNewPrivateChatMessages(
                this.user.id, 
                this.$route.params.id,
                async newMessage => {
                    this.messages.push(newMessage);

                    await this.$nextTick();
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                },
            );
            
            fetchLastPrivateChatMessages(this.user.id, this.$route.params.id)
                .then(async lastMessages => {
                    this.messages = lastMessages;
                    this.loadingMessages = false;

                    await this.$nextTick();
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                });
        } catch (error) {
            // TODO...
        }
        this.loadingUser = false;
        this.loadingMessages = false;
    },
    unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
    },
}
</script>

<template>
    <AppH1>Chat privado con {{ otherUser.email }}</AppH1>

    <section class="overflow-y-auto h-100 p-4 mb-4 border border-gray-200 rounded" ref="chatContainer">
        <h2 class="sr-only">Lista de mensajes</h2>
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