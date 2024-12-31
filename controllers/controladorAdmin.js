
import { administradorLogeoDB } from "../model/adminDB.js";
import { obtenerAdministrador } from "../model/adminDB.js";
import { borrarCarritoDB, insertarCarritoDB, updateCarritoDB } from "../model/carritoDB.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path"; 
import dotenv from "dotenv" 


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploaddirectorio = path.join(__dirname, "../uploads");
const urlBack = process.env.URL_BACKEND;


export async function administradorRegistro(req, res) { 
    let { nombre_usuario, email, contrasena } = req.body;
    let data = { nombre_usuario, email, contrasena };

    try {
        let response = await administradorLogeoDB(data);

        if (!response.success) {
            return res.status(500).json({
                message: 'ocurrio un error al insertar los productos',
                error: response.message
            });
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
            message: 'ocurrio un error al insertar los productos',
            error: err.message
        });
    }
}
 

export async function obtenerAdminitradorController(req, res) {
    try {
        let response = await obtenerAdministrador();

        if (!response.success) {
            return res.status(500).json({
                message: 'ocurrio un error al obtener los productos',
                error: response.message
            });
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
            message: 'ocurrio un error al obtener los productos',
            error: err.message
        });
    }
}  

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploaddirectorio);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  export const upload = multer({ storage: storage });
  


export const respuestaInsercion = async (req, res) => { 
    try {
        const { nombre,precio,categoria,stock } = req.body; 
      

        let nombre_producto=nombre;
  
        const imagen = req.file ? req.file.filename : null;
        const url = imagen ? `${urlBack}/uploads/${imagen}` : null;
  
  
        if (!nombre || !precio|| !categoria || !stock ) {
            return res.status(400).json({ error: "Campos vacíos" });
        }
        
     
   
        // Usando Supabase para insertar el nuevo usuario
        const data = await insertarCarritoDB({nombre_producto,precio,categoria,stock,imagenes:url}); 

         
      
      res.status(201).json({ message: "Producto insertado", data });
       
       
    } catch (err) {
        console.error("Error al insertar usuario:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
  };  

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


 

  



 