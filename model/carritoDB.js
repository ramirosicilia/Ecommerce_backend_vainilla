import { supabase } from "./DB.js"; 


export async function  obtenerProductosYCategorias(){

  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(categoria_id, nombre_categoria, activo)'); // Select con join implícito

    if (error) {
      console.error('Error al obtener productos y categorías:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('Productos y categorías obtenidos:', data);
     return data

  } catch (err) {
    console.error('Error en la consulta:', err.message);
    res.status(500).json({ error: err.message });
  }
     
} 

export async function insertarCarritoDB(datos) { 
  try {
    const { data: result, error } = await supabase
      .from('productos')
      .insert([datos])
      .select(); // Asegúrate de seleccionar para obtener la respuesta

    if (error) {
      throw new Error(`Error insertando los productos: ${error.message}`);
    }

    return result[0]; // Devuelve el resultado del producto insertado
  } catch (err) {
    console.error('Error en la inserción de productos:', err.message);
    throw err; // Lanza el error para que el controlador lo maneje
  }
}



export async function updateCarritoDB(id,nombre,price,category,imagen,stock ){ 


  try{
    const { data, error } = await supabase
    .from('productos') // Nombre de tu tabla
    .update({nombre_producto:nombre,precio:price,categoria_id:category ,imagenes:imagen ,stock:stock}) // Selecciona todas las columnas o especifica las que necesites
    .eq("producto_id",id) // Selecciona el producto que deseas actualizar
    .select()

    if (error) {
      console.error('Error actualizando los productos:', error.message);
      return res.status(500).json({ success: false, message: 'Error actualizando los productos' });  
    }  

    console.log(data,'la data update')
    
    return data[0];
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
   console.log(data)
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

export async function obtenerProductoPorId(id) { 

  try{ 
    const { data,error } = await supabase 
  
    .from('productos') // Nombre de tu tabla
    .select()
    .eq("producto_id",id) // Selecciona el producto que deseas eliminar
    .select()
   console.log(data)
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

