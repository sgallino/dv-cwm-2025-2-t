<script setup>
import { onUnmounted, ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { updateAuthUserAvatar } from '../services/auth';

// const user = useAuthUserState();
const { imageData, loading, handleSubmit, handleImageChange } = useEditAvatarForm();

function useEditAvatarForm() {
    const imageData = ref({
        file: null,
        preview: null,
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;

            await updateAuthUserAvatar(imageData.value.file);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    function handleImageChange(event) {
        /*
            Las funciones que asociamos a eventos nativos de HTML / JS (como change) reciben como siempre la 
            instancia del objeto Event.
            Lo vamos a pedir para poder fácilmente obtener la referencia del elemento de HTML, sin necesitar un
            template ref. Específicamente, aprovechando la propiedad "target" del evento.
            En los <input type="file"> tenemos una propiedad llamada "files" que es de tipo FileList. Un FileList
            es básicamente un array de objeto File. Que se cargan con los archivos que el usuario selecciona en
            el campo.
            Cada objeto File representa un archivo, y contiene datos relevantes (como el type para el tipo MIME,
            size para el peso en bytes, etc).
            Como nuestro <input> no tiene el atributo "multiple" asignado, significa que el usuario solo puede
            seleccionar un archivo a la vez. Esto nos permite darnos el lujo de poder hardcodear la posición
            0 para obtener el archivo.
        */
        // console.log("Files: ", event.target.files);
        imageData.value.file = event.target.files[0];

        if(imageData.value.preview) {
            URL.revokeObjectURL(imageData.value.preview);
            imageData.value.preview = null;
        }

        if(!imageData.value.file) {
            return;
        }

        /*
            Para poder previsualizar la imagen que el usuario selecciona, necesitamos poder leer el conteido de
            la imagen para así ponerlo en el <img>.
            Hay más de una manera de hacer esto. Pero la más simple probablemente sea usar el método createObjectURL
            de la clase URL.
            URL.createObjectURL recibe como argumento un File o Blob y:
            - Lo levanta en memoria.
            - Le asigna una URL para poder accederlo. La cual se retorna como resultado del método.
            - Esa URL y el recurso levantado quedan asociados al "document".

            Esto último es especialmente importante tenerlo presente. 
            ¿Por qué?
            Porque lo que implica es que cada vez que nosotros creamos un objectURL se levanta el recurso en la 
            memoria y queda asociado al document. Lo que, a su vez, implica que hasta que el document no libere
            esos recursos o no se descargue el propio document, ellos van a seguir ocupando memoria indefinidamente.
            En una MPA tradicional, esto no supone inconveniente alguno. Prácticamente cualquier acción del usuario
            va a provocar que el documento actual se descargue al navegar a otro link.
            Pero en una SPA es distinto. El document en una SPA pueden vivir mucho tiempo. La navegación del frontend
            no refresca la página. De hecho, este es el principal atractivo que popularizó las SPAs en su momento.
            Por lo tanto, se vuelve indispensable ser cuidadosos de liberar tan pronto es posible los recursos
            levantados con URL.createObjectURL.
            Afortundamente, es muy sencillo. Solo tenemos que llamar al método URL.revokeObjectURL() y pasarle la
            URL que queremos liberar.
            Lo único "complicado" es no olvidarse de hacerlo en todos los lugares donde sea necesario.
            En este caso, hay dos lugares que necesitamos cubrir:
            - Cuando se navega a otra página.
            - Cuando se selecciona una nueva imagen.
        */
       imageData.value.preview = URL.createObjectURL(imageData.value.file);
    }

    onUnmounted(() => {
        if(imageData.value.preview) {
            URL.revokeObjectURL(imageData.value.preview);
        }
    });

    // onMounted(() => {
    //     imageData.value = {
    //         display_name: user.value.display_name,
    //         bio: user.value.bio,
    //         career: user.value.career,
    //     }
    // });

    return {
        imageData,
        loading,
        handleSubmit,
        handleImageChange,
    }
}
</script>

<template>
    <AppH1>Actualizar mi foto de perfil</AppH1>

    <div class="flex gap-4">
        <form 
            action="#"
            class="w-1/2"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="file" class="block mb-1">Foto</label>
                <input
                    type="file"
                    id="file"
                    class="w-full p-2 border border-gray-300 rounded"
                    @change="handleImageChange"
                >
            </div>
            <AppButton 
                type="submit"
                :loading="loading"
            >
                Actualizar
            </AppButton>
        </form>
        <div class="w-1/2">
            <h2 class="text-lg">Foto seleccionada</h2>
            <img
                v-if="imageData.preview"
                :src="imageData.preview"
                alt=""
            >
            <span v-else>No hay una foto seleccionada</span>
        </div>
    </div>
</template>