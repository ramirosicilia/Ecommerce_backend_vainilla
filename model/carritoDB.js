import { supabase } from "./DB.js"; 






export async function  obtenerProductos(){

    try {
        const { data, error } = await supabase
          .from('productos') // Nombre de tu tabla
          .select('*'); // Selecciona todas las columnas o especifica las que necesites
    
        if (error) {
          console.error('Error obteniendo los productos:', error.message);
          return res.status(500).json({ success: false, message: 'Error obteniendo los productos' });  
        }  
       
        return data
    
      
      } catch (err) {
        console.error('Error en la obtención de productos:', err.message);
        
      } 
     
} 

export async function insetarCarritoDB(datos){ 

  try{
    const { data:result, error } = await supabase
    .from('productos') // Nombre de tu tabla
    .insert([datos]) // Selecciona todas las columnas o especifica las que necesites
    .select()

    if (error) {
      console.error('Error insertando los productos:', error.message);
      return res.status(500).json({ success: false, message: 'Error insertando los productos' });  
    }   

    console.log('Producto insertado:', result[0]);
    
    return {success:true,data:result[0]};
  }

  catch(err){
    console.error('Error en la inserción de productos:', err.message);
    return res.status(500).json({ success: false, message: 'Error insertando los productos' });  
  }

} 


export async function updateCarritoDB(id,datos){ 


  try{
    const { data, error } = await supabase
    .from('productos') // Nombre de tu tabla
    .update(datos) // Selecciona todas las columnas o especifica las que necesites
    .eq("producto_id",id) // Selecciona el producto que deseas actualizar
    .select()

    if (error) {
      console.error('Error actualizando los productos:', error.message);
      return res.status(500).json({ success: false, message: 'Error actualizando los productos' });  
    }  
    
    return data;
  }

  catch(err){
    console.error('Error en la actualización de productos:', err.message);
    return res.status(500).json({ success: false, message: 'Error actualizando los productos' });  
  }

} 



export async function borrarCarritoDB(id) { 

  try{ 
    const { data,error } = await supabase
    .from('productos') // Nombre de tu tabla
    .delete()
    .eq("producto_id",id) // Selecciona el producto que deseas eliminar
    .select()

    if (error) {
      console.error('Error eliminando los productos:', error.message);
      return res.status(500).json({ success: false, message: 'Error eliminando los productos' });  
    }  
    
    return data;
  

  } 

  catch(err){
    console.error('Error en la eliminación de productos:', err.message);
    return res.status(500).json({ success: false, message: 'Error eliminando los productos' });  
  }
  
}