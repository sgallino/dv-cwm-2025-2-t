import { supabase } from "./supabase";

/**
 * 
 * @param {String} id 
 * @returns {Promise<{id: String, email: String, display_name: String|null, bio: String|null, career: String|null}>}
 */
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        // eq (equal) nos permite una cláusula WHERE donde una columna sea igual a un valor.
        .eq('id', id)
        // limit() nos permite limitar cuántos registros debe traer.
        .limit(1)
        // single() hace que el data que recibimos sea no un array de objetos, sino solo un objeto.
        .single();

    if(error) {
        console.error('[user-profils.js getUserProfileById] Error al traer el perfil del usuario', id, error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profils.js createUserProfile] Error al crear el perfil del usuario', id, error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {String} id 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);

    if(error) {
        console.error('[user-profils.js updateUserProfile] Error al actualizar el perfil del usuario', id, error);
        throw new Error(error.message);
    }
}