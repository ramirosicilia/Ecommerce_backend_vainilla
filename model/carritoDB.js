import { supabase } from "./DB.js"; 


export async function  obtenerProductosYCategorias(){

  try {
    const { data, error } = await supabase
      .from('productos',)
      .select('* , categorias (categoria_id, nombre_categoria ,activo)'); // Select con join implícito

    if (error) {
      console.error('Error al obtener productos y categorías:', error.message);
      return res.status(500).json({ error: error.message });
    }

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

export async function obtenerCatergoriaDB(category){ 

  try { 

    let { data:readCategory, error } = await supabase
  .from('categorias')
  .select("nombre_categoria")
  .eq("nombre_categoria",category)
     
   console.log(readCategory, ' esto obtuve') 

   if(error){
    console.log('no se obtuvo la categoria')
   } 

   return readCategory
    
    
  } catch (err) {
    // Captura errores inesperados
    console.error('Hubo un error al seleccionar la categoría en la base de datos:', err);
    return null;  // Retorna null en caso de error general
  }


}




export async function ingresarCategoriaDB(category) {
  try { 
    
    // Insertamos el objeto con las propiedades correctas
    const { data, error } = await supabase
      .from('categorias')
      .insert([category])
      .select()
         

    // Si hay un error, lo manejamos
    if (error) {
      console.error('Error al insertar:', error);
      return null;  // Si ocurre un error, retornamos null
    }

    // Si la inserción fue exitosa, retornamos los datos insertados
    console.log('Categoría insertada:', data);
    return data;

  } catch (err) {
    // Captura errores inesperados
    console.error('Hubo un error al insertar la categoría en la base de datos:', err);
    return null;  // Retorna null en caso de error general
  }
} 


 
export async function actualizarCategoriaDB(nombreID,nombre){ 

  try{ 
  
const { data, error } = await supabase
.from('categorias')
.update({ nombre_categoria:nombre })
.eq('nombre_categoria', nombreID)
.select()
        
         if(error){
          console.log('hubo un error al actualizar la categoria')
         } 
     
         return data

  } 

  catch(err){
    console.log('hubo un error al actulizar la categoria de la base de datos',err)
  }


 }




 export async function eliminarCategoriaDB(id){ 

  try{ 
    
const { error } = await supabase
.from('categorias')
.delete()
.eq('categoria_id',id)
.select() 
    
          if(error){
           console.log('hubo un error al eliminar la categoria')
          }

  } 

  catch(err){
    console.log('hubo un error al eliminar la categoria de la base de datos',err)
  }


 } 


  export async function desactivarCategoryDB(category,active){  

    try{ 
  
      const { data, error } = await supabase
      .from('categorias')
      .update({ activo:active })
      .eq('nombre_categoria', category)
      .select()
              
               if(error){
                console.log('hubo un error al actualizar la categoria')
               } 
           
               return data
      
          } 

        catch(err){
          console.log('hubo un error al desactivar la categoria',err)
        }
 

    
  } 


  export async function desactivarProductosDB(id,active){  

    try{ 
  
      const { data, error } = await supabase
      .from('productos')
      .update({ activacion:active })
      .eq('producto_id', id)
      .select()
              
               if(error){
                console.log('hubo un error al actualizar los productos')
               } 
           
               return data
      
          } 

        catch(err){
          console.log('hubo un error al desactivar el producto',err)
        }
 

    
  } 


  export async function allCategoriesDB(){ 


    try { 

      let { data:readCategory, error } = await supabase
    .from('categorias')
    .select("nombre_categoria , categoria_id")
       
     console.log(readCategory, ' esto obtuve') 
  
     if(error){
      console.log('no se obtuvo la categoria')
     } 
  
     return readCategory
      
      
    } catch (err) {
      // Captura errores inesperados
      console.error('Hubo un error al seleccionar la categoría en la base de datos:', err);
      return null;  // Retorna null en caso de error general
    }

  }

