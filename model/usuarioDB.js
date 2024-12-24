import { supabase } from "./DB.js";  

export async function crearUserDB(dat){
    try{
        const { data, error } = await supabase
        .from('usuarios') // Nombre de tu tabla
        .insert([dat]) 
        .select();  

        return { success: true, data:data[0]};
} 

catch(err){
    console.error('Error en la creación de usuarios:', err.message);
    return { success: false, message: 'Error creando los usuarios', error: err.message };
}

} 

export async function obtenerUsuarioDB(){
    try{
        const { data, error } = await supabase
        .from('usuarios')
        .select()
        .eq('verificado', true);

        return { success: true, data };
} 

catch(err){
    console.error('Error al obtener los usuarios:', err.message);
    return { success: false, message: 'Error al obtener los usuarios', error: err.message };
}

}