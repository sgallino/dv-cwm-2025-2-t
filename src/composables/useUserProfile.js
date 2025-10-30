import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";

export default function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    });
    const loading = ref(false);

    onMounted(async () => {
        try {
            loading.value = true;

            // this.$route nos da acceso a la ruta en la que estamos. Útil, por ejemplo, para obtener el parámetro
            // de ruta.
            user.value = await getUserProfileById(id);
        } catch (error) {
            // TODO
        }
        loading.value = false;
    });

    return {
        user,
        loading,
    }
}