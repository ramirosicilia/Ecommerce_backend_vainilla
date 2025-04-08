
import { administradorLogeoDB
    
} from "../model/adminDB.js";
import { borrarCarritoDB, insertarCarritoDB, insertarImagenDB, obtenerImagenesDB, actualizarImagenesDB, coloresAgregarID, tallesAgregarID, ingresarColoresDB, ingresarTallesDB, ingresarIDVariantesDB, updateNombreProductoDB, updatePrecioProductoDB, updateDetallesProductoDB, updateDescripcionProductoDB, updateColorProductoDB, updateTalleProductoDB, updateStockProductoDB, updateCategoriaProductoDB, agregarImagenesDB,eliminarImagenesDB,
  eliminarNombreProductoDB,eliminarPrecioProductoDB,eliminarTallesProductoDB,eliminarColoresProductoDB,eliminarStockProductoDB,eliminarDetalleProductoDB,eliminarDescripcionProductoDB} from "../model/carritoDB.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path"; 
import dotenv from "dotenv" 
import { console } from "inspector/promises";





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
    

    const { nombre_producto, precio, categorias, colores, talles,stock, detalles,descripcion } = req.body;
    const images = req.files ? req.files.images : []; 
    console.log( nombre_producto, precio, colores, talles, stock, detalles,descripcion)

    console.log(images) 

    let categoria_id=categorias




    try {
     

        // ✅ Validación de campos obligatorios
       if (!nombre_producto || !precio  || !detalles || !descripcion || !categoria_id) {
            throw new Error("⚠️ Faltan campos obligatorios");
        }

        // ✅ Procesar imágenes si existen
       // ✅ Verificar si `req.files` tiene imágenes antes de procesarlas
       let imagenes = (req.files && req.files.length > 0)
       ? req.files.map(file => `${urlBack}/uploads/${file.filename}`)
       : [];
   

// ⚠️ Verificación final para evitar nulls en la base de datos
        if (!imagenes.length) {
            throw new Error("⚠️ No se subieron imágenes a Supabase");
        }

        
        
        // ✅ Insertar el producto en la base de datos
         const productos = await insertarCarritoDB({
            nombre_producto,
            precio,
            categoria_id,
            detalles,
            descripcion
        }); 

        console.log(productos)

        console.log("🛍️ Producto insertado:", productos);  

        console.log(imagenes,'las imagenes Ramaaaaa')

        const datos={
            urls:imagenes,
            producto_id:productos.producto_id
        }
          console.log("los datos",datos) 


       
        const insertarImagenControlador= await insertarImagenDB(datos)


        console.log('Imagenes insertadas:',insertarImagenControlador)

        
        
        res.status(201).json({ message: "🎉 Producto insertado correctamente",nombre:nombre_producto,id:productos.producto_id}); 



    } catch (err) {
        console.error("🚨 Error al insertar el producto:", err.message);
        res.status(500).json({ error: err.message });
    }
}; 





 export async function ingresoCaracterticasController(req, res) {

    console.log('hola')

  const { insertar_talle,insertar_color,stock,producto_id} = req.body; 

    console.log(insertar_color, insertar_talle,stock, 'colores y talles')
      try {
        // Verificar si se recibieron colores y talles
       if (!insertar_color || !insertar_talle || !stock || !producto_id) {
            throw new Error("⚠️ Faltan campos obligatorios");
        }

   

        // Insertar colores y talles en la base de datos
        const coloresInsertados = await ingresarColoresDB({insertar_color:insertar_color});
        const tallesInsertados = await ingresarTallesDB({insertar_talle:insertar_talle});
  
        console.log(coloresInsertados, tallesInsertados, 'colores y talles insertados')

        const color_id=await coloresAgregarID(coloresInsertados[0].color_id)
        const talle_id=await tallesAgregarID(tallesInsertados[0].talle_id) 
        console.log(color_id, talle_id, 'colores y talles id') 
          console.log(producto_id, 'producto_id')
   

        let variantes = await ingresarIDVariantesDB({
            producto_id: producto_id,
            talle_id,
            color_id,
            stock
          });
            console.log('variantes',variantes)        

        res.json("🎉 Características ingresadas correctamente");  



    } catch (err) {
        console.error("❌ Error al ingresar características:", err);
        res.status(500).json({ error: err.message });
    } 

} 




export async function updateNombreProducto(req,res){ 

  try {
    const { nombre_producto } = req.body;
    const { id } = req.params;
    
    const error = await updateNombreProductoDB(nombre_producto, id);
    if (error) return res.status(500).json({ error });

    res.json({ mensaje: "Nombre actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 

export async function updatePrecioProducto(req,res){ 

  let {precio}=req.body 

  let id=req.params.id 

  updatePrecioProductoDB(precio,id)

  res.json("actualizado")

} 

export async function updateCategoriaProducto(req,res){ 

  let {nombre_categoria}=req.body 

  let id=req.params.id 

  updateCategoriaProductoDB(nombre_categoria,id)



  res.json("actualizado")

} 


export async function updateDetallesProducto(req,res){ 

  let {detalles}=req.body 

  let id=req.params.id  

  updateDetallesProductoDB(detalles,id)

  res.json("actualizado")

} 

export async function updateDescripcionProducto(req,res){ 

  let {descripcion}=req.body 

  let id=req.params.id 

  updateDescripcionProductoDB(descripcion,id)

  res.json("actualizado")

} 

export async function updateColorProducto(req,res){ 

  let {insertar_color}=req.body 

  let id=req.params.id 
  console.log(insertar_color,id+"insertados")

 
  updateColorProductoDB(insertar_color,id)

  res.json("actualizado")

} 



export async function updateTalleProducto(req,res){ 

  let {insertar_talle}=req.body 

  let id=req.params.id 

  updateTalleProductoDB(insertar_talle,id)

  res.json("actualizado")

}  

export async function updateStockProducto(req,res){ 

  try {
    const { stock } = req.body;
    let{ id } = req.params;

    if (typeof stock !== "number") {
      return res.status(400).json({ error: "Stock debe ser un número" });
    }

    const error = await updateStockProductoDB(stock, id);
    if (error) return res.status(500).json({ error });

    res.json({ mensaje: "Stock actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}  





export async function deleteCarrito(req, res) {
  let { id } = req.params;
  let { color_id, talle_id } = req.body;

  console.log("ID recibido:", id, "Color ID:", color_id, "Talle ID:", talle_id);

  try {
    let data = await borrarCarritoDB(id, color_id, talle_id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ eliminado: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error eliminando el producto", error: err.message });
  }
} 



export async function obtenerImagenesController(req, res) {
   
    try {
        let data = await obtenerImagenesDB(); 
        console.log(data) 

        let dataImagenes = data.map((imagen) => {
            return {
                imagenes_id:imagen.imagenes_id,
                producto_id: imagen.producto_id,
                urls: imagen.urls
            }
        })
 

        if (dataImagenes.length===0) {
            throw new Error('Producto no encontrado')              
        } 


        res.json({data:dataImagenes});
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error eliminando el producto', error: err.message });
    } 
}  

export async function agregarImagenesController(req, res) {
  const productoID = req.body.productoID; // Obtener el ID del producto desde el body
  console.log(productoID, 'productoID');
  console.log(req.files, 'files'); // Verificar los archivos recibidos

  try {
      // Verificar que se haya recibido al menos una imagen
      if (!req.files || req.files.length === 0) {
          throw new Error('No se recibieron imágenes');
      }

      // Subir las imágenes a la base de datos utilizando el modelo
      const imageUrls = await agregarImagenesDB(productoID, req.files);

      res.json({ message: 'Imágenes agregadas correctamente', data: imageUrls });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
}


export async function actualizarImagenesController(req, res) {

    const id = req.params.id; 
    const urlAntigua = req.body.urlAntigua; // Obtener la URL antigua desde el body

    console.log(id, 'id');
    console.log(urlAntigua, 'URL Antigua');
    console.log(req.files, 'files');

    // Verificar si hay archivos y tomar solo el primer archivo (solo se espera una imagen)
    let imagen = null;
    if (req.files && req.files.length > 0) {
        imagen = `${urlBack}/uploads/${req.files[0].filename}`;
    }

    try {
        // Validar que se haya enviado una imagen y la URL antigua
        if (!imagen) {
            throw new Error('No se recibió ninguna imagen');
        }
        if (!urlAntigua) {
            throw new Error('No se recibió la URL antigua');
        }

        console.log(imagen, 'imagen');
        
        // Actualizar la imagen en la base de datos
        let dataImagen = await actualizarImagenesDB(id, urlAntigua, imagen);
        console.log(dataImagen, 'cambio');

        if (!dataImagen) {
            throw new Error('No se pudo actualizar la imagen');
        }

        res.json({ data: dataImagen });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
} 

export async function eliminarImagenesController(req, res) {
    const id = req.params.id; // ID de la imagen a eliminar
    const urlAntigua = req.body.urlAntigua; // URL antigua de la imagen a eliminar

    try {
        // Validar que se haya enviado una URL antigua
        if (!urlAntigua) {
            throw new Error('No se recibió la URL antigua');
        }

        // Eliminar la imagen de la base de datos
        let dataImagen = await eliminarImagenesDB(id, urlAntigua);

        if (!dataImagen) {
            throw new Error('No se pudo eliminar la imagen');
        }

        res.json({ mensaje: "Imagen eliminada con éxito" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function  eliminarNombrecontroller(req,res){


  let id=req.params.id 

await eliminarNombreProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarPrecioController(req,res){


  let id=req.params.id 

   await eliminarPrecioProductoDB(id)

  res.json("actualizado")
} 



export async function eliminarTallesController(req,res){


  let id=req.params.id 

   await eliminarTallesProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarColoresController(req,res){


  let id=req.params.id 

   await eliminarColoresProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarStockController(req,res){


  let id=req.params.id 
 
   await eliminarStockProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarDetalleController(req,res){


  let id=req.params.id 
 
   await eliminarDetalleProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarDescripcionController(req,res){


  let id=req.params.id 
 
   await eliminarDescripcionProductoDB(id)

  res.json("actualizado")
} 











