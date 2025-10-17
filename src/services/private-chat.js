import { supabase } from "./supabase";

// Creamos una variable para poder cachear los datos de una conversación privada. Especialmente
// importante por el id.
// Cada conversación privada la vamos a guardar en una clave que sea la unión ordenada de los
// ids de los participantes con un "_".
// Por ejemplo: "userid1_userid2".
const privateChatsCache = {}

/**
 * 
 * @param {string} userId1 
 * @param {string} userId2 
 * @param {{id: number, user_id1: string, user_id2: string, created_at: string}} value 
 */
function addToPrivateChatCache(userId1, userId2, value) {
    const cacheKey = [userId1, userId2].sort().join('_');
    privateChatsCache[cacheKey] = value;
}

/**
 * 
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {{id: number, user_id1: string, user_id2: string, created_at: string}|null}
 */
function getFromPrivateChatCache(userId1, userId2) {
    const cacheKey = [userId1, userId2].sort().join('_');
    return privateChatsCache[cacheKey] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function createPrivateChat(senderId, receiverId) {
    // Ordenamos los ids de menor a mayor.
    const [userId1, userId2] = [senderId, receiverId].sort();

    // Como no existe, la creamos.
    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userId1,
            user_id2: userId2,
        })
        // Pedimos que nos retorne el registro creado.
        .select();

    if(error) {
        console.error('[private-chat.js createPrivateChat] Error al crear el chat privado: ', error);
        throw new Error(error.message);
    }

    return data[0];
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}|null>}
 */
async function getPrivateChatById(senderId, receiverId) {
    // Ordenamos los ids de menor a mayor.
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', userId1)
        .eq('user_id2', userId2);

    if(error) {
        console.error('[private-chat.js getPrivateChatById] Error al buscar el chat privado: ', error);
        throw new Error(error.message);
    }

    return data[0] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function getOrCreatePrivateChat(senderId, receiverId) {
    // Antes que nada, buscamos en el caché si no tenemos el chat.
    const cachedChat = getFromPrivateChatCache(senderId, receiverId);
    if(cachedChat) return cachedChat;

    // Buscamos a ver si existe la conversación.
    let privateChat = await getPrivateChatById(senderId, receiverId);

    if(privateChat == null) {
        // No está, así que lo creamos.
        privateChat = await createPrivateChat(senderId, receiverId);
    }

    // Guardamos en el caché el chat privado.
    addToPrivateChatCache(senderId, receiverId, privateChat);

    return privateChat;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} content 
 */
export async function sendPrivateChatMessage(senderId, receiverId, content) {
    // Para poder mandar un mensaje, necesitamos saber cuál es la conversación privada,
    // específicamente, su id.
    // Primero, traemos la conversación privada.
    const privateChat = await getOrCreatePrivateChat(senderId, receiverId);

    // Ahora que tenemos el chat privado, podemos crear el mensaje.
    const { error } = await supabase
        .from('private_chat_messages')
        .insert({
            chat_id: privateChat.id,
            sender_id: senderId,
            content,
        });

    if(error) {
        console.error('[private-chat.js sendPrivateChatMessage] Error al enviar el mensaje privado: ', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, chat_id: number, sender_id: string, content: string, created_at: string}[]>}
 */
export async function fetchLastPrivateChatMessages(senderId, receiverId) {
    const privateChat = await getOrCreatePrivateChat(senderId, receiverId);

    const { data, error } = await supabase
        .from('private_chat_messages')
        .select()
        .eq('chat_id', privateChat.id)
        /*.limit(10)*/;

    if(error) {
        console.error('[private-chat.js fetchLastPrivateChatMessages] Error al traer los mensajes privados: ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {(message: {id: number, chat_id: number, sender_id: string, content: string, created_at: string}) => void} callback 
 * @returns {Promise<() => void>}
 */
export async function subscribeToNewPrivateChatMessages(senderId, receiverId, callback) {
    const privateChat = await getOrCreatePrivateChat(senderId, receiverId);

    const privateChannel = supabase.channel('private_chat_messages');

    privateChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            table: 'private_chat_messages',
            // No queremos escuchar y recibir *todos* los mensajes que se inserten en la tabla.
            // Solo queremos los que sean de la conversación que se nos pide.
            // Para agregar condiciones para los datos que queremos escuchar podemos usar la
            // propiedad "filter".
            // Como valor le pasamos el campo por el que queremos filtrar, seguido de igual,
            // seguido de la condición de filtro. Noten que el "eq." (de "equals") lo pusimos
            // después del "=".
            filter: 'chat_id=eq.' + privateChat.id,
        },
        payload => {
            callback(payload.new);
        }
    );

    privateChannel.subscribe();

    return () => {
        privateChannel.unsubscribe();
    }
}