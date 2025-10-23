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
    // const ids = [senderId, receiverId].sort();
    // const userId1 = ids[0];
    // const userId2 = ids[1];

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

    // const response = await supabase
    const { data, error } = await supabase
        .from('private_chat_messages')
        .select()
        .eq('chat_id', privateChat.id)
    //     /*.limit(10)*/;
    // const error = response.error;
    // const data = response.data;

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

// Hacemos algunas funciones simples para testear que las RLS funcionen.
// Esto es una versión "simplificada" de hacer una suite de tests.
// async function testICantReadAChatOfWhichImNotPartOf() {
//     const pepeEmail = '4a60ab02-31c8-430d-9cd1-37d37eedbf67';
//     const otroEmail = 'a8bbe8a8-cd33-477d-8685-3593ff0aa47a';

//     // Tratamos de leer este chat (estando autenticados como sara).
//     const { data, error } = await supabase
//         .from('private_chats')
//         .select()
//         .eq('user_id1', pepeEmail)
//         .eq('user_id2', otroEmail);

//     if(error) {
//         console.error('[Test] Error en el test.');
//         throw new Error(error.message);
//     }

//     // Verificamos el resultado.
//     if(data.length == 0) {
//         console.log("✔ [Test] No pudimos leer la conversación entre pepe y otro.");
//     } else {
//         console.warn("❌ [Test] Pudimos leer la conversación de la que no somos parte :(");
//     }
// }

// async function testICantCreateAChatInWhichImNotAPartOf() {
//     const pepeEmail = '4a60ab02-31c8-430d-9cd1-37d37eedbf67';
//     const otro2Email = 'b21c2de4-3795-4183-9f00-8e9c61215afb';

//     // Tratamos de crear el chat (estado autenticados como sara).
//     const { error } = await supabase
//         .from('private_chats')
//         .insert({
//             'user_id1': pepeEmail,
//             'user_id2': otro2Email,
//         });

//     if(error) {
//         console.log("✔ [Test] No pudimos crear una conversación en la que no participamos.");
//         return;
//     }
//     console.warn("❌ [Test] Pudimos crear una conversación en la que no participamos.");
// }

// async function testICantReadMessagesFromAChatInWhichImNotAPartOf() {
//     // const pepeEmail = '4a60ab02-31c8-430d-9cd1-37d37eedbf67';
//     // const otroEmail = 'a8bbe8a8-cd33-477d-8685-3593ff0aa47a';
//     const chatId = 6;

//     const { data, error } = await supabase
//         .from('private_chat_messages')
//         .select()
//         .eq('chat_id', chatId);
    
//     if(error) {
//         console.error('[Test] Error en el test.');
//         throw new Error(error.message);
//     }

//     if(data.length == 0) {
//         console.log("✔ [Test] No pudimos leer los mensajes de una conversación en la que no participamos.");
//     } else {
//         console.warn("❌ [Test] Pudimos leer los mensajes de una conversación en la que no participamos.", data);
//     }
// }

// async function testICantSendAMessageFromAChatInWhichImNotIn() {
//     const chatId = 6;

//     const { error } = await supabase
//         .from('private_chat_messages')
//         .insert({
//             chat_id: chatId,
//             sender_id: 'f4f1467e-8b78-40f4-8b98-1fa447e6b360', // sara
//             content: 'Hola, tu seguridad apesta',
//         });
    
//     if(error) {
//         console.log('✔ [Test] No pudimos enviar un mensaje en una conversación en la que no participamos.');
//         throw new Error(error.message);
//     }
//     console.warn('❌ [Test] Pudimos enviar un mensaje en una conversación en la que no participamos.');
// }

// async function testICantSendAMessageUsingOtherUserIdInAChatImIn() {
//     const chatId = 5;
//     const pepeEmail = '4a60ab02-31c8-430d-9cd1-37d37eedbf67';

//     const { error } = await supabase
//         .from('private_chat_messages')
//         .insert({
//             chat_id: chatId,
//             sender_id: pepeEmail,
//             content: 'tu seguridad apesta v2',
//         });
    
//     if(error) {
//         console.log('✔ [Test] No pudimos enviar un mensaje con el id de otro usuario en una conversación en la que participamos.');
//         throw new Error(error.message);
//     }
//     console.warn('❌ [Test] Pudimos enviar un mensaje con el id de otro usuario en una conversación en la que participamos.');
// }

// Corremos el test.
// testICantReadAChatOfWhichImNotPartOf();
// testICantCreateAChatInWhichImNotAPartOf();
// testICantReadMessagesFromAChatInWhichImNotAPartOf();
// testICantSendAMessageFromAChatInWhichImNotIn();
// testICantSendAMessageUsingOtherUserIdInAChatImIn();