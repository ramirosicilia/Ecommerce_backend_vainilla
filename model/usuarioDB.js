import { supabase } from "./DB.js";  

export async function crearUserDB(info) { 
    try {
        console.log(info, 'dat 55555555');
        
        const { data, error } = await supabase
            .from('usuarios') // Nombre de tu tabla
            .insert([info]);  // Insertar el objeto `info` como un array
        
        if (error) {
            throw new Error(error.message);
        }
        
        console.log(data, 'data');
        
        return data[0]; // Retorna el primer objeto insertado si existe
        
    } catch (err) {
        console.error('Error en la creación de usuarios:', err.message);
        return { success: false, message: 'Error creando los usuarios', error: err.message };
    }
}


export async function obtenerUsuarioDB(user, email) {
    try{
        const { data, error } = await supabase
        .from('usuarios')
        .select()
        .eq('usuario', user, 'email', email);

        return { success: true, data };
} 

catch(err){
    console.error('Error al obtener los usuarios:', err.message);
    return { success: false, message: 'Error al obtener los usuarios', error: err.message };
}

}