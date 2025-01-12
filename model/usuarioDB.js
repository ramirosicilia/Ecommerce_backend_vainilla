import { supabase } from "./DB.js";  

export async function crearUserDB(info) { 
    try {
     
        
        const { data, error } = await supabase
            .from('usuarios') // Nombre de tu tabla
            .insert([info]);  // Insertar el objeto `info` como un array
        
        if (error) {
            throw new Error(error.message);
        }
        
    
        
        return data[0]; // Retorna el primer objeto insertado si existe
        
    } catch (err) {
        console.error('Error en la creación de usuarios:', err.message);
        return { success: false, message: 'Error creando los usuarios', error: err.message };
    }
}


export async function obtenerUsuarioDB(user,) {
    try {
        // Consulta para verificar si el usuario o el email ya existen
        const { data, error } = await supabase
            .from('usuarios')
            .select()
            .eq("usuario" , user);

        // Manejo de errores en la consulta
        if (error) {
            throw error;
        }

        // Validación de resultados: verifica si ya existe usuario o email
        if (data.length > 0) {
            // Si existe al menos un registro, retorna que ya existe
            return data
        }

        // Si no se encuentran registros, retorna que no existen duplicados
        return { success: false, message: 'no ay usuarios registrados.' };
    } catch (err) {
        // Manejo de errores inesperados
        console.error('Error al verificar existencia:', err.message);
        return { success: false, message: 'Error al verificar existencia.', error: err.message };
    }
} 

export async function updateUsuarioDB(user,pass,mail) {
    try {
      const { data, error } = await supabase
      .from('usuarios')
      .update({ usuario: user, contrasena: pass })
      .eq('email',mail)
      .select()
        if (error) {
            console.error('Error actualizando el usuario:', error.message);
            return { success: false, message: error.message };
        }

        if (data.length === 0) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Error al actualizar el usuario:', err.message);
        return { success: false, message: err.message };
    }

} 










