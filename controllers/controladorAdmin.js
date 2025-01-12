
import { administradorLogeoDB } from "../model/adminDB.js";
import { borrarCarritoDB, insertarCarritoDB, updateCarritoDB } from "../model/carritoDB.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path"; 
import dotenv from "dotenv" 
import { console } from "inspector";
import { categoriasAgregar } from "../model/adminDB.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploaddirectorio = path.join(__dirname, "../uploads");
const urlBack = process.env.URL_BACKEND;


export async function administradorRegistro(req, res) { 
    let { nombre_usuario, email, contrasena } = req.body;
    let data = { nombre_usuario, email, contrasena,verificado:true };

    try {
        let response = await administradorLogeoDB(data);

        if (!response.success) {
          throw new Error("no se registro el administrador")
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
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
    const { nombre_producto, precio, stock, categorias } = req.body;
    console.log(nombre_producto,categorias,'el rama')
  
    try {
      // Validación de campos
      if (!nombre_producto || !precio || !categorias || !stock) {
        throw new Error('Faltan campos obligatorios');
      }
  
      // Obtener el categoria_id
      const categoriaId = await categoriasAgregar(categorias);
      console.log('Categoría encontrada:', categoriaId);
  
      // Crear URL de imagen (si existe)
      const imagen = req.file ? req.file.filename : null;
      const url = imagen ? `${urlBack}/uploads/${imagen}` : null;
  
      // Insertar el producto
      const producto = await insertarCarritoDB({
        nombre_producto,
        precio,
        stock,
        imagenes: url,
        categoria_id: categoriaId, // Clave foránea
      });
  
      res.status(201).json({ message: 'Producto insertado', data: producto });
    } catch (err) {
      console.error('Error al insertar el producto:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

  export async function updateCarrito(req,res){  



    const id=req.params.id
    const nombre_producto=req.body.nombre_producto 
    const precio=req.body.precio
    const categoria=req.body.categorias
    const stock=req.body.stock 

      const categoriaId = await categoriasAgregar(categoria);
      console.log('Categoría encontrada:', categoriaId);
  
   
    const imagen = req.file ? req.file.filename : null;
    const url = imagen ? `${urlBack}/uploads/${imagen}` : null;
      


    try{ 
      

        let dataProducto=await updateCarritoDB(id,nombre_producto,precio,categoriaId,url,stock ) 

        console.log(dataProducto,'cambiazo')
      

         if(!dataProducto){
             throw new Error('no se recibieron los productos')
        } 

        res.json({data:dataProducto}) 
    } 

    catch(err){
        res.status(500).json({error:err.message})
    }

} 

export async function deleteCarrito(req, res) {
    let { id } = req.params; // Extraer el ID de los parámetros de la URL 
    console.log(id)
    try {
        let data = await borrarCarritoDB(id); 
 

        if (!data) {
            throw new Error('Producto no encontrado')              
        }

        res.json({ eliminado: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error eliminando el producto', error: err.message });
    }
}  


 

  



 