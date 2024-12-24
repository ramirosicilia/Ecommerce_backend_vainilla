


import { fileURLToPath } from "url";
import dotenv from "dotenv"
import path from "path";
import { obtenerProductos } from "../model/carritoDB.js"; 
import { insertarCarritoDB } from "../model/carritoDB.js";
import { updateCarritoDB } from "../model/carritoDB.js"; 
import { borrarCarritoDB } from "../model/carritoDB.js";
import { obtenerProductoPorId } from "../model/carritoDB.js"; 
import { supabase } from "../model/DB.js";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function enviarProductos(req,res){  
    


    try{   
        let data=await obtenerProductos() 

        if(!data){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,data})


    } 

    catch(err){
        res.status(500).json('ocurrio un error al recibir los productos',err.message)
    }

}  

export async function subirProducto(datosProducto) {
    const { nombre, precio, categoria, stock, imagen } = datosProducto;

    try {
        // Subir la imagen al bucket de Supabase Storage
        const nombreArchivo = `${Date.now()}-${imagen}`;
        const { data, error } = await supabase.storage
            .from('imagenes') // Cambia al nombre de tu bucket de Supabase
            .upload(nombreArchivo, imagen);

        if (error) {
            throw new Error('Error subiendo la imagen: ' + error.message);
        }

        // Obtener la URL pública de la imagen subida
        const urlImagen = supabase.storage
            .from('imagenes')
            .getPublicUrl(nombreArchivo).data.publicUrl;

        // Insertar el producto en la tabla incluyendo la URL de la imagen y los datos adicionales
        const { error: errorInsert } = await supabase
            .from('productos')
            .insert([{ nombre, precio, categoria, stock, url_imagen: urlImagen }]);

        if (errorInsert) {
            throw new Error('Error insertando el producto: ' + errorInsert.message);
        }

    } catch (error) {
        console.error(error.message);

    }
}





export async function updateCarrito(req,res){  
    const urlBackImagen = process.env.URL_BACK_IMAGEN;
    const imagen = req.file ? req.file.filename : null;
    const url = imagen ? `${urlBackImagen}/${imagen}` : null;
 
     

    let {id}=req.params 
    let {nombre_producto,precio,categoria}=req.body 
    let updata={nombre_producto,precio,categoria,imagenes:url}

    try{ 
      
    
        let data=await updateCarritoDB(id,updata) 
        let obtenerObjecto=data.find((element)=>element.producto_id==id)

        if(!obtenerObjecto){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,obtenerObjecto}) 
    } 

    catch(err){
        res.status(500).json('ocurrio un error al actualizar los productos los productos',err.message)
    }

} 

export async function deleteCarrito(req, res) {
    let { id } = req.params; // Extraer el ID de los parámetros de la URL 
    console.log(id)
    try {
        let data = await borrarCarritoDB(id); 
 

        if (!data) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        res.json({ eliminado: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error eliminando el producto', error: err.message });
    }
} 

export async function obtenerProductoID(req,res){  
    let {id}=req.params 

    try{ 
        let data=await obtenerProductoPorId(id) 

        if(!data){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,data})
    } 

    catch(err){
        res.status(500).json('ocurrio un error al recibir los productos',err.message)
    }

} 



