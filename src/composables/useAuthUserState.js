import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthStateChanges } from "../services/auth";

export default function useAuthUserState() {
    let unsubscribeFromAuth = () => {};

    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
        photo_url: null,
    });

    onMounted(() => unsubscribeFromAuth = subscribeToAuthStateChanges(newUserState => user.value = newUserState));

    onUnmounted(() => unsubscribeFromAuth());

    return user;
}