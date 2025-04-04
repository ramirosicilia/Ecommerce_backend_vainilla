import { supabase } from "./DB.js"; 
import dotenv from "dotenv"

dotenv.config() 

const urlBack=process.env.URL_BACKEND;



export async function obtenerProductos() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`*, productos_variantes(*, colores(*),talles(*)),imagenes(*)`); 
  
       
  
    if (error) {
      console.error('Error al obtener productos y variantes:', error.message);
      return { error: error.message };
    }

    return data;

  } catch (err) {
    console.error('Error en la consulta:', err.message);
    return { error: err.message };
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





export async function borrarCarritoDB(id, color_id, talle_id) {
  try {
    // 1️⃣ Eliminar producto de la tabla "productos"
    const { data: dataProducto, error: errorProducto } = await supabase
      .from("productos")
      .delete()
      .eq("producto_id", id)
      .select();

    if (errorProducto) throw new Error(`Error eliminando producto: ${errorProducto.message}`);

    // 2️⃣ Eliminar color de la tabla "colores"
    const { data: dataColor, error: errorColor } = await supabase
      .from("colores")
      .delete()
      .eq("color_id", color_id)
      .select();

    if (errorColor) throw new Error(`Error eliminando color: ${errorColor.message}`);

    // 3️⃣ Eliminar talle de la tabla "talles"
    const { data: dataTalle, error: errorTalle } = await supabase
      .from("talles")
      .delete()
      .eq("talle_id", talle_id)
      .select();

    if (errorTalle) throw new Error(`Error eliminando talle: ${errorTalle.message}`);

    // 4️⃣ Retornar todos los datos eliminados
    return {
      eliminado: true,
      productos: dataProducto,
      colores: dataColor,
      talles: dataTalle
    };

  } catch (err) {
    console.error("Error eliminando productos:", err.message);
    throw err; // Propagar el error al controlador
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




export async function ingresarTallesDB(insertar_talle) {

 
  try {
    const { data, error } = await supabase
      .from('talles')
      .insert([insertar_talle]) // Guardar como string JSON
      .select();

    if (error) {
      console.error('Error al insertar:', error);
      return null;
    }

    console.log('Talles insertados:', data);
    return data;
  } catch (err) {
    console.error('Hubo un error al insertar los talles en la base de datos:', err);
    return null;
  }
}




export async function ingresarColoresDB(insertar_color) {
  // Convertimos los strings en arrays
 
  try {
    const { data, error } = await supabase
      .from('colores')
      .insert([insertar_color])// Guardar como string JSON
      .select();

    if (error) {
      console.error('Error al insertar:', error);
      return null;
    }

    console.log('Colores insertados:', data);
    return data;
  } catch (err) {
    console.error('Hubo un error al insertar los colores en la base de datos:', err);
    return null;
  }
}


 

  export async function actualizarCategoriaDB(id,nombre){ 

    try{ 
    
  const { data, error } = await supabase
  .from('categorias')
  .update({ nombre_categoria:nombre})
  .eq('nombre_categoria',id)
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
    .select("*")
       

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

  export async function categoriasAgregarID(categoriaID) {
    const { data: categoriaData, error: categoriaError } = await supabase
      .from('categorias')
      .select('categoria_id')
      .eq('categoria_id', categoriaID); 
  
      console.log(categoriaData)
  
    if (categoriaError) {
      throw new Error(`Error al buscar la categoría: ${categoriaError.message}`);
    }
  
    if (!categoriaData || categoriaData.length === 0) {
      throw new Error(`La categoría '${categoriaID}' no existe.`);
    }
  
    return categoriaData[0].categoria_id;
  } 


  export async function coloresAgregarID(color) {
    const { data: colorData, error: dataError } = await supabase
      .from('colores')
      .select('color_id')
      .eq('color_id', color); 
  
      console.log(colorData)
  
    if (dataError) {
      throw new Error(`Error al buscar la categoría: ${dataError.message}`);
    }
  
    if (!colorData|| colorData.length === 0) {
      throw new Error(`La categoría '${color}' no existe.`);
    }
  
    return colorData[0].color_id
  } 


  export async function tallesAgregarID(talles) {
    const { data: talleData, error: dataError } = await supabase
      .from('talles')
      .select('talle_id')
      .eq('talle_id', talles); 
  
      console.log(talleData)
  
    if (dataError) {
      throw new Error(`Error al buscar la categoría: ${dataError.message}`);
    }
  
    if (!talleData|| talles.length === 0) {
      throw new Error(`La categoría '${talles}' no existe.`);
    }
  
    return talleData[0].talle_id
  }





export async function insertarImagenDB(datos) {  
  try {
      const { data, error } = await supabase
          .from("imagenes")
          .insert([{
              urls:datos.urls, // Asegurar que es un array de strings
              producto_id: datos.producto_id
          }]);

      if (error) {
          console.error("❌ No se pudo insertar la imagen:", error.message);
          throw new Error(error.message);
      }

      console.log("✅ Imágenes insertadas correctamente:", data);
      return data;
  } catch (err) {
      console.error("🚨 Error al insertar imágenes:", err);
      return null;
  }
}


export async function actualizarImagenDB(datos) { 

  try {
    const { data, error } = await supabase
      .from('imagenes')
      .update({ urls: datos.urls })
      .eq('producto_id', datos.producto_id)
      .select();

    if (error) {
      console.error('Error al actualizar las imágenes:', error.message);
      return null;
    }

    console.log('Imágenes actualizadas:', data);
    return data;

  } catch (err) {
    console.error('Error en la actualización de imágenes:', err.message);
    return null;
  }


} 

export async function agregarImagenesDB(producto_id, files) {
  const imageUrls = files.map(file => `${urlBack}/uploads/${file.filename}`);


  // Buscar si ya hay imágenes asociadas al producto
  const { data: existingImages } = await supabase
      .from('imagenes')
      .select('urls, imagenes_id')
      .eq('producto_id', producto_id)
      .single();

  const updatedUrls = existingImages ? [...existingImages.urls, ...imageUrls] : imageUrls;
  console.log(updatedUrls, "actualización array url");

  // Si hay imágenes, actualizar la fila existente con imagenes_id
  if (existingImages) {
    const { error } = await supabase
        .from('imagenes')
        .update({ urls: updatedUrls })
        .eq('imagenes_id', existingImages.imagenes_id);

    if (error) throw new Error('Error al actualizar imágenes');

    return updatedUrls;
  } else {
    // Si no hay imágenes previas, insertar una nueva fila con producto_id
    const { error } = await supabase
        .from('imagenes')
        .insert({ producto_id: producto_id, urls: updatedUrls });

    if (error) throw new Error('Error al insertar nuevas imágenes');

    return updatedUrls;
  }
}






export async function obtenerImagenesDB(){
  try {
    const { data, error } = await supabase
      .from('imagenes',)
      .select('*'); 

    if (error) {
      console.error('Error al obtener imagenes:', error.message);
      return res.status(500).json({ error: error.message });
    } 

 
     return data

  } catch (err) {
    console.error('Error en la consulta:', err.message);

  }
} 





export async function updateNombreProductoDB(nombre_producto, id) {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ nombre_producto })
      .eq("producto_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateNombreProductoDB:", error.message);
    throw error;
  }
}

export async function updatePrecioProductoDB(precio, id) {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ precio })
      .eq("producto_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updatePrecioProductoDB:", error.message);
    throw error;
  }
} 

export async function updateCategoriaProductoDB(nombre_categoria, producto_id) {
  try {
    // 1️⃣ Buscar el ID de la nueva categoría por su nombre
    const { data: categoria, error: errorCategoria } = await supabase
      .from("categorias")
      .select("categoria_id")
      .eq("nombre_categoria", nombre_categoria)
      .single();

    if (errorCategoria || !categoria) {
      throw new Error("La categoría no existe en la base de datos");
    }

    // 2️⃣ Usar el ID encontrado para actualizar el producto
    const { error } = await supabase
      .from("productos")
      .update({ categoria_id: categoria.categoria_id }) // Se actualiza la relación con la categoría
      .eq("producto_id", producto_id);

    if (error) throw error;

    console.log("Categoría del producto actualizada correctamente");
  } 

  catch (error) {
    console.error("Error en updateCategoriaProductoDB:", error.message);
    throw error;
  } 


}

export async function updateDetallesProductoDB(detalles, id) {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ detalles })
      .eq("producto_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateDetallesProductoDB:", error.message);
    throw error;
  }
}

export async function updateDescripcionProductoDB(descripcion, id) {
  try {
    const { error } = await supabase
      .from("productos")
      .update({ descripcion })
      .eq("producto_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateDescripcionProductoDB:", error.message);
    throw error;
  }
}

export async function updateColorProductoDB(insertar_color, id) {
  try {
    const { error } = await supabase
      .from("colores")
      .update({ insertar_color })
      .eq("color_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateColorProductoDB:", error.message);
    throw error;
  }
}

export async function updateTalleProductoDB(insertar_talle, id) {
  try {
    const { error } = await supabase
      .from("talles")
      .update({ insertar_talle }) // Corregido: Se debe pasar un objeto {}
      .eq("talle_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateTalleProductoDB:", error.message);
    throw error;
  }
}

export async function updateStockProductoDB(stock, id) {
  try {
    if (typeof stock !== "number") {
      throw new Error("El stock debe ser un número");
    }

    const { error } = await supabase
      .from("productos_variantes")
      .update({ stock })
      .eq("producto_id", id);

    if (error) throw error;
    
    return;
  } catch (error) {
    console.error("Error en updateStockProductoDB:", error.message);
    throw error;
  }
}








export async function actualizarImagenesDB(id, urlAntigua, urlNueva) {
  try {
    // Primero obtenemos el array de imágenes actual
    const { data: imagenData, error: fetchError } = await supabase
      .from('imagenes')
      .select('urls')
      .eq('producto_id', id)
      .single(); // Solo queremos un objeto, no un array de resultados

    if (fetchError) {
      console.error('Error al obtener las imágenes:', fetchError.message);
      return;
    }

    let urlsArray = imagenData.urls || []; // Si está vacío, asignamos un array vacío

    // Buscar la URL antigua y reemplazarla con la nueva
    const index = urlsArray.indexOf(urlAntigua);
    if (index !== -1) {
      urlsArray[index] = urlNueva;
    } else {
      console.warn('La URL antigua no se encontró en la base de datos.');
      return;
    }

    // Actualizar el array modificado en la base de datos
    const { data, error } = await supabase
      .from('imagenes')
      .update({ urls: urlsArray })
      .eq('producto_id', id)
      .select();

    if (error) {
      console.error('Error al actualizar imágenes:', error.message);
    }

    console.log(data, 'Imágenes actualizadas');

    return data;
  } catch (err) {
    console.error('Error en la consulta:', err.message);
  }
} 


export async function ingresarIDVariantesDB(insertar_variantes) {
  try {
    const { data, error } = await supabase
      .from('productos_variantes')  // Nombre de la tabla
      .insert([insertar_variantes]) // Insertamos el array de objetos
      .select();
      

      
    if (error) {
      console.error('Error al insertar:', error);
      return null;
    }

    console.log('Variantes insertadas:', data);
    return data;
  } catch (err) {
    console.error('Hubo un error al insertar las variantes en la base de datos:', err);
    return null;
  }
} 




