import { supabase } from "./supabase";

/**
 * 
 * @param {string} filename 
 * @param {File|Blob} file 
 * @param {string} bucket 
 */
export async function uploadFile(filename, file, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filename, file);

    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove(filename);

    if(error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string}
 */
export function getFileURL(filename, bucket = 'avatars') {
    const { data, error } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filename);

    if(error) {
        console.error('[storage.js getFileURL] Error al obtener la URL del archivo.', error);
        throw new Error(error.message);
    }

    return data.publicUrl;
}