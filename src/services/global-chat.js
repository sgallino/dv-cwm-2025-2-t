// Servicio para todas las funciones del chat global.
import { supabase } from "./supabase";

/**
 * 
 * @returns {Promise<{id: string, email: string, content: string, created_at: string}[]>}
 */
export async function fetchLastGlobalChatMessages() {
    // A través del objeto del cliente de Supabase podemos acceder a todas sus funcionalidades.
    // La principal es el método ".from()".
    // Es muy importante el "await". Podríamos decir que es el await el que ejecuta la consulta.
    const { data, error } = await supabase
        // from() nos permite interactuar con alguna tabla de nuestra base.
        .from('global_chat_messages')
        // Entre los métodos que from() tiene, select() ejecuta un SELECT de la consulta.
        .select();

    if(error) {
        console.error('[global-chat.js fetchLastGlobalChatMessages] Error al traer los mensajes iniciales del chat.', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {{sender_id: string, email: string, content: string}} data 
 */
export async function sendGlobalChatMessage({sender_id, email, content}) {
    const { data, error } = await supabase
        .from('global_chat_messages')
        .insert({
            sender_id,
            email,
            content,
        });

        if(error) {
            console.error('[global-chat.js sendGlobalChatMessage] Error al enviar el nuevo mensaje.', error);
            throw new Error(error.message);
        }
}

/**
 * 
 * @param {(messages: {id: string, email: string, content: string, created_at: string}[]) => void} callback
 */
export function subscribeToNewGlobalChatMessages(callback) {
    // Usamos la API de Realtime para poder recibir los nuevos mensajes.
    // Esto requiere crear un canal.
    // De nombre / id pueden poner lo que quieran, excepto "realtime".
    const chatChannel = supabase.channel('global_chat_messages');

    // Configuramos el evento que queremos escuchar.
    // Esto se logra con el método "on" del canal.
    // Recibe 3 parámetros:
    // 1. String. El servicio de Realtime que queremos usar.
    // 2. Objeto. Los detalles del evento.
    // 3. Función. El callback que queremos ejecutar cuando se dispare el evento.
    //  Recibe como parámetro el payload.
    chatChannel.on(
        'postgres_changes',
        {
            // En "postgres_changes", el tipo del evento puede ser:
            // INSERT, UPDATE, DELETE, *
            event: 'INSERT',
            // Aclaramos la tabla y el schema.
            table: 'global_chat_messages',
            schema: 'public',
        },
        payload => {
            // this.messages.push(payload.new);
            // Invocamos el callback que nos pasan, brindándole los datos nuevos.
            callback(payload.new);
        }
    );

    // Nos suscribimos al canal.
    // Todo lo previo es configuración. Para que tenga efecto, debemos recordar
    // suscribirnos.
    chatChannel.subscribe();

    // Retornamos una función que cancele la suscripción.
    return () => {
        chatChannel.unsubscribe();
    }
}