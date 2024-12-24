import { supabase } from "./DB.js"; 



export async function administradorLogeoDB(usuarios) {
    try {
      // `usuarios` debe ser un array de objetos con las propiedades: nombre_usuario, email, contrasena, permisos
      const { data, error } = await supabase
        .from('administrador') // Nombre de la tabla
        .insert([usuarios]) // Inserta el array de objetos
        .select(); // Selecciona todas las columnas o especifica las que necesites
  
      console.log(data[0]);
  
      if (error) {
        console.error('Error registrando los usuarios:', error.message);
        return { success: false, message: 'Error registrando los usuarios', error: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error('Error al registrar los usuarios:', err.message);
      return { success: false, message: 'Error al registrar los usuarios', error: err.message };
    }
  } 
  

  export async function obtenerAdminitrador() {
    try {
      const { data, error } = await supabase
        .from('administrador')
        .select('*');
  
      if (error) {
        console.error('Error obteniendo los usuarios:', error.message);
        return { success: false, message: 'Error obteniendo los usuarios', error: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error('Error al obtener los usuarios:', err.message);
      return { success: false, message: 'Error al obtener los usuarios', error: err.message };
    }
  }
  